import Styles from '@/components/ui/tokens/TokenTable.module.scss';
import type { Column } from '../organisms/DataTable/DataTable';
import DataTable from '../organisms/DataTable/DataTable';
import Code from '../atoms/Code/Code';
import Badge from '../atoms/Badge/Badge';
import { useToast } from '../molecules/Toast/ToastProvider';

export interface TypographyTokenItem {
  id: string; // --typography-h1
  usage?: string; // Heading 1
  fontSize: string; // 32px
  weights: number[];
  lineHeight: string | number; // 1.5
  description?: string; // 대제목용 가이드
}

interface TypographyTableProps {
  title: string;
  category: 'Pretendard GOV' | 'NanumSquare Neo' | 'Noto Sans JP' | 'Fira Code';
  tokens: TypographyTokenItem[];
}

const TypographyTokenTable = ({ title, category, tokens }: TypographyTableProps) => {
  const { addToast } = useToast();

  const PROJECT_NAME = 'project';

  /** 1. 언어별 프리뷰 텍스트 및 설정 상수 */
  const TYPO_CONFIG: Record<string, { text: string; fontFamilyVar: string }> = {
    ko: {
      text: '방울토마토 속 꿀을 빤 닭 한 마리',
      fontFamilyVar: 'var(--project-font-family-ko)',
    },
    ja: {
      text: 'いろはにほへと ちりぬるを わかよたれそ つねならむ',
      fontFamilyVar: 'var(--project-font-family-ja)',
    },
    en: {
      text: 'The quick brown fox jumps over the lazy dog.',
      fontFamilyVar: 'var(--project-font-family-en)',
    },
    code: {
      text: 'const helloWorld = () => console.log("Hello, World!");',
      fontFamilyVar: 'var(--project-font-family-code)',
    },
  };

  const DEFAULT_CONFIG = TYPO_CONFIG.en;

  const getCssVarName = (token: TypographyTokenItem, weight?: number) => {
    // 1. "typo-" 및 언어 접미사 제거
    const name = token.id.replace('typo-', '').replace(/-(ko|en|ja)$/, '');

    // 2. 인자로 전달된 weight가 있으면 그것을 사용, 없으면 첫 번째 값(fallback) 사용
    const targetWeight = weight ?? (token.weights?.[0] || 400);

    // 3. 일관된 명명 규칙 적용
    return `--${PROJECT_NAME}-typo-${name.toLowerCase()}-${targetWeight}`;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`복사되었습니다: ${text}`, 'success');
    } catch (err) {
      addToast('복사에 실패했습니다.', 'error');
    }
  };

  const columns: Column<TypographyTokenItem>[] = [
    {
      key: 'preview',
      header: 'Preview',
      width: '40%',
      render: (_, row) => {
        // 1. row.id (예: typo-display-1-ko)에서 마지막 언어 코드 추출
        const lang = row.id.split('-').pop() || 'en';

        // 2. 추출한 언어 코드로 설정 데이터 가져오기 (없으면 영어 기본값)
        const { text, fontFamilyVar } = TYPO_CONFIG[lang] || DEFAULT_CONFIG;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {row.weights.map((weight: number) => (
              <div
                key={`${row.id}-${weight}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--project-color-text-natural)',
                    width: '24px',
                    flex: '0 0 auto',
                  }}
                >
                  {weight}
                </span>
                <div
                  style={{
                    fontFamily: fontFamilyVar,
                    fontSize: row.fontSize,
                    fontWeight: weight,
                    lineHeight: row.lineHeight,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      key: 'id',
      header: 'Token / Spec',
      render: (_, row) => {
        return (
          <div className='token-table__spec-column'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {row.weights.map(weight => {
                const cssVarName = getCssVarName(row, weight);
                return (
                  <button
                    key={cssVarName}
                    className='token-table__copy-btn'
                    onClick={() => handleCopy(`var(${cssVarName})`)}
                    aria-label={`${weight} 웨이트 CSS 변수 복사`}
                  >
                    <Code>{cssVarName}</Code>
                  </button>
                );
              })}
            </div>

            <div className='token-table__spec-details'>
              <span>{row.fontSize}</span> /
              <span className='token-table__weights'>{row.weights.join(', ')}</span>/
              <span> {row.lineHeight}</span>
            </div>
          </div>
        );
      },
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
        <Badge variant='solid' size='sm' color='secondary' label={category} />
      </div>
      <DataTable
        caption={title}
        summary={`${title} 타이포그래피 가이드라인입니다.`}
        columns={columns}
        data={tokens}
        variant='outline'
        size='md'
      />
    </div>
  );
};

export default TypographyTokenTable;
