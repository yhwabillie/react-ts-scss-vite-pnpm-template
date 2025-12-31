// server.js

import Button from '@/components/ui/molecules/Button/Button';
import Icon from '@/components/ui/atoms/Icon/Icon';
import LinkButton from '@/components/ui/molecules/Button/LinkButton';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import IconLinkButton from '@/components/ui/molecules/IconButton/IconLinkButton';
import Radio from '@/components/ui/atoms/Radio/Radio';
import Checkbox from '@/components/ui/atoms/Checkbox/Checkbox';
import Label from './components/ui/atoms/Label/Label';
import FormField from './components/ui/molecules/FormField/FormField';
import ButtonGroup from './components/ui/molecules/ButtonGroup/ButtonGroup';
import ActionBar from './components/ui/organisms/ActionBar/ActionBar';
import FormFieldset from './components/ui/molecules/FormFieldset/FormFieldset';
import ValidationMsg from './components/ui/atoms/ValidationMsg/ValidationMsg';
import ControlGroup from './components/ui/molecules/ControlGroup/ControlGroup';
import Switch from './components/ui/molecules/Switch/Switch';
import Input from './components/ui/atoms/Input/Input';
import Textarea from './components/ui/atoms/Textarea/Textarea';
import Selectbox from './components/ui/molecules/Selectbox/Selectbox';
import Combobox from './components/ui/molecules/Combobox/Combobox';
import {
  comboboxInputProps,
  comboboxOptions,
} from './components/ui/molecules/Combobox/Combobox.mock';
import { selectboxOptions } from './components/ui/molecules/Selectbox/Selectbox.mock';
import Searchbar from './components/ui/molecules/Searchbar/Searchbar';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { searchbarOptions } from './components/ui/molecules/Searchbar/Searchbar.mock';
import LanguageSelector from './components/ui/molecules/LanguageSelector/LanguageSelector';
import { languageSelectorOptions } from './components/ui/molecules/LanguageSelector/LanguageSelector.mock';
import type { LanguageSelectItem } from './components/ui/molecules/LanguageSelector/LanguageSelector.mock';
import Datepicker from './components/ui/molecules/Datepicker/Datepicker';
import Calendar from './components/ui/organisms/Calendar/Calendar';
import {
  calendarMonthOptions,
  calendarYearOptions,
  useCalendarMatrix,
  type CalendarCell,
} from './components/ui/organisms/Calendar/Calendar.mock';
import ModalProvider from './components/ui/molecules/Modal/ModalProvider';
import { ModalContext } from './components/contexts/ModalContext';
import FilePicker from './components/ui/organisms/FilePicker/FilePicker';
import { useFilePicker } from './components/hooks/useFilePicker';
import Accordion from './components/ui/molecules/Accordion/Accordion';
import Tabs from './components/ui/molecules/Tabs/Tabs';
import SegmentedControl from './components/ui/molecules/SegmentedControl/SegmentedControl';
import DataTable, {
  type SortOrder,
  type SortState,
} from './components/ui/organisms/DataTable/DataTable';
import Pagination from './components/ui/molecules/Pagination/Pagination';
import Breadcrumbs from './components/ui/molecules/Breadcrumb/Breadcrumb';
import Chip from './components/ui/molecules/Chip/Chip';
import Badge from './components/ui/atoms/Badge/Badge';
import Tag from './components/ui/atoms/Tag/Tag';
import Tooltip from './components/ui/atoms/Tooltip/Tooltip';
import Avatar from './components/ui/molecules/Avatar/Avatar';
import ProfilePopover from './components/ui/organisms/ProfilePopover/ProfilePopover';
import Slider from './components/ui/atoms/Slider/Slider';
import Skeleton from './components/ui/atoms/Skeleton/Skeleton';
import { useToast } from './components/ui/molecules/Toast/ToastProvider';
import RingSpinner from './components/ui/atoms/Spinner/LoadingSpinner/RingSpinner';

// 타입 정의
type DisplayLevel = 'd1' | 'd2' | 'd3';
type HeadingLevel = 'h1' | 'h2' | 'h3';
type SubtitleLevel = 'st1' | 'st2' | 'st3';
type BodyLevel = 'b1' | 'b2' | 'b3';
type CaptionLevel = 'c1' | 'c2' | 'c3';
type LabelLevel = 'l1' | 'l2' | 'l3';
type ButtonLevel = 'btn1' | 'btn2' | 'btn3';

// Display 레벨
const displayStyles: Record<DisplayLevel, React.CSSProperties> = {
  d1: { font: 'var(--project-typo-d1-700)' },
  d2: { font: 'var(--project-typo-d2-700)' },
  d3: { font: 'var(--project-typo-d3-700)' },
};

// Heading 레벨
const headingStyles: Record<HeadingLevel, React.CSSProperties> = {
  h1: { font: 'var(--project-typo-h1-700)' },
  h2: { font: 'var(--project-typo-h2-700)' },
  h3: { font: 'var(--project-typo-h3-700)' },
};

// Subtitle 레벨
const subtitleStyles: Record<SubtitleLevel, React.CSSProperties> = {
  st1: { font: 'var(--project-typo-st1-500)' },
  st2: { font: 'var(--project-typo-st2-500)' },
  st3: { font: 'var(--project-typo-st3-400)' },
};

// Body 레벨
const bodyStyles: Record<BodyLevel, React.CSSProperties> = {
  b1: { font: 'var(--project-typo-b1-400)' },
  b2: { font: 'var(--project-typo-b2-400)' },
  b3: { font: 'var(--project-typo-b3-400)' },
};

// Caption 레벨
const captionStyles: Record<CaptionLevel, React.CSSProperties> = {
  c1: { font: 'var(--project-typo-c1-400)' },
  c2: { font: 'var(--project-typo-c2-400)' },
  c3: { font: 'var(--project-typo-c3-400)' },
};

// Label 레벨
const labelStyles: Record<LabelLevel, React.CSSProperties> = {
  l1: { font: 'var(--project-typo-l1-500)' },
  l2: { font: 'var(--project-typo-l2-500)' },
  l3: { font: 'var(--project-typo-l3-500)' },
};

// Button 레벨
const btnStyles: Record<ButtonLevel, React.CSSProperties> = {
  btn1: { font: 'var(--project-typo-btn1-500)' },
  btn2: { font: 'var(--project-typo-btn2-600)' },
  btn3: { font: 'var(--project-typo-btn3-400)' },
};

export interface Holiday {
  date: string; // YYYYMMDD
  name: string;
}

const ACCEPT_EXT = ['png', 'jpg', 'jpeg', 'pdf'];
const MAX_COUNT = 2;
const MAX_SIZE_MB = 20;
const ACCEPT_ATTR = ACCEPT_EXT.map(ext => `.${ext}`).join(',');

// ✅ 해결책 1: 컴포넌트를 함수 밖으로 이동
const FilePickerContainer = () => {
  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    console.log('🔵 FilePickerContainer 마운트');
    return () => console.log('🔴 FilePickerContainer 언마운트');
  }, []);

  const { files, handleDrop, handleRemove, handleClear } = useFilePicker({
    acceptExt: ACCEPT_EXT,
    maxSizeMB: MAX_SIZE_MB,
    maxCount: MAX_COUNT,
    onError: message => {
      console.log('[FilePicker Error]', message);

      openModal('alert', {
        title: '에러',
        subtitle: message,
        confirmText: '확인',
      });
    },
  });

  console.log('📁 현재 파일 개수:', files.length);

  return (
    <FilePicker
      files={files}
      onDrop={handleDrop}
      onRemove={handleRemove}
      onClear={handleClear}
      maxCount={MAX_COUNT}
      accept={ACCEPT_ATTR}
    />
  );
};

const accordionData = [
  {
    title: 'Depth1',
    content: '내용',
    children: [
      {
        title: 'Depth2',
        content: '내용',
        children: [
          {
            title: 'Depth3',
            content: '내용',
            children: [
              {
                title: 'Depth4',
                content: '내용',
              },
            ],
          },
        ],
      },
    ],
  },
];

// 1. 탭에 들어갈 데이터 정의
const tabData = [
  {
    title: 'TAB-1',
    content: <p>탭 1 내용</p>,
  },
  {
    title: 'TAB-2',
    content: <p>탭 2 내용</p>,
  },
  { title: 'TAB-3', content: <p>탭 3 내용</p> },
  { title: 'TAB-4', content: <p>탭 4 내용</p> },
  { title: 'TAB-5', content: <p>탭 5 내용</p> },
  { title: 'TAB-6', content: <p>탭 6 내용</p> },
  { title: 'TAB-7', content: <p>탭 7 내용</p> },
];

function App() {
  // -----------------------------
  // 📌 상태 선언
  // - Controlled 방식 (권장) - 외부에서 초기값 + 상태 관리
  // -----------------------------
  const [searchbarValue, setSearchbarValue] = useState('');
  const [currentLang, setCurrentLang] = useState<LanguageSelectItem['lang']>('ko');
  const [selectboxId, setSelectboxId] = useState('');

  // 캘린더 - datepicker input 값만 초기값으로 쓰고 싶을 때
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 캘린더 - 완전 제어 컴포넌트로 쓰고 싶을 때
  //   const [selectedDate, setSelectedDate] = useState<Date | null>(
  //   new Date('2026-01-17'),
  // );

  // 공휴일
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 공휴일
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    async function fetchHolidays(year: number, month: number) {
      const url =
        'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo' +
        `?serviceKey=${import.meta.env.VITE_OPEN_API_KEY}` +
        `&solYear=${year}` +
        `&solMonth=${String(month).padStart(2, '0')}`;

      const res = await fetch(url);
      const text = await res.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');

      const items = Array.from(xmlDoc.getElementsByTagName('item'));

      const parsedHolidays: Holiday[] = items.map(item => ({
        date: item.getElementsByTagName('locdate')[0]?.textContent ?? '',
        name: item.getElementsByTagName('dateName')[0]?.textContent ?? '',
      }));

      setHolidays(parsedHolidays);
    }

    fetchHolidays(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (
      selectedDate &&
      (selectedDate.getFullYear() !== selectedYear || selectedDate.getMonth() + 1 !== selectedMonth)
    ) {
      setSelectedDate(null);
    }
  }, [selectedYear, selectedMonth]);

  const { openModal, closeModal } = useContext(ModalContext);

  // 예시: 삭제 버튼 클릭 시
  const handleSequenceFlow = () => {
    openModal('alert', {
      title: '삭제 확인',
      subtitle: '삭제하면 복구할 수 없습니다, 삭제하시겠습니까?',
      cancelText: '취소',
      onConfirm: (currentId?: string) => {
        // 1. 현재 모달(1번)을 ID로 정확히 닫음
        closeModal(currentId || 'alert');

        // 2. 브라우저가 상태를 정리할 시간을 아주 잠깐 준 뒤 새 모달 오픈
        setTimeout(() => {
          openModal('alert', {
            title: '삭제 완료',
            subtitle: '삭제가 완료 되었습니다.',
            confirmText: '확인',
          });
        }, 0);
      },
    });
  };

  // 1. 선택된 값을 관리할 상태 생성
  const [viewType, setViewType] = useState('popular');

  // 2. 세그먼트에 표시할 옵션 배열 정의
  const viewOptions = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '가격순', value: 'price' },
  ];

  // data table
  const pxToRem = (px: number) => `${px / 16}rem`;

  type UserStatus = '활성' | '비활성';
  interface UserData {
    id: number;
    title: string;
    file?: boolean;
    author: string;
    createdAt?: string;
    likes?: number;
    status?: UserStatus;
    commentCount?: number;
    viewCount?: number;
  }

  const columns = [
    {
      key: 'id',
      header: '번호',
      width: pxToRem(80),
      sortable: true,
    },
    {
      key: 'title',
      header: '제목',
      render: (value: string, row: UserData) => (
        <a href={`/users/${row.id}`} className='table-link'>
          {value}
          <span>[{row.commentCount}]</span>
        </a>
      ),
      minWidth: pxToRem(200),
    },
    {
      key: 'file',
      header: '파일',
      width: pxToRem(80),
      render: (value: boolean) => value && <i>파일</i>,
      sortable: true,
    },
    {
      key: 'author',
      header: '작성자',
      width: pxToRem(120),
    },
    {
      key: 'createdAt',
      header: '작성일',
      width: pxToRem(120),
      sortable: true,
    },
    {
      key: 'likes',
      header: '추천',
      width: pxToRem(80),
      sortable: true,
    },
    {
      key: 'status',
      header: '처리 상태',
      width: pxToRem(120),
      sortable: true,
    },
    {
      key: 'viewCount',
      header: '조회수',
      width: pxToRem(80),
      sortable: true,
    },
  ];

  const data: UserData[] = [
    {
      id: 1,
      title: '제목',
      file: true,
      author: '홍길동',
      createdAt: '2025.12.18',
      likes: 10,
      status: '비활성',
      commentCount: 100,
      viewCount: 12,
    },
    {
      id: 2,
      title: '제목',
      file: false,
      author: '김철수',
      createdAt: '2025.12.18',
      likes: 10,
      status: '활성',
      commentCount: 30,
      viewCount: 1,
    },
    {
      id: 3,
      title: '제목',
      file: true,
      author: '박수미',
      createdAt: '2025.12.11',
      likes: 10,
      status: '활성',
      commentCount: 30,
      viewCount: 1,
    },
    {
      id: 4,
      title: '제목',
      file: true,
      author: '박수미',
      createdAt: '2025.12.11',
      likes: 10,
      status: '활성',
      commentCount: 30,
      viewCount: 1,
    },
    {
      id: 5,
      title: '제목',
      file: true,
      author: '박수미',
      createdAt: '2025.12.11',
      likes: 10,
      status: '활성',
      commentCount: 30,
      viewCount: 1,
    },
    {
      id: 6,
      title: '제목',
      file: true,
      author: '박수미',
      createdAt: '2025.12.11',
      likes: 10,
      status: '활성',
      commentCount: 30,
      viewCount: 1,
    },
  ];

  // sort
  const [sortState, setSortState] = useState<SortState>({ key: '', order: 'none' });

  const handleSort = (key: string, order: SortOrder) => {
    setSortState({ key, order });
  };

  // pagination
  const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 0,
    );

    useEffect(() => {
      // 윈도우 크기가 바뀔 때 실행될 핸들러
      const handleResize = () => setWindowWidth(window.innerWidth);

      window.addEventListener('resize', handleResize);

      // 컴포넌트가 사라질 때 이벤트 제거 (메모리 누수 방지)
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
  };

  const ITEMS_PER_PAGE = 4; // 한 페이지에 보여줄 개수
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작 권장

  // 1. 전체 페이지 수 계산
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedRawData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  // 2. 정렬된 데이터 중 현재 페이지에 해당하는 데이터만 추출
  const paginatedSortedData = useMemo(() => {
    if (sortState.order === 'none' || !sortState.key) return paginatedRawData;

    return [...paginatedRawData].sort((a, b) => {
      const key = sortState.key as keyof UserData;
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';
      if (aValue === bValue) return 0;
      const multiplier = sortState.order === 'asc' ? 1 : -1;
      return aValue < bValue ? -multiplier : multiplier;
    });
  }, [sortState, paginatedRawData]);

  // 페이지 변경 시 핸들러 (선택 영역 초기화 여부는 기획에 따라 결정)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows(new Set()); // 페이지 바뀔 때 선택 해제
  };

  // selection
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());

  // 개별 선택 로직
  const handleSelectRow = (id: number | string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  // 전체 선택 로직
  const handleSelectAll = (isAll: boolean) => {
    // ✅ 업데이트: paginatedData 대신 현재 페이지의 '정렬된' 데이터인 paginatedSortedData를 사용합니다.
    const currentPageData = paginatedSortedData;

    if (isAll) {
      // ✅ 업데이트: 현재 눈에 보이는 페이지의 모든 ID를 추출
      const currentPageIds = currentPageData.map(row => row.id);

      // 기존 선택 항목에 현재 페이지 항목들을 합침 (Set이 중복은 자동으로 제거함)
      setSelectedRows(new Set([...selectedRows, ...currentPageIds]));
    } else {
      // ✅ 업데이트: 현재 페이지의 ID들만 기존 선택 목록에서 찾아 제거
      const newSelected = new Set(selectedRows);
      currentPageData.forEach(row => newSelected.delete(row.id));
      setSelectedRows(newSelected);
    }
  };

  // App.tsx 또는 DataTable을 감싸는 컨테이너 컴포넌트
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 페이지가 변경될 때 테이블 상단으로 스크롤 이동
    if (tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: 'smooth', // 부드럽게 이동
        block: 'start', // 요소의 시작 지점으로
      });
    }
  }, [currentPage]); // currentPage가 바뀔 때마다 실행

  // 페이지가 바뀔 때마다 정렬을 '없음'으로 되돌립니다.
  useEffect(() => {
    setSortState({ key: '', order: 'none' });
  }, [currentPage]);

  const width = useWindowSize(); // 윈도우 너비 가져오기
  const isMobile = width < 768; // 768px 미만인지 확인

  const breadcrumbData = [
    { label: '홈', href: '/', icon: <Icon name='house' className='icon' /> },
    { label: '게시판', href: '/board' },
    { label: '자유게시판' }, // 마지막은 href 생략
  ];

  // chip
  // 1. 칩 데이터 상태 관리 (고유 ID가 있는 것이 좋습니다)
  const [chipList, setChipList] = useState([
    { id: 1, label: 'React' },
    { id: 2, label: '컴포넌트' },
    { id: 3, label: '웹접근성' },
  ]);

  // 2. 삭제 핸들러 함수
  const handleDelete = (id: number) => {
    // 선택한 ID만 제외하고 새로운 배열 생성
    setChipList(prev => prev.filter(chip => chip.id !== id));
  };

  // profile popover
  const currentUser = {
    name: '김테크',
    email: 'tech_kim@company.com',
    role: 'Admin',
    image: '/images/profile.png',
  };

  // slider
  const [volume, setVolume] = useState(50);

  // Toast
  const { addToast } = useToast();
  const [count, setCount] = useState(1); // 테스트용 카운터

  const handleSubmit = () => {
    // 1. 즉시 발생 (startCount)
    setTimeout(() => {
      addToast(`워닝 메시지입니다`, 'warning');
    });

    // 2. 1초 뒤 발생 (startCount + 1)
    setTimeout(() => {
      addToast(`워닝 메시지입니다`, 'warning');
    }, 1000);

    // 3. 2초 뒤 발생 (startCount + 2)
    setTimeout(() => {
      addToast(`정보 메시지입니다`, 'info');
    }, 2000);

    // 4. 3초 뒤 발생 (startCount + 3)
    setTimeout(() => {
      addToast(`정보 메시지입니다`, 'info');
    }, 3000);

    // 다음 테스트를 위해 전체 count 상태 업데이트
    setCount(prev => prev + 4);
  };

  // useEffect(() => {
  //   // ✅ 3000ms(3초) 대기 후에 addToast를 실행합니다.
  //   const timer = setTimeout(() => {
  //     addToast('게시글이 등록되었습니다.', 'success', undefined, {
  //       text: '확인하러 가기',
  //       url: '/post/123',
  //     });
  //   }, 3000);

  //   // 컴포넌트가 언마운트될 때 타이머를 정리(Cleanup)해주는 것이 안전합니다.
  //   return () => clearTimeout(timer);
  // }, [addToast]);

  return (
    <>
      <section ref={tableRef} style={{ padding: '30px' }}>
        <div className='sr-only' aria-live='polite'>
          {sortState.key &&
            `${sortState.key} 항목으로 ${sortState.order === 'asc' ? '오름차순' : '내림차순'} 정렬되었습니다.`}
          {`${totalPages}페이지 중 현재 ${currentPage}페이지입니다.`}
        </div>
        <DataTable
          columns={columns}
          data={paginatedSortedData} // 정렬된 데이터 전달 sortedData
          sortState={sortState}
          onSort={handleSort}
          caption='사용자 계정 관리 목록'
          summary='사용자의 번호, 이름, 역할, 상태 정보를 제공하는 표입니다.'
          // 체크박스 사용 여부 결정
          showCheckbox={true}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
          // 모바일 기기 감지 로직이나 창 너비에 따라 true/false 전달
          isMobileUI={isMobile}
        />
      </section>
      <section>
        <button type='button' onClick={handleSubmit}>
          Toast
        </button>
      </section>
      <section style={{ margin: '30px', width: '200px' }}>
        <Skeleton variant='text' width='50%' />
        <Skeleton variant='text' width='70%' />
        <Skeleton variant='rect' height={100} />
        {/* ✅ 스크린 리더 사용자에게는 현재 로딩 중임을 텍스트로 안내 */}
        <span className='sr-only'>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span>
      </section>
      <nav>
        {/* 아바타를 클릭하면 프로필 카드가 나타남 */}
        <ProfilePopover
          userData={currentUser}
          trigger={
            <Avatar
              src={currentUser.image}
              alt={`${currentUser.name}님의 프로필`}
              status='online'
              size='md'
            />
          }
        />
      </nav>
      <section>
        {/* 1. 이미지와 상태가 있는 경우 */}
        <Avatar src='/path/user.jpg' alt='박지성 님의 프로필 사진' status='online' size='lg' />

        {/* 2. 이미지가 없어 이름 이니셜로 대체되는 경우 */}
        <Avatar alt='김철수 님의 프로필 사진' name='김철수' size='md' />

        {/* 3. 데이터 테이블 내 작은 아바타 */}
        <Avatar src='/path/user.jpg' alt='박지성 님의 프로필 사진' size='sm' />
      </section>
      <section>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* 오른쪽에 고정 */}
          <Tooltip id='info-right' content='오른쪽 설명' preferredPosition='right'>
            <button>오른쪽</button>
          </Tooltip>

          {/* 왼쪽에 고정 */}
          <Tooltip id='info-left' content='왼쪽 설명' preferredPosition='left'>
            <button>왼쪽</button>
          </Tooltip>

          <Tooltip
            id='tooltip-top'
            content='위쪽으로 고정된 툴팁입니다.'
            preferredPosition='top' // ✅ 이 부분을 추가하면 항상 위로 뜹니다.
          >
            <button type='button'>마우스 올려보세요</button>
          </Tooltip>

          {/* 아래쪽에 고정 */}
          <Tooltip id='info-bottom' content='아래쪽 설명' preferredPosition='bottom'>
            <button>아래쪽</button>
          </Tooltip>

          <Tooltip
            id='complex-info'
            variant='rich'
            content={
              <div style={{ padding: '4px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>
                  비밀번호 보안 등급
                </strong>
                {/* 1. 의미 있는 목록 구조 제공 */}
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px' }}>
                  <li>영문 대소문자 포함</li>
                  <li>특수문자 (!@#$) 포함</li>
                  <li>8자 이상 16자 이하</li>
                </ul>
              </div>
            }
          >
            {/* 2. span 대신 button 사용 (가장 권장되는 접근성 방식) */}
            <button
              type='button'
              style={{
                cursor: 'help',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                color: 'inherit',
              }}
              // 스크린 리더에게 이것이 도움말 버튼임을 알림
              aria-label='비밀번호 보안 등급 도움말 보기'
            >
              보안 안내
            </button>
          </Tooltip>
        </div>
      </section>
      <section>
        <Tag href='/search?q=React' color='primary' icon='#'>
          React
        </Tag>
        <div role='list' aria-label='게시글 태그' style={{ display: 'flex', gap: '4px' }}>
          <Tag color='outline'>유기농</Tag>
          <Tag color='outline'>특가</Tag>
        </div>
      </section>
      <section>
        <Badge variant='status' color='success'>
          성공
        </Badge>
        <Badge variant='status' color='danger'>
          실패
        </Badge>
      </section>
      <section>
        {chipList.map(chip => (
          <Chip
            key={chip.id}
            label={chip.label}
            onDelete={() => handleDelete(chip.id)} // 핸들러 연결
          />
        ))}
      </section>
      <section>
        <Breadcrumbs items={breadcrumbData} separator='/' />
      </section>
      {/* <section style={{ marginBottom: '20px' }}>
        <SegmentedControl
          name='view-mode' // 라디오 그룹 이름 (고유해야 함)
          options={viewOptions}
          selectedValue={viewType}
          onChange={value => setViewType(value)} // 상태 업데이트
        />
      </section> */}
      <section style={{ width: '500px', margin: 'auto' }}>
        <Tabs items={tabData} defaultIndex={0} />
      </section>
      <section>
        {accordionData.map(item => (
          <Accordion key={item.title} {...item} />
        ))}
      </section>
      <section>
        <FilePickerContainer />
      </section>
      <section style={{ margin: '40px' }}>
        <Button
          color='danger'
          variant='solid'
          size='md'
          shape='rounded'
          data-modal='profileEdit'
          data-modal-config={JSON.stringify({ currentName: '홍길동' })}
        >
          프로필 수정하기
        </Button>
        <Button
          color='danger'
          variant='solid'
          size='md'
          shape='rounded'
          onClick={handleSequenceFlow}
        >
          연쇄 모달 테스트 (삭제)
        </Button>
        <Button
          color='primary'
          variant='solid'
          size='md'
          shape='rounded'
          data-modal='alert'
          data-modal-config={JSON.stringify({
            variant: 'default',
            title: '시스템 점검 안내',
            subtitle: '오늘 오후 10시부터 점검이 예정되어 있습니다.',
            description: '서비스 이용에 참고 부탁드립니다.',
            confirmText: '확인',
          })}
        >
          공지사항 확인
        </Button>
      </section>
      <section style={{ margin: '30px' }}>
        <LanguageSelector
          variant='outline'
          color='primary'
          size='xl'
          buttonProps={{
            shape: 'rounded',
            labelText: '언어 변경',
          }}
          value='ko'
          options={languageSelectorOptions}
          onValueChange={setCurrentLang}
        />
      </section>

      {/* <section>
        <FormField
          size='xl'
          direction='column'
          id='datepicker-label'
          htmlFor='datepicker-input'
          labelText='생년월일'
        >
          <Datepicker
            id='datepicker'
            variant='outline'
            color='primary'
            size='xl'
            inputProps={{
              id: 'datepicker-input',
              // value: '2025-12-03',
              // readonly: true,
            }}
            calendar={{
              selectedYear: selectedYear,
              selectedMonth: selectedMonth,
              selectedDate: selectedDate,
              calendarProps: {
                yearOptions: calendarYearOptions,
                monthOptions: calendarMonthOptions,
              },
              holidays: holidays,
              onYearChange: setSelectedYear,
              onMonthChange: setSelectedMonth,
              onDateSelect: date => {
                setSelectedDate(date); // 내부 선택 상태
              },
            }}
            onDateChange={(value, date) => {
              setSelectedDate(date); // 상태 동기화

              console.log(value);
            }}
          />
        </FormField>
      </section> */}
      {/* <section>
        <Searchbar
          variant='outline'
          color='primary'
          size='xl'
          shape='rounded'
          id='searchbar-component'
          inputProps={{
            inputId: 'searchbar-input',
            labelText: '검색',
            role: 'combobox',
            name: 'searchbar-name',
            placeholder: '검색하세요',
            value: searchbarValue,
            // disabled: true,
            onChange: setSearchbarValue,
          }}
          options={searchbarOptions}
          actions={{
            utilityAction: {
              type: 'clear',
              icon: <Icon name='x' strokeWidth={3} />,
            },
            submitAction: {
              type: 'submit',
              icon: <Icon name='search' strokeWidth={2.5} />,
              onClick: () => console.log('submit', searchbarValue),
            },
          }}
        />
      </section> */}
      {/* <section>
        <FormField
          size='xl'
          direction='column'
          id='combobox-label'
          htmlFor='combobox-input'
          labelText='콤보박스 옵션 선택'
        >
          <Combobox
            variant='outline'
            color='primary'
            size='xl'
            role='combobox'
            aria-labelledby='combobox-label'
            id='combobox-component'
            inputId='combobox-input'
            // required={true}
            // readOnly={true}
            // disabled={true}

            inputProps={comboboxInputProps}
            options={comboboxOptions}
            onValueChange={(value, option) => {
              console.log(value, option);
            }}
          />
        </FormField>
      </section> */}
      {/* <section>
        <FormField
          size='xl'
          direction='column'
          id='selectbox-label'
          htmlFor='selectbox-select'
          labelText='셀렉트박스 옵션 선택'
        >
          <Selectbox
            variant='outline'
            color='primary'
            size='xl'
            role='combobox'
            aria-labelledby='selectbox-label'
            id='selectbox-component'
            selectId='selectbox-select'
            // required={true}
            // disabled={true}
            placeholder='선택해보세요'
            options={selectboxOptions}
            defaultOptionId='select-3'
            onValueChange={(optionId, option) => {
              setSelectboxId(optionId);
              console.log('선택됨 :', optionId, option);
            }}
          />
        </FormField>
      </section> */}

      {/* <section style={{ margin: '30px' }}>
        <FormField
          as='div'
          size='xl'
          id='textarea-r-1-label'
          htmlFor='textarea-r-1'
          labelText='Textarea 라벨'
          direction='column'
          required={true}
        >
          <Textarea
            variant='solid'
            color='primary'
            id='textarea-r-1'
            rows={6}
            placeholder='입력하세요'
          />
        </FormField>
        <FormField
          as='div'
          size='xl'
          id='textarea-r-2-label'
          htmlFor='textarea-r-2'
          labelText='Textarea 라벨'
          direction='column'
        >
          <Textarea
            variant='outline'
            color='primary'
            id='textarea-r-2'
            rows={6}
            placeholder='입력하세요'
          />
        </FormField>

        <FormField
          as='div'
          size='xl'
          id='textarea-r-4-label'
          htmlFor='textarea-r-4'
          labelText='Textarea 라벨'
          direction='column'
        >
          <Textarea
            variant='ghost'
            color='primary'
            id='textarea-r-4'
            rows={6}
            placeholder='입력하세요'
            maxLength={100} // 최대 500자
            showCount={true} // 카운터 표시
          />
        </FormField>

        <FormField
          as='div'
          size='xl'
          id='textarea-1-label'
          htmlFor='textarea-1'
          labelText='Textarea 라벨'
          direction='column'
        >
          <Textarea
            variant='solid'
            color='primary'
            id='textarea-1'
            rows={6}
            placeholder='입력하세요'
            defaultValue='비활성화 textarea 텍스트'
            disabled
          />
        </FormField>

        <FormField
          as='div'
          size='xl'
          id='textarea-2-label'
          htmlFor='textarea-2'
          labelText='Textarea 라벨'
          direction='column'
        >
          <Textarea
            variant='outline'
            color='primary'
            id='textarea-2'
            rows={6}
            placeholder='입력하세요'
            defaultValue='비활성화 textarea 텍스트'
            disabled
          />
        </FormField>

        <FormField
          as='div'
          size='xl'
          id='textarea-4-label'
          htmlFor='textarea-4'
          labelText='Textarea 라벨'
          direction='column'
        >
          <Textarea
            variant='ghost'
            color='primary'
            id='textarea-4'
            rows={6}
            placeholder='입력하세요'
            defaultValue='비활성화 textarea 텍스트'
            disabled
          />
        </FormField>
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-icon-1'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xl'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
              disabled
            />
          }
        />
        <Input
          as='div'
          id='input-icon-2'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
          adornedEnd={
            <IconButton
              color='tertiary'
              size='lg'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-3'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              as='div'
              color='tertiary'
              size='md'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-4'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='sm'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-5'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xs'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
      </section> */}
      {/* <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-outline-1'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
        />
        <Input
          as='div'
          id='input-outline-2'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
        />
        <Input
          as='div'
          id='input-outline-3'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-outline-4'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-outline-5'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-solid-1'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xl'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
              disabled
            />
          }
        />
        <Input
          as='div'
          id='input-solid-2'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
          adornedEnd={
            <IconButton
              color='tertiary'
              size='lg'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-3'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              as='div'
              color='tertiary'
              size='md'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-4'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='sm'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-5'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xs'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
      </section> */}
      {/* <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-1'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
        />
        <Input
          as='div'
          id='input-2'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
        />
        <Input
          as='div'
          id='input-3'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-4'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-5'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
      </section> */}
      {/* <section>
        <FormFieldset size='xl' legend='체크박스 옵션 선택' required={true}>
         
          <ControlGroup
            size='xl'
            direction='row'
            aria-describedby='checkbox-error-msg checkbox-warning-msg checkbox-success-msg checkbox-guide-msg'
          >
            <FormField as='label' htmlFor='formfield-test-1' size='xl' direction='row'>
              <Checkbox
                as='span'
                id='formfield-test-1'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 1'
                required
                defaultChecked
              />
              <Label size='xl'>체크박스 옵션 1</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-2' size='xl' direction='row'>
              <Checkbox
                as='span'
                id='formfield-test-2'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 2'
              />
              <Label size='xl'>체크박스 옵션 2</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-3' size='xl' direction='row'>
              <Checkbox
                as='span'
                id='formfield-test-3'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 3'
              />
              <Label size='xl'>체크박스 옵션 3</Label>
            </FormField>
          </ControlGroup>
          
          <ValidationMsg
            id='checkbox-error-msg'
            variant='danger'
            role='alert'
            ariaLive='assertive'
            size='xl'
          >
            <Icon name='x-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 에러</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-warning-msg'
            variant='warning'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='warning-triangle' className='icon' />
            <span className='text'>유효성검사 문구 : 워닝</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-success-msg'
            variant='success'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='check-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 성공</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-guide-msg'
            variant='guide'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='info-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 가이드</span>
          </ValidationMsg>
        </FormFieldset>
      </section> */}
      {/* <section>
        <FormFieldset size='xl' legend='라디오 옵션 선택' required={true}>
         
          <ControlGroup size='xl' direction='row'>
            <FormField as='label' htmlFor='formfield-test-4' size='xl' direction='row'>
              <Radio
                as='span'
                id='formfield-test-4'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 1'
                required
                defaultChecked
              />
              <Label size='xl'>라디오 옵션 1</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-5' size='xl' direction='row'>
              <Radio
                as='span'
                id='formfield-test-5'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 2'
              />
              <Label size='xl'>라디오 옵션 2</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-6' size='xl' direction='row'>
              <Radio
                as='span'
                id='formfield-test-6'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 3'
              />
              <Label size='xl'>라디오 옵션 3</Label>
            </FormField>
          </ControlGroup>
        
          <ValidationMsg variant='danger' role='alert' ariaLive='assertive' size='xl'>
            <Icon name='x-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 에러</span>
          </ValidationMsg>
          <ValidationMsg variant='warning' role='status' ariaLive='polite' size='xl'>
            <Icon name='warning-triangle' className='icon' />
            <span className='text'>유효성검사 문구 : 워닝</span>
          </ValidationMsg>
          <ValidationMsg variant='success' role='status' ariaLive='polite' size='xl'>
            <Icon name='check-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 성공</span>
          </ValidationMsg>
          <ValidationMsg variant='guide' role='status' ariaLive='polite' size='xl'>
            <Icon name='info-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 가이드</span>
          </ValidationMsg>
        </FormFieldset>
      </section> */}

      <section>
        {/* Display */}
        <h1 style={displayStyles.d1}>
          Display는 화면에서 가장 큰 텍스트로 주로 마케팅 용도로 사용한다 — abc 0123456789 @#%!?*
        </h1>
        <h1 style={displayStyles.d1}>
          ブランドの印象を強く打ち出すための大胆なディスプレイ書体です — abc 0123456789 @#%!?*
        </h1>

        <h2 style={displayStyles.d2}>
          화면의 첫 시선을 잡기 위한 비주얼 중심 타이포그래피입니다 — abc 0123456789 @#%!?*
        </h2>
        <h2 style={displayStyles.d2}>
          画面の視線を一瞬で惹きつけるための大きな文字設計です — abc 0123456789 @#%!?*
        </h2>

        <h3 style={displayStyles.d3}>
          메시지의 분위기와 무드를 강조하는 대형 서체 구성입니다 — abc 0123456789 @#%!?*
        </h3>
        <h3 style={displayStyles.d3}>
          メッセージの雰囲気を強調し、印象づけるための見出しです — abc 0123456789 @#%!?*
        </h3>
      </section>

      <section>
        {/* Heading */}
        <h1 style={headingStyles.h1}>
          페이지 구조의 최상위 제목으로 핵심 정보를 명확히 전달합니다 — abc 0123456789 @#%!?*
        </h1>
        <h1 style={headingStyles.h1}>
          ページ構造の最上位タイトルとして重要情報を明確に示します — abc 0123456789 @#%!?*
        </h1>

        <h2 style={headingStyles.h2}>
          섹션을 구분하고 사용자가 내용을 쉽게 파악하도록 돕는 제목 스타일입니다 — abc 0123456789
          @#%!?*
        </h2>
        <h2 style={headingStyles.h2}>
          セクションを整理し、読み手の理解を助けるための見出しです — abc 0123456789 @#%!?*
        </h2>

        <h3 style={headingStyles.h3}>
          세부 콘텐츠를 안내하는 구조적·정보 중심의 소제목입니다 — abc 0123456789 @#%!?*
        </h3>
        <h3 style={headingStyles.h3}>
          詳細コンテンツを整理し、情報を階層的に伝える小見出しです — abc 0123456789 @#%!?*
        </h3>
      </section>

      <section>
        {/* Subtitle */}
        <h4 style={subtitleStyles.st1}>
          주요 메시지 보조 설명으로 사용되는 중간 크기 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st1}>
          主要メッセージを補足する中くらいのサイズの書体です — abc 0123456789 @#%!?*
        </h4>

        <h4 style={subtitleStyles.st2}>
          부제목, 설명 등 콘텐츠 흐름을 안내하는 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st2}>
          サブタイトルや説明文としてコンテンツの流れを案内する書体です — abc 0123456789 @#%!?*
        </h4>

        <h4 style={subtitleStyles.st3}>
          상세 설명, 작은 안내 문구에 사용되는 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st3}>
          詳細説明や小さな案内文に使用される書体です — abc 0123456789 @#%!?*
        </h4>
      </section>

      <section>
        {/* Body */}
        <p style={bodyStyles.b1}>
          본문 내용 전달용 표준 크기 텍스트로 가독성을 높입니다 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b1}>
          本文内容を伝える標準サイズのテキストで可読性を高めます — abc 0123456789 @#%!?*
        </p>

        <p style={bodyStyles.b2}>
          일반 문단, 보조 설명 등 중간 크기 텍스트에 사용됩니다 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b2}>
          一般段落や補足説明など、中くらいのサイズのテキストに使用されます — abc 0123456789 @#%!?*
        </p>

        <p style={bodyStyles.b3}>
          작은 문단, 미세 설명, UI 안내 텍스트 등 가독성 위주 사용 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b3}>
          小さな段落や微細な説明、UI案内テキストなど可読性重視で使用 — abc 0123456789 @#%!?*
        </p>
      </section>

      <section>
        {/* Label - Form field 라벨, Checkbox / Radio 라벨, 버튼 그룹 / 옵션 그룹 라벨, 테이블 헤더 라벨 */}
        <span style={labelStyles.l1}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l1}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>

        <span style={labelStyles.l2}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l2}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>

        <span style={labelStyles.l3}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l3}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>
      </section>

      <section>
        {/* Caption - Form Validation 메시지 */}
        <span style={captionStyles.c1}>
          보조 정보, 라벨, 참고 텍스트 등 작은 글자용 서체입니다 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c1}>
          補助情報やラベル、参考テキストなど小さい文字用書体です — abc 0123456789 @#%!?*
        </span>

        <span style={captionStyles.c2}>
          UI 라벨, 부가 설명 등 아주 작은 글자용 서체 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c2}>
          UIラベルや補助説明など非常に小さい文字用書体 — abc 0123456789 @#%!?*
        </span>

        <span style={captionStyles.c3}>
          최하위 참고, 알림, 작은 안내 문구 등 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c3}>
          最下位の参考情報、通知や小さな案内文など — abc 0123456789 @#%!?*
        </span>
      </section>

      <section>
        {/* Button */}
        <button style={btnStyles.btn1}>기본 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn1}>基本ボタンテキスト — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn2}>강조 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn2}>強調ボタンテキスト — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn3}>보조 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn3}>補助ボタンテキスト — abc 0123456789 @#%!?*</button>
      </section>
    </>
  );
}

export default App;
