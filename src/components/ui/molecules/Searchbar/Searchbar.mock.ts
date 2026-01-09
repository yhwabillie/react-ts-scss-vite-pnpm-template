import type { OptionBase } from '../OptionItem/OptionItem';

export interface SearchOptionType extends Omit<OptionBase, 'disabled' | 'selected' | 'label'> {
  href?: string;
  target?: string;
}

const mockOptions: SearchOptionType[] = [
  {
    id: 'opt-1',
    value: '서버 개발자 채용 공고',
    href: '/jobs/server',
  },
  {
    id: 'opt-2',
    value: '프론트엔드 신입 연봉 정보',
    href: '/salary/frontend',
  },
  {
    id: 'opt-3',
    value: '네이버 채용 공식 홈페이지',
    href: 'https://recruit.navercorp.com',
    target: '_blank',
  },
  {
    id: 'opt-4',
    value: 'UI/UX 디자이너 포트폴리오 가이드',
    href: '/community/design/guide',
  },
  {
    id: 'opt-5',
    value: '데이터 사이언티스트 기술 면접 질문',
    href: '/interview/data-science',
  },
  {
    id: 'opt-6',
    value: '서비스 기획자 역량 강화 로드맵',
    href: '/career/pm-roadmap',
  },
  {
    id: 'opt-7',
    value: '퍼포먼스 마케터 실무 템플릿',
    href: '/resources/marketing-template',
  },
  {
    id: 'opt-8',
    value: '자주 묻는 질문 (FAQ)',
    href: '/support/faq',
  },
  {
    id: 'opt-9',
    value: '1:1 커리어 멘토링 신청하기',
    href: 'https://mentor.example.com/apply',
    target: '_blank',
  },
];

export const searchbarOptions = mockOptions;
