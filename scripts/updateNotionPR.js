import 'dotenv/config';
import { Client } from '@notionhq/client';
import fetch from 'node-fetch';

const {
  NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID,
  NOTION_TASK_DB_NAME,
  GITHUB_REPO,
  REPO_TOKEN,
  PR_NUMBER,
} = process.env;

if (!PR_NUMBER) {
  console.log('⚠️ PR_NUMBER not found, skipping Notion update.');
  process.exit(0);
}

const notion = new Client({ auth: NOTION_API_KEY });

// PR 정보 가져오기
async function getPrInfo(prNumber) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/pulls/${prNumber}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${REPO_TOKEN}` },
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  const pr = await res.json();

  return {
    title: pr.title,
    url: pr.html_url,
    merged: pr.merged,
    branch: pr.head.ref,
  };
}

// 브랜치명에서 Ticket ID 추출 (UIS-xxx)
function extractTicketId(branch) {
  const namePart = branch.split('/').pop();
  const match = namePart.match(/(UIS-\d+)/i);
  return match ? match[1].toUpperCase() : null;
}

// PR Title → Notion Status
function mapStatus(prTitle, prMerged) {
  if (prMerged) return '완료';
  if (prTitle.startsWith('[FIX]')) return '완료';
  if (prTitle.startsWith('[MOD]')) return '진행 중';
  return '시작 전';
}

// Task DB 찾기
async function findTaskDatabaseId() {
  const blocks = await notion.blocks.children.list({ block_id: NOTION_PARENT_PAGE_ID });
  const taskDbBlock = blocks.results.find(
    b => b.type === 'child_database' && b.child_database?.title === NOTION_TASK_DB_NAME,
  );
  if (!taskDbBlock) throw new Error(`Child database "${NOTION_TASK_DB_NAME}" not found.`);
  return taskDbBlock.id;
}

// Ticket 페이지 업데이트
async function updateTicket(taskDbId, ticketId, status, prUrl) {
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

  console.log(`✅ Updated Notion Ticket "${ticketId}"`);
  console.log(`   Status: ${status}`);
  console.log(`   PR URL: ${prUrl}`);
}

// 실행
(async () => {
  try {
    const prInfo = await getPrInfo(PR_NUMBER);
    const ticketId = extractTicketId(prInfo.branch);

    if (!ticketId) {
      console.log(`⚠️ No Ticket ID found in branch name: ${prInfo.branch}`);
      return;
    }

    const status = mapStatus(prInfo.title, prInfo.merged);
    const taskDbId = await findTaskDatabaseId();
    await updateTicket(taskDbId, ticketId, status, prInfo.url);
  } catch (err) {
    console.error('❌ Error updating Notion:', err);
  }
})();
