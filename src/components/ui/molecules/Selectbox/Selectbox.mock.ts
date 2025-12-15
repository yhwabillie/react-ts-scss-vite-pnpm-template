import { normalizeOptionsWithPlaceholder } from '@/utils/option/normalizeOptionsWithPlaceholder';
import type { OptionBase } from '../OptionItem/OptionItem';

const mockOptions: OptionBase[] = [
  {
    id: 'placeholder',
    value: '',
    selected: false,
    disabled: true,
  },
  { id: 'select-1', value: '대기 중', selected: false, disabled: false },
  { id: 'select-2', value: '진행 중', selected: false, disabled: false },
  { id: 'select-3', value: '검토 요청', selected: false, disabled: false },
  { id: 'select-4', value: '보류', selected: false, disabled: true },
  { id: 'select-5', value: '승인됨', selected: false, disabled: false },
  { id: 'select-6', value: '반려됨', selected: false, disabled: false },
  { id: 'select-7', value: '배포 대기', selected: false, disabled: false },
  { id: 'select-8', value: '배포 완료', selected: false, disabled: false },
  { id: 'select-9', value: '아카이브', selected: false, disabled: false },
  { id: 'select-10', value: '삭제됨', selected: false, disabled: false },
];

export const { options: selectboxOptions } = normalizeOptionsWithPlaceholder(mockOptions);
