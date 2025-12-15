import type { OptionBase } from '../OptionItem/OptionItem';

const mockOptions: Omit<OptionBase, 'disabled' | 'selected' | 'label'>[] = [
  { id: 'searchbar-1', value: '사과' },
  { id: 'searchbar-2', value: '바나나' },
  { id: 'searchbar-3', value: '포도' },
  { id: 'searchbar-4', value: '딸기' },
  { id: 'searchbar-5', value: '과나나' },
  { id: 'searchbar-6', value: '우나나' },
  { id: 'searchbar-7', value: '오나나' },
];

export const searchbarOptions = mockOptions;
