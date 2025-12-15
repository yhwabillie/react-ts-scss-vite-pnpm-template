import { normalizeOptionsWithPlaceholder } from '@/utils/option/normalizeOptionsWithPlaceholder';
import type { OptionBase } from '../OptionItem/OptionItem';

// -----------------------------
// 📌 [Input Props 외부 정의]
// - Combobox input에서 공통으로 사용하는 속성 분리
// -----------------------------
export const comboboxInputProps = {
  placeholder: '검색 후 옵션 샌택',
  autoComplete: 'off',
} as const;

const mockOptions: OptionBase[] = [
  {
    id: 'placeholder',
    value: '',
    selected: false,
    disabled: true,
  },
  { id: 'combo-1', value: '프론트엔드 개발자', selected: false, disabled: false },
  { id: 'combo-2', value: '백엔드 개발자', selected: false, disabled: false },
  { id: 'combo-3', value: '풀스택 개발자', selected: false, disabled: false },
  { id: 'combo-4', value: '모바일 앱 개발자', selected: false, disabled: false },
  { id: 'combo-5', value: '데이터 엔지니어', selected: false, disabled: false },
  { id: 'combo-6', value: 'QA 엔지니어', selected: false, disabled: false },
  { id: 'combo-7', value: 'UX/UI 디자이너', selected: false, disabled: false },
  { id: 'combo-8', value: '프로덕트 매니저', selected: false, disabled: false },
  { id: 'combo-9', value: '기술 기획자', selected: false, disabled: true },
  { id: 'combo-10', value: 'DevOps 엔지니어', selected: false, disabled: false },
];

export const { options: comboboxOptions } = normalizeOptionsWithPlaceholder(mockOptions);
