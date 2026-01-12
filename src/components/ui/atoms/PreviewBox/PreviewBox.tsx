import Styles from './PreviewBox.module.scss';

interface PreviewBoxProps {
  lightValue: string;
  darkValue?: string;
}

/**
 * 디자인 토큰 미리보기 컴포넌트
 * darkValue가 없으면 단일 모드(Primitive)로, 있으면 분할 모드(Semantic)로 표시합니다.
 */
const PreviewBox = ({ lightValue, darkValue }: PreviewBoxProps) => {
  // darkValue 존재 여부에 따라 모드 결정
  const isSplitMode = Boolean(darkValue);

  return (
    <div className={`${Styles.previewWrapper} ${!isSplitMode ? Styles.single : ''}`}>
      {/* 기본 컬러 박스 (Primitive일 땐 전체, Semantic일 땐 왼쪽) */}
      <div
        className={Styles.previewBoxLight}
        style={{ backgroundColor: lightValue }}
        role='img'
        aria-label={`색상 미리보기: ${lightValue}`}
      />

      {/* 다크 모드 박스 (존재할 때만 렌더링) */}
      {isSplitMode && (
        <div
          className={Styles.previewBoxDark}
          style={{ backgroundColor: darkValue }}
          role='img'
          aria-label={`다크 모드 미리보기: ${darkValue}`}
        />
      )}
    </div>
  );
};

export default PreviewBox;
