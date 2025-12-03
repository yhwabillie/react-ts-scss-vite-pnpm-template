// scripts/updateNotionPR.js
import 'dotenv/config';
import { Client } from '@notionhq/client';
import fetch from 'node-fetch';
import { execSync } from 'child_process';

const {
  NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME, // 최종 업데이트된 Task DB 이름
  GITHUB_REPO,
  REPO_TOKEN, // GitHub API 접근용 토큰
} = process.env;

// 현재 Git 브랜치 가져오기
function getCurrentGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (err) {
    console.error('❌ Cannot get current Git branch:', err);
    return null;
  }
}

const PR_BRANCH = getCurrentGitBranch();

// 환경변수 체크
const requiredEnvs = {
  NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME,
  GITHUB_REPO,
  REPO_TOKEN,
  PR_BRANCH,
};

const emptyEnvs = Object.entries(requiredEnvs)
  .filter(([_, v]) => !v)
  .map(([key]) => key);

if (emptyEnvs.length) {
  console.warn(
    '⚠️ Missing environment variables (PR_BRANCH auto-detected if local):',
    emptyEnvs.join(', '),
  );
} else {
  console.log('✅ All required environment variables are set.');
}

// 디버깅용 table 로그
console.log('🔧 Current environment variables:');
console.table({
  NOTION_API_KEY: !!NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID: !!NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME,
  GITHUB_REPO,
  REPO_TOKEN: !!REPO_TOKEN,
  PR_BRANCH,
});

const notion = new Client({ auth: NOTION_API_KEY });

// GitHub API로 PR 정보 가져오기
async function getPrInfo() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/pulls?head=${PR_BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${REPO_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const prs = await res.json();
    if (!prs.length) {
      console.warn(`⚠️ No PR found for branch: ${PR_BRANCH}`);
      return null;
    }

    const pr = prs[0]; // 여러 PR이면 첫 번째
    console.log('🔍 PR info fetched from GitHub API:');
    console.table({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      merged: pr.merged,
      merge_commit_message: pr.merge_commit_message,
      branch: pr.head.ref,
    });

    return pr;
  } catch (err) {
    console.error('❌ Error fetching PR info:', err);
    return null;
  }
}

// 브랜치 이름 → Ticket ID 추출 (UIS-12 형태 전체)
function extractTicketIdFromBranch(branch) {
  const namePart = branch.split('/').pop();
  const match = namePart.match(/(UIS-\d+)/i);
  return match ? match[1].toUpperCase() : null;
}

// merge commit message → Notion Status 매핑
function mapCommitMessageToStatus(commitMessage) {
  if (!commitMessage) return '시작 전';
  const msg = commitMessage.toLowerCase().trim();
  if (msg.startsWith('[done]')) return '완료';
  if (msg.startsWith('[in progress]')) return '진행 중';
  if (msg.startsWith('[to do]')) return '시작 전';
  return '시작 전';
}

// Task DB 찾기
async function findTaskDatabaseId() {
  const blocks = await notion.blocks.children.list({
    block_id: NOTION_PARENT_PAGE_ID,
  });

  const taskDbBlock = blocks.results.find(
    b => b.type === 'child_database' && b.child_database?.title === NOTION_TASK_DB_NAME,
  );

  if (!taskDbBlock) throw new Error(`Child database "${NOTION_TASK_DB_NAME}" not found.`);

  console.log(`✅ Found Task DB: "${NOTION_TASK_DB_NAME}" (ID: ${taskDbBlock.id})`);
  return taskDbBlock.id;
}

// Ticket 페이지 찾고 업데이트
async function findTicketPageAndUpdate(taskDbId, ticketId, status, prUrl) {
  const searchRes = await notion.search({
    query: '',
    filter: { value: 'page', property: 'object' },
    page_size: 100,
  });

  const ticketRows = searchRes.results.filter(page => {
    const ticketProp = page.properties['Ticket']?.unique_id;
    if (!ticketProp) return false;
    return (
      `${ticketProp.prefix}-${ticketProp.number}` === ticketId &&
      page.parent?.database_id === taskDbId
    );
  });

  if (!ticketRows.length) throw new Error(`Ticket "${ticketId}" not found in Task DB`);

  await notion.pages.update({
    page_id: ticketRows[0].id,
    properties: { status: { status: { name: status } }, url: { url: prUrl } },
  });

  // 로그 table로 확인
  console.log('✅ Updated Notion Ticket:');
  console.table({
    ticketId,
    status,
    prUrl,
  });
}

// 메인 실행
(async () => {
  try {
    const prInfo = await getPrInfo();
    if (!prInfo || !prInfo.merged) {
      console.log('⚠️ PR not merged → Not updating Notion.');
      return;
    }

    const ticketId = extractTicketIdFromBranch(prInfo.head.ref);
    if (!ticketId) {
      console.log(`⚠️ No Ticket ID found in branch name: ${PR_BRANCH}`);
      return;
    }

    const status = mapCommitMessageToStatus(prInfo.merge_commit_message);
    const taskDbId = await findTaskDatabaseId();
    await findTicketPageAndUpdate(taskDbId, ticketId, status, prInfo.html_url);
  } catch (err) {
    console.error('❌ Error updating Notion:', err);
  }
})();
