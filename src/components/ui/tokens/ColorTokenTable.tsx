import { useToast } from '../molecules/Toast/ToastProvider';

import Styles from '@/components/ui/tokens/TokenTable.module.scss';
import type { Column } from '../organisms/DataTable/DataTable';
import DataTable from '../organisms/DataTable/DataTable';
import Code from '../atoms/Code/Code';
import PreviewBox from '../atoms/PreviewBox/PreviewBox';
import Badge from '../atoms/Badge/Badge';

// DataTable의 제네릭 제약 조건(id 필수)을 만족하기 위해 id 추가
interface ColorTokenItem {
  id: string;
  lightValue: string;
  darkValue: string;
  description?: string;
  usage?: string;
}

interface TokenTableProps {
  title: string;
  category: 'System' | 'Functional' | 'Elevation';
  tokens: ColorTokenItem[];
}

const ColorTokenTable = ({ title, category, tokens }: TokenTableProps) => {
  const { addToast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label}: ${text} 복사되었습니다.`, 'success');
    } catch (err) {
      addToast('복사에 실패했습니다.', 'error');
    }
  };

  // DataTable에 주입할 컬럼 정의
  const columns: Column<ColorTokenItem>[] = [
    {
      key: 'name',
      header: 'Token Name (Copy)',
      render: (value, row) => (
        <button
          className='token-table__copy-btn'
          onClick={() => handleCopy(`var(${row.id})`, '변수명')}
          aria-label={`${row.id} 변수 복사`}
        >
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
        <div className={Styles.description}>
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
        data={tokens}
        variant='outline'
        color='primary'
        size='md'
      />
    </div>
  );
};

export default ColorTokenTable;
