import { useToast } from '@/components/ui/molecules/Toast/ToastProvider';
import Styles from '@/components/ui/tokens/TokenTable.module.scss';
import type { Column } from '@/components/ui/organisms/DataTable/DataTable';
import DataTable from '@/components/ui/organisms/DataTable/DataTable';
import Code from '@/components/ui/atoms/Code/Code';
import PreviewBox from '@/components/ui/atoms/PreviewBox/PreviewBox';
import Badge from '@/components/ui/atoms/Badge/Badge';

const PROJECT_NAME = 'project';

// Primitive 전용 인터페이스
interface PrimitiveTokenItem {
  id: string; // 변수명 (예: --color-primitive-gray-0)
  name: string; // 원본 키 (예: color-0)
  value: string; // HEX/RGBA 값
  usage?: string; // 카테고리 (예: GRAY Palette)
  description?: string;
}

interface PrimitiveTableProps {
  title: string;
  category: 'Base' | 'Alpha' | 'System'; // Primitive의 성격에 맞는 카테고리
  tokens: PrimitiveTokenItem[];
}

const PrimitiveColorTokenTable = ({ title, category, tokens }: PrimitiveTableProps) => {
  const { addToast } = useToast();

  /**
   * 1. ID 표준화 로직
   * --{project}-color-primitive-{category}-{name} 형태로 출력되도록 보장합니다.
   */
  const getNormalizedVarName = (id: string) => {
    const cleanId = id.replace(/^primitive-/, '').replace(/^--color-primitive-/, '');
    return `--${PROJECT_NAME}-color-primitive-${cleanId}`;
  };

  const normalizedData = tokens.map(token => ({
    ...token,
    normalizedId: getNormalizedVarName(token.id),
  }));

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label}: ${text} 복사되었습니다.`, 'success');
    } catch (err) {
      addToast('복사에 실패했습니다.', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'normalizedId',
      header: 'Variable (Copy)',
      render: value => (
        <button
          className='token-table__copy-btn'
          onClick={() => handleCopy(`var(${value})`, '변수명')}
          aria-label={`${value} 변수 복사`}
        >
          <Code>{value}</Code>
        </button>
      ),
    },
    {
      key: 'preview',
      header: 'Preview',
      width: '100px',
      render: (_, row) => (
        /* Primitive는 L/D 구분이 없으므로 동일한 값을 전달하거나 단일 프리뷰 박스 사용 */
        <PreviewBox lightValue={row.value} />
      ),
    },
    {
      key: 'value',
      header: 'Hex/RGBA (Copy)',
      render: value => (
        <button className='token-table__copy-btn' onClick={() => handleCopy(value, '색상값')}>
          <Code>{value}</Code>
        </button>
      ),
    },
  ];

  return (
    <div className={Styles['token-table']}>
      <div className='token-table__title'>
        <h3>{title}</h3>
        <Badge variant='solid' size='sm' color='secondary' label={category} />
      </div>
      <DataTable
        caption={title}
        summary={`${title} 원색 디자인 토큰 목록입니다. 이 토큰은 직접 사용하지 않고 Semantic 토큰의 참조용으로만 사용합니다.`}
        columns={columns}
        data={normalizedData}
        variant='outline'
        color='primary'
        size='md'
      />
    </div>
  );
};

export default PrimitiveColorTokenTable;
