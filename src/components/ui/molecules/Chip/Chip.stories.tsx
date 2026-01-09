import type { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './Chip';
import Icon from '../../atoms/Icon/Icon';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useRef, useState } from 'react';
import Button from '../Button/Button';

const meta: Meta<typeof Chip> = {
  title: 'UI/Molecules/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    // --- 1. Identity & Content ---
    role: {
      control: 'select',
      options: ['static', 'choice', 'filter', 'input', 'action'],
      description:
        '칩의 역할에 따라 span, button, a, div 태그로 변환되며 ARIA 속성이 최적화됩니다.',
      table: { category: 'Identity' },
    },
    label: { control: 'text', table: { category: 'Identity' } },
    startIcon: { description: '텍스트 앞에 표시될 아이콘입니다.', table: { category: 'Identity' } },
    endIcon: { description: '텍스트 앞에 표시될 아이콘입니다.', table: { category: 'Identity' } },
    className: {
      control: 'text',
      description: '외부에서 스타일을 확장하거나 커스텀할 때 사용하는 클래스명입니다.',
      table: { category: 'Identity' },
    },

    // --- 2. Appearance ---
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
      table: { category: 'Appearance' },
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description:
        'Tertiary(#a78bfa) 사용 시 명도 대비(2.28:1)가 낮으므로 텍스트 가독성에 주의하세요.',
      table: { category: 'Appearance' },
    },

    // --- 3. Status ---
    selected: { control: 'boolean', table: { category: 'Status' } },
    disabled: { control: 'boolean', table: { category: 'Status' } },

    // --- 4. Interactions ---
    href: { control: 'text', table: { category: 'Interactions' } },
    target: {
      control: 'inline-radio',
      options: ['_blank', '_self'],
      if: { arg: 'href' },
      table: { category: 'Interactions' },
    },
    title: {
      control: 'text',
      description:
        '[접근성 가이드] 툴팁 가림(Partially Obscured) 문제로 인해 가급적 사용을 피해주세요.',
      table: { category: 'Interactions' },
    },
    onSelect: { action: 'selected', table: { category: 'Interactions' } },
    onDelete: { action: 'deleted', table: { category: 'Interactions' } },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    shape: 'pill',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

/** * Static: 가장 기본적인 정적 칩 형태입니다.
 * 단순 정보 표시(Badge, Tag) 목적으로 사용되며 인터랙션이 없습니다.
 */
export const Static: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper>
        <GuideCell>
          <Chip {...args} />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/** * Sizes: SM, MD 두 가지 사이즈별 칩을 보여줍니다.
 * 아이콘 유무, Role(static, input)에 따른 크기 변화를 한눈에 비교할 수 있습니다.
 */
export const Sizes: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper
        style={{ width: 'fit-content', margin: 'auto', gap: '40px', alignItems: 'center' }}
      >
        <GuideGroup title='SM'>
          <GuideCell>
            <Chip {...args} variant='solid' size='sm' />
            <Chip
              {...args}
              variant='solid'
              size='sm'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip
              {...args}
              variant='solid'
              size='sm'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip {...args} role='input' variant='solid' size='sm' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' size='sm' />
            <Chip
              {...args}
              variant='outline'
              size='sm'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip
              {...args}
              variant='outline'
              size='sm'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip {...args} role='input' variant='outline' size='sm' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='MD'>
          <GuideCell>
            <Chip {...args} variant='solid' size='md' />
            <Chip
              {...args}
              variant='solid'
              size='md'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip
              {...args}
              variant='solid'
              size='md'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip {...args} role='input' variant='solid' size='md' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' size='md' />
            <Chip
              {...args}
              variant='outline'
              size='md'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip
              {...args}
              variant='outline'
              size='md'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
            <Chip {...args} role='input' variant='outline' size='md' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * Variants: Solid(채우기)와 Outline(선) 두 가지 핵심 스타일을 비교합니다.
 */
export const Variants: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Solid'>
          <GuideCell>
            <Chip {...args} variant='solid' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Outline'>
          <GuideCell>
            <Chip {...args} variant='outline' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * Colors: Primary, Secondary, Tertiary 테마 색상별 적용 모습을 확인합니다.
 * 명도 대비(Contrast Check)를 확인하기에 적합한 스토리입니다.
 */
export const Colors: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Primary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='primary' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='primary' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Secondary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='secondary' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='secondary' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Tertiary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='tertiary' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='tertiary' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * Shapes: Square, Rounded, Pill 세 가지 모서리 곡률 옵션을 보여줍니다.
 */
export const Shapes: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Square'>
          <GuideCell>
            <Chip {...args} shape='square' variant='solid' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='square' variant='outline' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rouned'>
          <GuideCell>
            <Chip {...args} shape='rounded' variant='solid' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='rounded' variant='outline' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Chip {...args} shape='pill' variant='solid' />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='pill' variant='outline' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * WithIcon: 텍스트 앞(Start) 또는 뒤(End)에 아이콘이 배치된 형태를 보여줍니다.
 */
export const WithIcon: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Start Icon'>
          <GuideCell>
            <Chip
              {...args}
              variant='solid'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
          </GuideCell>
          <GuideCell>
            <Chip
              {...args}
              variant='outline'
              startIcon={
                <Icon
                  name='check'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='End Icon'>
          <GuideCell>
            <Chip
              {...args}
              variant='solid'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
          </GuideCell>
          <GuideCell>
            <Chip
              {...args}
              variant='outline'
              endIcon={
                <Icon
                  name='share'
                  className='icon'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * States: 칩의 논리적/물리적 상태를 정의합니다.
 * - Interaction: Hover, Focus 시의 시각적 피드백 확인
 * - Logic: Selected(선택됨), Disabled(비활성) 상태의 ARIA 속성 및 스타일 확인
 */
export const States: Story = {
  args: {
    label: '상태별 칩',
    role: 'action',
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '30px' }}>
        <GuideGroup title='인터랙션 상태'>
          <GuideCell caption='Default'>
            <Chip {...args} />
          </GuideCell>
          <GuideCell caption='Hover'>
            <Chip {...args} className='pseudo-hover' />
          </GuideCell>
          <GuideCell caption='Focus'>
            <Chip {...args} className='pseudo-focus' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='논리적 상태'>
          <GuideCell caption='Selected'>
            <Chip
              {...args}
              startIcon={<Icon name='check' className='icon' strokeWidth={2.5} />}
              selected={true}
            />
          </GuideCell>
          <GuideCell caption='Disabled'>
            <Chip
              {...args}
              startIcon={<Icon name='check' className='icon' strokeWidth={2.5} />}
              disabled={true}
            />
          </GuideCell>
          <GuideCell caption='Disabled'>
            <Chip
              {...args}
              variant='outline'
              startIcon={<Icon name='check' className='icon' strokeWidth={2.5} />}
              selected={true}
              disabled={true}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * ChoiceGroup: 라디오 버튼처럼 동작하는 단일 선택 그룹입니다.
 * 내부적으로 role="radio" 및 aria-checked가 적용되어 접근성을 보장합니다.
 */
export const ChoiceGroup: StoryObj<typeof Chip> = {
  render: args => {
    const [selectedLabel, setSelectedLabel] = useState<string>('옵션 1');
    const options = ['옵션 1', '옵션 2', '옵션 3'];

    return (
      <GuideWrapper style={{ gap: '14px', margin: 'auto', width: 'fit-content' }}>
        <GuideGroup>
          <div style={{ display: 'flex', gap: '10px' }}>
            {options.map(option => {
              const isSelected = selectedLabel === option;

              return (
                <Chip
                  {...args}
                  key={option}
                  variant={isSelected ? 'solid' : 'outline'}
                  label={option}
                  role='choice'
                  selected={isSelected}
                  onSelect={() => setSelectedLabel(option)}
                />
              );
            })}
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * FilterGroup: 체크박스처럼 동작하는 다중 선택 그룹입니다.
 * 1, 2번째 항목이 기본 선택되어 있으며, role="filter"와 aria-pressed로 상태를 알립니다.
 */
export const FilterGroup: StoryObj<typeof Chip> = {
  render: args => {
    // 1. 초기값에 '필터 1', '필터 2'를 포함시켜 1, 2번째를 기본 선택 상태로 설정
    const [selected, setSelected] = useState<string[]>(['필터 1', '필터 2']);
    const options = ['필터 1', '필터 2', '필터 3', '필터 4'];

    const toggle = (label: string) => {
      setSelected(prev =>
        prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label],
      );
    };

    return (
      <GuideWrapper style={{ gap: '14px', margin: 'auto', width: 'fit-content' }}>
        <GuideGroup>
          <div style={{ display: 'flex', gap: '10px' }}>
            {options.map(option => {
              const isSelected = selected.includes(option);
              return (
                <Chip
                  {...args}
                  key={option}
                  label={option}
                  role='filter'
                  variant={isSelected ? 'solid' : 'outline'}
                  selected={isSelected}
                  onSelect={() => toggle(option)}
                  startIcon={
                    isSelected ? (
                      <Icon name='check' className='icon' strokeWidth={2.5} />
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * InputGroup: 사용자가 항목을 삭제할 수 있는 입력형 칩 그룹입니다.
 * - UX 포인트: 삭제 시 forwardRef를 이용해 가장 가까운 칩의 닫기 버튼으로 포커스를 자동 이동시킵니다.
 * - 주의: 연속 삭제 시 Partially Obscured 문제를 방지하기 위해 title 속성 사용을 지양합니다.
 */
export const InputGroup: StoryObj<typeof Chip> = {
  render: args => {
    const [solidTags, setSolidTags] = useState<string[]>(['React', 'TypeScript', 'Storybook']);
    const [outlineTags, setOutlineTags] = useState<string[]>(['Vite', 'PNPM', 'SCSS']);

    // 각 그룹별 독립적인 Ref 배열
    const solidRefs = useRef<(HTMLElement | null)[]>([]);
    const outlineRefs = useRef<(HTMLElement | null)[]>([]);

    const handleFocusNext = (
      refs: React.RefObject<(HTMLElement | null)[]>,
      index: number,
      currentTagsLength: number,
    ) => {
      // 상태 업데이트 및 리렌더링이 완료된 후 실행되도록 보장
      setTimeout(() => {
        if (!refs.current) return;

        // 가장 가까운 인덱스 계산 (다음 요소, 없으면 이전 요소)
        const nextIndex = index < currentTagsLength - 1 ? index : currentTagsLength - 2;

        if (nextIndex >= 0) {
          const targetChip = refs.current[nextIndex];
          // Chip 내부의 삭제 버튼(.chip__delete-btn)을 정확히 찾아 포커스
          // CSS Module을 사용 중이라면 Styles['chip__delete-btn'] 클래스를 사용해야 합니다.
          const deleteBtn = targetChip?.querySelector('button');
          deleteBtn?.focus();
        }
      }, 0);
    };

    const handleSolidDelete = (tag: string, index: number) => {
      handleFocusNext(solidRefs, index, solidTags.length);
      setSolidTags(prev => prev.filter(t => t !== tag));
    };

    const handleOutlineDelete = (tag: string, index: number) => {
      handleFocusNext(outlineRefs, index, outlineTags.length);
      setOutlineTags(prev => prev.filter(t => t !== tag));
    };

    return (
      <GuideWrapper
        style={{ gap: '14px', margin: 'auto', width: 'fit-content', alignItems: 'flex-start' }}
      >
        <GuideGroup title='Solid Input Chips'>
          <div style={{ display: 'flex', gap: '10px' }}>
            {solidTags.map((tag, index) => (
              <Chip
                {...args}
                key={tag}
                ref={el => {
                  solidRefs.current[index] = el;
                }}
                label={tag}
                role='input'
                variant='solid'
                onDelete={() => handleSolidDelete(tag, index)}
              />
            ))}
          </div>
        </GuideGroup>
        <GuideGroup title='Outline Input Chips'>
          <div style={{ display: 'flex', gap: '10px' }}>
            {outlineTags.map((tag, index) => (
              <Chip
                {...args}
                key={tag}
                ref={el => {
                  outlineRefs.current[index] = el;
                }}
                label={tag}
                role='input'
                variant='outline'
                onDelete={() => handleOutlineDelete(tag, index)}
              />
            ))}
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/** * ActionGroup: 클릭 시 특정 함수를 실행하거나 링크로 이동하는 칩입니다.
 * - Interaction: 버튼 형태의 액션 실행
 * - Navigation: href 속성을 통한 페이지 이동 (a 태그로 렌더링)
 */
export const ActionGroup: StoryObj<typeof Chip> = {
  render: args => {
    const handleDownload = () => alert('파일 다운로드를 시작합니다.');
    const handleShare = () => alert('공유하기 모달을 엽니다.');

    return (
      <GuideWrapper
        style={{ gap: '14px', width: 'fit-content', margin: 'auto', alignItems: 'flex-start' }}
      >
        <GuideGroup title='Interaction Buttons'>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Chip
              {...args}
              label='파일 다운로드'
              role='action'
              onSelect={handleDownload}
              endIcon={<Icon name='download' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label='공유하기'
              role='action'
              onSelect={handleShare}
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label='파일 다운로드'
              role='action'
              variant='outline'
              onSelect={handleDownload}
              endIcon={<Icon name='download' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label='공유하기'
              role='action'
              variant='outline'
              onSelect={handleShare}
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
          </div>
        </GuideGroup>
        <GuideGroup title='Navigation Links'>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Chip
              {...args}
              label='공식 문서 확인'
              role='action'
              href='https://storybook.js.org/'
              target='_blank'
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip {...args} label='내 프로필로 이동' role='action' href='/profile' />
            <Chip
              {...args}
              label='공식 문서 확인'
              role='action'
              href='https://storybook.js.org/'
              target='_blank'
              variant='outline'
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label='내 프로필로 이동'
              role='action'
              href='/profile'
              variant='outline'
            />
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};
