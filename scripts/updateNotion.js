import 'dotenv/config';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

const {
  NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID,
  TASK_DB_NAME,
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
  TASK_DB_NAME,
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

// 현재 값 출력 (디버깅용)
console.log('🔧 Current environment variables:');
console.table({
  NOTION_API_KEY: !!NOTION_API_KEY,
  NOTION_PARENT_PAGE_ID: !!NOTION_PARENT_PAGE_ID,
  TASK_DB_NAME: !!TASK_DB_NAME,
  GITHUB_REPO: !!GITHUB_REPO,
  REPO_TOKEN: !!REPO_TOKEN,
  PR_BRANCH,
});

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
      branch: pr.head.ref,
    });
    return pr;
  } catch (err) {
    console.error('❌ Error fetching PR info:', err);
    return null;
  }
}

// 실행
(async () => {
  await getPrInfo();
})();
