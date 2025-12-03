import 'dotenv/config'; // 로컬 .env 사용
import { Client } from '@notionhq/client';
import { execSync } from 'child_process';

const { NOTION_API_KEY, NOTION_DB_ID, GITHUB_REPO, COMMIT_HASH } = process.env;

if (!NOTION_API_KEY || !NOTION_DB_ID || !GITHUB_REPO || !COMMIT_HASH) {
  throw new Error('환경변수가 설정되지 않았습니다. Secrets 및 env 확인 필요');
}

const notion = new Client({ auth: NOTION_API_KEY });

const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();
console.log('Last commit:', lastCommit);

const ticketMatch = lastCommit.match(/UIS-\d+/);
if (!ticketMatch) {
  console.log('Ticket ID not found in commit message.');
  process.exit(0);
}
const ticketId = ticketMatch[0];
console.log('Ticket ID:', ticketId);

let status = 'To Do';
if (lastCommit.startsWith('[MOD]')) status = 'In Progress';
if (lastCommit.startsWith('[FIX]')) status = 'Done';

(async () => {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DB_ID,
      filter: { property: 'Ticket', text: { equals: ticketId } },
    });

    if (response.results.length === 0) {
      console.log('Ticket not found in Notion:', ticketId);
      return;
    }

    const pageId = response.results[0].id;
    const commitUrl = `https://github.com/${GITHUB_REPO}/commit/${COMMIT_HASH}`;

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
