import 'dotenv/config';
import { Client } from '@notionhq/client';
import fetch from 'node-fetch';
import { execSync } from 'child_process';

// 환경변수
const {
  NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME,
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

// 필수 환경변수 체크
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

// 디버깅용 값 출력
console.log('🔧 Current environment variables:');
console.table({
  NOTION_API_KEY: !!NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID: !!NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME: !!NOTION_TASK_DB_NAME,
  GITHUB_REPO: !!GITHUB_REPO,
  REPO_TOKEN: !!REPO_TOKEN,
  PR_BRANCH,
});

// Notion client
const notion = new Client({ auth: NOTION_API_KEY });

// PR 정보 가져오기
async function getPrInfo() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/pulls?head=${PR_BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${REPO_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

    const prs = await res.json();
    if (!prs.length) {
      console.warn(`⚠️ No PR found for branch: ${PR_BRANCH}`);
      return null;
    }

    // main 브랜치 대상으로 필터링
    const prsForMain = prs.filter(pr => pr.base.ref === 'main');

    if (!prsForMain.length) {
      console.warn(`⚠️ No PR targeting main for branch: ${PR_BRANCH}`);
      return null;
    }

    if (prsForMain.length > 1) {
      console.warn(`⚠️ Multiple PRs found for branch ${PR_BRANCH} -> main. Using the first one.`);
    }

    console.log('🔍 PRs targeting main branch:');
    console.table(
      prsForMain.map(pr => ({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        merged: !!pr.merged,
        branch: pr.head.ref,
      })),
    );

    return prsForMain[0];
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

// PR Title → Notion Status
function mapPrTitleToStatus(title) {
  if (title.startsWith('[done]')) return '완료';
  if (title.startsWith('[in progress]')) return '진행 중';
  if (title.startsWith('[to do]')) return '시작 전';
  return '시작 전'; // 디폴트
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

// Ticket 업데이트
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

  // 업데이트할 Notion 속성 구성
  const properties = {
    status: { status: { name: status } },
    url: { url: prUrl },
  };

  // [done]이면 end_date를 오늘 날짜로 설정
  if (status === '완료') {
    const today = new Date();
    today.setHours(today.getHours() + 9); // UTC에서 KST로 보정

    const formatted = today.toISOString().split('T')[0]; // YYYY-MM-DD
    properties.end_date = { date: { start: formatted } };
  } else if (status === '진행 중' || status === '시작 전') {
    properties.end_date = { date: null };
  }

  await notion.pages.update({
    page_id: ticketRows[0].id,
    properties,
  });

  console.log('🔧 Variables used for update:');
  console.table({ ticketId, status, prUrl, end_date: properties.end_date?.date?.start || null });
  console.log(`✅ Updated Notion Ticket "${ticketId}"`);
}

// 메인 실행
(async () => {
  try {
    const prInfo = await getPrInfo();
    if (!prInfo) return;

    const ticketId = extractTicketIdFromBranch(prInfo.head.ref);
    if (!ticketId) {
      console.warn(`⚠️ No Ticket ID found in branch name: ${prInfo.head.ref}`);
      return;
    }

    // 머지 여부와 관계없이 Notion 업데이트
    const status = mapPrTitleToStatus(prInfo.title);
    const taskDbId = await findTaskDatabaseId();
    await findTicketPageAndUpdate(taskDbId, ticketId, status, prInfo.html_url);
  } catch (err) {
    console.error('❌ Error updating Notion:', err);
  }
})();
