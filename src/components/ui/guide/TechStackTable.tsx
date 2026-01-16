// TechStackTable.mdx 또는 별도 컴포넌트 파일

import DataTable from '../organisms/DataTable/DataTable';

const techStacks = [
  {
    name: 'pnpm',
    reason: 'npm 익숙함 + yarn 효율성',
    effect: '설치 속도 3배 빠름, 디스크 50% 절약',
    icon: '📦',
  },
  {
    name: 'TypeScript',
    reason: 'Props 타입 강제',
    effect: '런타임 에러 사전 방지, IDE 자동완성',
    icon: '📘',
  },
  {
    name: 'SCSS',
    reason: '변수 & 믹스인 시스템',
    effect: '테마 전환 간편, 복잡 로직 효율적 관리',
    icon: '🎨',
  },
];

const TechStackTable = () => {
  return (
    <section>
      <h2>기술 스택 선정</h2>
      <DataTable
        aria-label='Solid Table'
        caption='Solid Table'
        color='primary'
        variant='solid'
        columns={[
          {
            header: 'ID',
            key: 'id',
            width: '80px',
          },
          {
            header: '이름',
            key: 'name',
          },
          {
            header: '이메일',
            key: 'email',
          },
        ]}
        data={[
          {
            email: 'gemini@example.com',
            id: 1,
            name: 'Gemini',
          },
          {
            email: 'john@example.com',
            id: 2,
            name: 'John Doe',
          },
          {
            email: 'jane@example.com',
            id: 3,
            name: 'Jane Smith',
          },
        ]}
        onSelectAll={() => {}}
        onSelectRow={() => {}}
        onSort={() => {}}
        size='md'
      />
    </section>
  );
};

export default TechStackTable;
