import Styles from '@/components/ui/molecules/Chip/Chip.module.scss';

interface ChipProps {
  label: string;
  icon?: React.ReactNode; // 앞에 붙는 아이콘
  selected?: boolean; // 선택 상태 여부
  onSelect?: () => void; // 클릭/선택 핸들러
  onDelete?: () => void; // 삭제 버튼 핸들러
  variant?: 'filter' | 'input' | 'choice'; // 칩의 용도
}

const Chip = ({
  label,
  icon,
  selected = false,
  onSelect,
  onDelete,
  variant = 'choice',
}: ChipProps) => {
  // 키보드 접근성: Enter나 Space 키 대응
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`${Styles.chip} ${selected ? Styles.selected : ''} ${onSelect ? Styles.clickable : ''}`}
      // 1. 역할 정의 (선택 가능한 칩인 경우)
      role={onSelect ? 'button' : 'text'}
      tabIndex={onSelect ? 0 : -1}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {icon && (
        <span className={Styles.icon} aria-hidden='true'>
          {icon}
        </span>
      )}

      <span className={Styles.label}>{label}</span>

      {/* 2. 삭제 액션이 있는 경우 */}
      {onDelete && (
        <button
          type='button'
          className={Styles['delete-button']}
          onClick={e => {
            e.stopPropagation(); // 부모의 onSelect 전파 방지
            onDelete();
          }}
          // 3. 웹 접근성: 한국어 음성 안내
          aria-label={`${label} 삭제`}
          title={`${label} 삭제`}
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      )}
    </div>
  );
};

export default Chip;
