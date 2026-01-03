export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh';

export type LanguageSelectItem = {
  id: string;
  value: string;
  lang: LanguageCode;
  selected: boolean;
  href?: string;
  target?: '_self' | '_blank';
  rel?: string;
};

const mockOptions: LanguageSelectItem[] = [
  { id: 'lang-1', value: '한국어', lang: 'ko', selected: false, href: '/ko' },
  {
    id: 'lang-2',
    value: 'English',
    lang: 'en',
    selected: false,
    href: '/en',
  },
  {
    id: 'lang-3',
    value: '日本語',
    lang: 'ja',
    selected: false,
    href: '/ja',
  },
  {
    id: 'lang-4',
    value: '中文',
    lang: 'zh',
    selected: false,
    href: '/zh',
  },
];

export const languageSelectorOptions = mockOptions;
