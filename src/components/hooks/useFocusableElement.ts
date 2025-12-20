import { useEffect, useRef } from 'react';

/**
 * 컨테이너 내에서 첫 번째 포커스 가능한 요소를 자동으로 찾아 포커싱
 * @param manualRef - 수동으로 포커스할 요소 (선택적)
 */
export const useFocusableElement = (manualRef?: React.RefObject<HTMLElement | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 수동 ref가 있으면 그것 사용
    if (manualRef?.current) {
      manualRef.current.focus();
      return;
    }

    // 자동으로 첫 번째 포커스 가능한 요소 찾기
    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = containerRef.current?.querySelectorAll(focusableSelector);
    const firstElement = focusableElements?.[0] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }
  }, [manualRef]);

  return containerRef;
};
