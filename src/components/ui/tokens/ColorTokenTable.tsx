import { useToast } from '@/components/ui/molecules/Toast/ToastProvider';
import Styles from '@/components/ui/tokens/TokenTable.module.scss';
import type { Column } from '@/components/ui/organisms/DataTable/DataTable';
import DataTable from '@/components/ui/organisms/DataTable/DataTable';
import Code from '@/components/ui/atoms/Code/Code';
import PreviewBox from '@/components/ui/atoms/PreviewBox/PreviewBox';
import Badge from '@/components/ui/atoms/Badge/Badge';

// 1. 프로젝트 이름 상수 (필요 시 상위에서 props로 받아도 좋습니다)
const PROJECT_NAME = 'project';

interface ColorTokenItem {
  id: string;
  lightValue: string;
  darkValue: string;
  description?: string;
  usage?: string;
}

interface TokenTableProps {
  title: string;
  category: 'System' | 'Functional' | 'Component';
  tokens: ColorTokenItem[];
}

const ColorTokenTable = ({ title, category, tokens }: TokenTableProps) => {
  const { addToast } = useToast();

  /** * 2. ID 정제 로직
   * 어떤 형태의 ID가 들어와도 --{project}-color-{name} 형태로 표준화합니다.
   */
  const getNormalizedVarName = (id: string) => {
    // 1) 앞선 접두사들(--color-color-, --color-, --project-color-) 모두 제거하여 순수 이름만 추출
    const pureName = id
      .replace(new RegExp(`^--${PROJECT_NAME}-color-`), '')
      .replace(/^--color-color-/, '')
      .replace(/^--color-/, '');

    // 2) 최종적으로 우리 프로젝트 명명 규칙에 맞게 재조합
    return `--${PROJECT_NAME}-color-${pureName}`;
  };

  /** 3. 데이터 맵핑 */
  const normalizedData = tokens.map(token => ({
    ...token,
    id: getNormalizedVarName(token.id),
  }));

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label}: ${text} 복사되었습니다.`, 'success');
    } catch (err) {
      addToast('복사에 실패했습니다.', 'error');
    }
  };

  const columns: Column<ColorTokenItem>[] = [
    {
      key: 'name',
      header: 'Token Name (Copy)',
      render: (_, row) => (
        <button
          className='token-table__copy-btn'
          onClick={() => handleCopy(`var(${row.id})`, '변수명')}
          aria-label={`${row.id} 변수 복사`}
        >
          {/* 2025-12-31 수칙: title 속성 대신 텍스트로 직접 노출하여 접근성 확보 */}
          <Code>{row.id}</Code>
        </button>
      ),
    },
    {
      key: 'preview',
      header: 'Preview (L/D)',
      width: '120px',
      render: (_, row) => <PreviewBox lightValue={row.lightValue} darkValue={row.darkValue} />,
    },
    {
      key: 'lightValue',
      header: 'Light (Copy)',
      render: value => (
        <button className='token-table__copy-btn' onClick={() => handleCopy(value, '라이트 모드')}>
          <Code>{value}</Code>
        </button>
      ),
    },
    {
      key: 'darkValue',
      header: 'Dark (Copy)',
      render: value => (
        <button className='token-table__copy-btn' onClick={() => handleCopy(value, '다크 모드')}>
          <Code>{value}</Code>
        </button>
      ),
    },
    {
      key: 'description',
      header: 'Usage & Description',
      width: '30%',
      render: (_, row) => (
        <div className='token-table__description'>
          <strong>{row.usage}</strong>
          <p>{row.description}</p>
        </div>
      ),
    },
  ];

  return (
    <div className={Styles['token-table']}>
      <div className='token-table__title'>
        <h3>{title}</h3>
        <Badge variant='solid' size='sm' color='primary' label={category} />
      </div>
      <DataTable
        caption={title}
        summary={`${title}에 정의된 디자인 토큰 목록이며, 클릭 시 값이 복사됩니다.`}
        columns={columns}
        data={normalizedData}
        variant='outline'
        color='primary'
        size='md'
      />
    </div>
  );
};

export default ColorTokenTable;
