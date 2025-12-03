// scripts/updateNotion.js
import 'dotenv/config';
import { Client } from '@notionhq/client';
import { execSync } from 'child_process';

const {
  NOTION_API_KEY,
  NOTION_DB_ID,
  NOTION_PARENT_PAGE_ID,
  TASK_DB_NAME,
  GITHUB_REPO,
  COMMIT_HASH,
} = process.env;

const requiredEnvs = {
  NOTION_API_KEY,
  NOTION_DB_ID,
  NOTION_PARENT_PAGE_ID,
  TASK_DB_NAME,
  GITHUB_REPO,
  COMMIT_HASH,
};

// 비어 있는 환경변수만 확인
const emptyEnvs = Object.entries(requiredEnvs)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (emptyEnvs.length) {
  console.error('❌ 다음 환경변수가 설정되지 않았습니다:', emptyEnvs.join(', '));
  throw new Error('환경변수 확인 필요');
}

// 디버깅용 전체 출력 (원하면)
console.log('🔧 현재 환경변수 값:', requiredEnvs);

// if (
//   !NOTION_API_KEY ||
//   !NOTION_DB_ID ||
//   !NOTION_PARENT_PAGE_ID ||
//   !TASK_DB_NAME ||
//   !GITHUB_REPO ||
//   !COMMIT_HASH
// ) {
//   throw new Error('환경변수가 설정되지 않았습니다. Secrets 및 env 확인 필요');
// }

const notion = new Client({ auth: NOTION_API_KEY });

// 마지막 커밋 메시지 가져오기
function getLastCommitMessage() {
  return execSync('git log -1 --pretty=%B').toString().trim();
}

// Commit prefix로 상태(Status) 매핑
function mapCommitToStatus(commitMsg) {
  if (commitMsg.startsWith('[FIX]')) return '완료';
  if (commitMsg.startsWith('[MOD]')) return '진행 중';
  return 'To Do';
}

// 상위 페이지에서 Child Database(Task) 찾기
async function findTaskDatabaseId() {
  const blocks = await notion.blocks.children.list({ block_id: NOTION_PARENT_PAGE_ID });
  const taskDbBlock = blocks.results.find(
    block => block.type === 'child_database' && block.child_database?.title === TASK_DB_NAME,
  );

  if (!taskDbBlock) {
    throw new Error(`Child database "${TASK_DB_NAME}" not found under the parent page`);
  }

  console.log(`✅ Found Task DB: "${TASK_DB_NAME}"`);
  console.log(`   Database ID: ${taskDbBlock.id}`);
  console.log(`   Parent Page ID: ${taskDbBlock.parent.page_id}`);

  return taskDbBlock.id;
}

// async function findTaskDatabaseId() {
//   const blocks = await notion.blocks.children.list({ block_id: NOTION_PARENT_PAGE_ID });
//   console.log(
//     'Blocks under parent page:',
//     blocks.results.map(b => ({
//       id: b.id,
//       type: b.type,
//       title: b.child_database?.title,
//     })),
//   );

//   const taskDbBlock = blocks.results.find(
//     block => block.type === 'child_database' && block.child_database?.title === TASK_DB_NAME,
//   );

//   if (!taskDbBlock) {
//     throw new Error(`Child database "${TASK_DB_NAME}" not found under the parent page`);
//   }

//   return taskDbBlock.id;
// }

// Task DB 안에서 Ticket 페이지 검색 후 상태 및 URL 업데이트
async function findTicketPageAndUpdate(taskDbId, ticketId, status, commitUrl) {
  const searchRes = await notion.search({
    query: '',
    filter: { value: 'page', property: 'object' },
    page_size: 100,
  });

  const ticketRows = searchRes.results.filter(page => {
    const ticketProp = page.properties['Ticket']?.unique_id;
    if (!ticketProp) return false;

    const fullId = `${ticketProp.prefix}-${ticketProp.number}`;
    return fullId === ticketId && page.parent?.database_id === taskDbId;
  });

  if (!ticketRows.length) {
    throw new Error(`Ticket "${ticketId}" not found in Task DB`);
  }

  const ticketPage = ticketRows[0];

  await notion.pages.update({
    page_id: ticketPage.id,
    properties: {
      status: { status: { name: status } },
      url: { url: commitUrl },
    },
  });

  console.log(`✅ Updated Notion Ticket: "${ticketId}"`);
  console.log(`   Status: ${status}`);
  console.log(`   Commit URL: ${commitUrl}`);

  return ticketPage;
}

// 메인 실행
(async () => {
  try {
    const lastCommit = getLastCommitMessage();
    console.log(`📝 Last commit message: "${lastCommit}"`);

    const status = mapCommitToStatus(lastCommit);
    const ticketMatch = lastCommit.match(/UIS-(\d+)/);
    if (!ticketMatch) {
      console.log('⚠️ Ticket ID not found in commit message.');
      return;
    }

    const ticketNumber = ticketMatch[1]; // 숫자만
    const ticketId = `UIS-${ticketNumber}`; // UIS-6 형태 그대로
    const commitUrl = `https://github.com/${GITHUB_REPO}/commit/${COMMIT_HASH}`;

    console.log(`🔍 Searching for Ticket: "${ticketId}"`);

    const taskDbId = await findTaskDatabaseId();

    await findTicketPageAndUpdate(taskDbId, ticketId, status, commitUrl);
  } catch (err) {
    console.error('❌ Error updating Notion:', err);
  }
})();
