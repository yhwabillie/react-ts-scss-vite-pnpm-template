import type { OptionBase } from '@/components/ui/molecules/OptionItem/OptionItem';

// -----------------------------
// 📌 [Placeholder 기준 옵션 정리 함수]
// - id가 'placeholder'인 옵션을 placeholderOption으로 분리
// - placeholder가 있으면 항상 배열 맨 앞에 위치
// - 나머지 옵션 순서는 유지
// -----------------------------

export function normalizeOptionsWithPlaceholder<T extends OptionBase>(options: T[]) {
  // -----------------------------
  // 📌 [Placeholder 옵션 추출]
  // - id === 'placeholder' 인 첫 번째 옵션을 placeholderOption으로 사용
  // -----------------------------
  const placeholderOption = options.find(opt => opt.id === 'placeholder') ?? null;

  // -----------------------------
  // 📌 [Placeholder 제외 옵션 배열]
  // - placeholderOption을 제외한 나머지 옵션
  // -----------------------------
  const optionsWithoutPlaceholder = options.filter(opt => opt.id !== 'placeholder');

  // -----------------------------
  // 📌 [정규화된 옵션 배열 생성]
  // - placeholderOption이 있으면 배열 맨 앞에 추가
  // - 없으면 나머지 옵션 그대로 반환
  // -----------------------------
  const parsedOptions = placeholderOption
    ? [placeholderOption, ...optionsWithoutPlaceholder]
    : optionsWithoutPlaceholder;

  return {
    placeholderOption,
    options: parsedOptions,
  };
}
