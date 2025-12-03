import 'dotenv/config'; // 로컬 .env 사용
import { Client } from '@notionhq/client';
import { execSync } from 'child_process';

// 환경변수 읽기
const { NOTION_API_KEY, NOTION_DB_ID, GITHUB_REPO, COMMIT_HASH } = process.env;

if (!NOTION_API_KEY || !NOTION_DB_ID || !GITHUB_REPO || !COMMIT_HASH) {
  throw new Error('환경변수가 설정되지 않았습니다. Secrets 및 env 확인 필요');
}

// Notion 클라이언트 초기화
const notion = new Client({ auth: NOTION_API_KEY });

// 마지막 커밋 메시지
const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();
console.log('Last commit:', lastCommit);

// Ticket ID 추출 (예: UIS-6)
const ticketMatch = lastCommit.match(/UIS-\d+/);
if (!ticketMatch) {
  console.log('Ticket ID not found in commit message.');
  process.exit(0);
}
const ticketId = ticketMatch[0];
console.log('Ticket ID:', ticketId);

// Commit prefix로 Status 매핑
let status = 'To Do';
if (lastCommit.startsWith('[MOD]')) status = 'In Progress';
if (lastCommit.startsWith('[FIX]')) status = 'Done';

(async () => {
  try {
    // Notion Database에서 Ticket 검색
    const response = await notion.databases.query({
      database_id: NOTION_DB_ID,
      filter: {
        property: 'Ticket',
        rich_text: { equals: ticketId }, // v5에서는 rich_text나 title 필드 명확히
      },
    });

    if (response.results.length === 0) {
      console.log('Ticket not found in Notion:', ticketId);
      return;
    }

    const pageId = response.results[0].id;
    const commitUrl = `https://github.com/${GITHUB_REPO}/commit/${COMMIT_HASH}`;

    // 페이지 업데이트
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: status } },
        Link: { url: commitUrl },
      },
    });

    console.log(`Notion Ticket ${ticketId} updated with status '${status}' and commit link.`);
  } catch (error) {
    console.error('Error updating Notion:', error);
  }
})();
