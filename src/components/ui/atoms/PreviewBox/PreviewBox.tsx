import Styles from './PreviewBox.module.scss';

interface PreviewBoxProps {
  lightValue: string;
  darkValue: string;
}

/**
 * 디자인 토큰의 실제 색상을 라이트/다크 모드별로 미리 보여주는 컴포넌트입니다.
 * 다크 모드 영역은 시스템 테마와 관계없이 항상 #121212 배경을 유지하여
 * 대비(Contrast)를 정확하게 검증할 수 있도록 합니다.
 */
const PreviewBox = ({ lightValue, darkValue }: PreviewBoxProps) => {
  return (
    <div className={Styles.previewWrapper}>
      {/* 라이트 모드 박스 */}
      <div
        className={Styles.previewBoxLight}
        style={{ backgroundColor: lightValue }}
        role='img'
        aria-label={`라이트 모드 미리보기 색상: ${lightValue}`}
      />

      {/* 다크 모드 박스 */}
      <div
        className={Styles.previewBoxDark}
        style={{ backgroundColor: darkValue }}
        role='img'
        aria-label={`다크 모드 미리보기 색상: ${darkValue}`}
      />
    </div>
  );
};

export default PreviewBox;
