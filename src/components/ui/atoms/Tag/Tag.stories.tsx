import type { Meta, StoryObj } from '@storybook/react-vite';
import Tag from './Tag';
import Icon from '../../atoms/Icon/Icon';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useRef, useState } from 'react';
import Button from '../../molecules/Button/Button';

const meta: Meta<typeof Tag> = {
  title: 'UI/Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    // --- 1. Content & Identity ---
    label: {
      control: 'text',
      description: '태그 내부에 표시될 텍스트입니다.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    startIcon: {
      control: 'boolean', // 스토리에서 아이콘 유무를 쉽게 테스트하기 위해 boolean으로 유도 가능
      description: '텍스트 왼쪽에 표시될 아이콘입니다.',
      table: { category: 'Content' },
    },
    endIcon: {
      control: 'boolean',
      description: '텍스트 오른쪽에 표시될 아이콘입니다. (삭제 버튼으로 활용 가능)',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      description: '커스텀 스타일 적용을 위한 클래스명입니다.',
      table: { category: 'Identity' },
    },

    // --- 2. Appearance ---
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
      description: '배지의 시각적 무게감을 설정합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'solid' },
      },
    },
    shape: {
      control: 'select',
      options: ['square', 'rounded', 'pill'],
      description: '모서리 곡률을 결정합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'rounded' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: '태그의 전체적인 크기 시스템입니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '디자인 시스템의 테마 색상을 적용합니다.',
      table: { category: 'Appearance' },
    },

    // --- 3. Interactions ---
    href: {
      control: 'text',
      description: '입력 시 <a> 태그로 렌더링되며 네비게이션 역할을 수행합니다.',
      table: { category: 'Interactions' },
    },
    target: {
      control: 'inline-radio',
      options: ['_blank', undefined],
      description: '링크 태그(<a>)의 타겟 속성입니다.',
      table: { category: 'Interactions' },
    },
    onDelete: {
      description:
        '입력 시 삭제 가능한 <button> 태그로 렌더링됩니다. 내부적으로 포커스 관리 로직이 적용됩니다.',
      table: { category: 'Interactions' },
    },
  },
  args: {
    variant: 'solid',
    shape: 'rounded',
    color: 'primary',
    size: 'sm',
    label: '태그',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof Tag>;

/**
 * 🏷️ Base: 정보를 분류하기 위한 가장 기본적인 정적 키워드 태그입니다.
 * 인터랙션이 필요한 Chip이나 상태를 나타내는 Badge와 달리,
 * 순수하게 콘텐츠의 메타데이터를 나열할 때 사용합니다.
 */
export const Base: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <Tag {...args}>태그</Tag>
    </GuideWrapper>
  ),
};

/**
 * ✨ Variants: 태그의 시각적 무게감(Weight)을 결정합니다.
 * - Solid: 강한 강조가 필요하거나 배경색이 밝은 영역에 사용하여 가독성을 확보합니다.
 * - Outline: 보조적인 정보나 데이터가 밀집된 리스트 내에서 시각적 부하를 줄일 때 적합합니다.
 */
export const Variants: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <GuideGroup title='Solid'>
        <Tag {...args} variant='solid' />
      </GuideGroup>
      <GuideGroup title='Outline'>
        <Tag {...args} variant='outline' />
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 📏 Sizes: 다양한 레이아웃에 대응하기 위한 크기 시스템입니다.
 * 텍스트 밀도에 따라 SM(작은 영역, 리스트 내부)과 MD(일반적인 정보 레이아웃)를 선택할 수 있습니다.
 */
export const Sizes: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <GuideGroup title='SM'>
        <Tag {...args} size='sm' />
      </GuideGroup>
      <GuideGroup title='MD'>
        <Tag {...args} size='md' />
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 🔍 WithIcon: 아이콘을 결합하여 정보의 메타데이터 성격을 명확히 합니다.
 * - Start Icon: 해시(#)나 카테고리 기호 등 태그의 성격을 규정할 때 사용합니다.
 * - End Icon: 링크(Link) 표시 등 뒤따르는 동작이나 추가 정보를 암시할 때 사용합니다.
 */
export const WithIcon: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto', alignItems: 'flex-start' }}>
      <GuideGroup title='Start Icon'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag
            {...args}
            startIcon={
              <Icon
                name='hash'
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
          <Tag
            {...args}
            variant='outline'
            startIcon={
              <Icon
                name='hash'
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
        </div>
      </GuideGroup>
      <GuideGroup title='End Icon'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag
            {...args}
            label='네이버로 이동'
            href='https://www.naver.com/'
            target='_blank'
            endIcon={
              <Icon
                name='link'
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
          <Tag
            {...args}
            variant='outline'
            label='네이버로 이동'
            href='https://www.naver.com/'
            target='_blank'
            endIcon={
              <Icon
                name='link'
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
        </div>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 📐 Shapes: UI 성격에 따른 모서리 곡률 변형입니다.
 * - Square/Rounded: 시스템적인 관리 도구나 대시보드에서 정갈한 느낌을 줍니다.
 * - Pill: 완전한 곡선을 사용하여 해시태그나 카테고리 등 '키워드'의 성격을 강조합니다.
 */
export const Shapes: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <GuideGroup title='Square'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' shape='square' />
          <Tag {...args} variant='outline' shape='square' />
        </div>
      </GuideGroup>
      <GuideGroup title='Rounded'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' shape='rounded' />
          <Tag {...args} variant='outline' shape='rounded' />
        </div>
      </GuideGroup>
      <GuideGroup title='Pill'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' shape='pill' />
          <Tag {...args} variant='outline' shape='pill' />
        </div>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 🎨 Colors: 디자인 시스템의 의미적 컬러(Semantic Color)를 적용합니다.
 * * [접근성 포인트]
 * - 모든 컬러 세트는 배경 대비 4.5:1(AA) 이상의 명도 대비를 유지하도록 설계되었습니다.
 * - 특히 Outline 스타일의 경우, 테두리와 텍스트 색상이 배경에서 가려진(Obscured) 느낌을 주지 않도록 고대비 컬러를 할당했습니다.
 */
export const Colors: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <GuideGroup title='Primary'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' color='primary' />
          <Tag {...args} variant='outline' color='primary' />
        </div>
      </GuideGroup>
      <GuideGroup title='Secondary'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' color='secondary' />
          <Tag {...args} variant='outline' color='secondary' />
        </div>
      </GuideGroup>
      <GuideGroup title='Tertiary'>
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Tag {...args} variant='solid' color='tertiary' />
          <Tag {...args} variant='outline' color='tertiary' />
        </div>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 🗑️ Deletable: 사용자가 직접 항목을 제거할 수 있는 인터랙티브 태그입니다.
 * - UX 포인트: 삭제 버튼 클릭 시 onDelete 함수가 실행되며, 키보드 엔터/스페이스 키에 대응합니다.
 * * [접근성 포인트]
 * - 포커스 관리: 항목 삭제 직후 포커스가 유실되지 않도록 가장 가까운 인접 태그나 초기화 버튼으로 포커스를 강제 이동시킵니다.
 * - 레이블 제공: aria-label을 통해 '삭제 [레이블] 태그'라는 명확한 정보를 보조공학기기에 전달합니다.
 */
export const Deletable: Story = {
  render: args => {
    const initialState = ['JavaScript', 'TypeScript', 'React'];

    // 1. 상태 분리 (Solid용, Outline용)
    const [solidTags, setSolidTags] = useState(initialState);
    const [outlineTags, setOutlineTags] = useState(initialState);

    // 2. Ref 배열 분리
    const solidRefs = useRef<(HTMLElement | null)[]>([]);
    const outlineRefs = useRef<(HTMLElement | null)[]>([]);
    const solidResetRef = useRef<HTMLButtonElement>(null);
    const outlineResetRef = useRef<HTMLButtonElement>(null);

    // 3. 통합 삭제 핸들러 (Ref와 상태를 인자로 받아 범용적으로 사용)
    const handleDelete = (
      targetTag: string,
      index: number,
      tags: string[],
      setTags: React.Dispatch<React.SetStateAction<string[]>>,
      refs: React.RefObject<(HTMLElement | null)[]>,
      resetRef: React.RefObject<HTMLButtonElement | null>, // null 허용 타입으로 변경
    ) => {
      const isLastTag = tags.length === 1;
      const nextFocusIndex = index < tags.length - 1 ? index : index - 1;

      setTags(prev => {
        const newTags = prev.filter(tag => tag !== targetTag);

        setTimeout(() => {
          if (!isLastTag) {
            refs.current[nextFocusIndex]?.focus();
          } else {
            // 리셋 버튼이 DOM에 렌더링된 후 포커스
            resetRef.current?.focus();
          }
        }, 0);

        return newTags;
      });
    };

    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        {/* --- Solid 세트 --- */}
        <GuideGroup title='Solid Variants'>
          <div style={{ display: 'flex', gap: '10px', minHeight: '32px', alignItems: 'center' }}>
            {solidTags.map((tag, index) => (
              <Tag
                {...args}
                variant='solid'
                key={`solid-${tag}`}
                ref={el => {
                  solidRefs.current[index] = el;
                }}
                label={tag}
                onDelete={() =>
                  handleDelete(tag, index, solidTags, setSolidTags, solidRefs, solidResetRef)
                }
                endIcon={<Icon name='x' className='icon' strokeWidth={2.5} />}
              />
            ))}
            {solidTags.length === 0 && (
              <Button
                ref={solidResetRef}
                size='xs'
                variant='outline'
                color='danger'
                onClick={() => setSolidTags(initialState)}
                startIcon={<Icon name='rotate' className='icon' strokeWidth={2.5} />}
                style={{ width: 'max-content' }}
              >
                Solid 초기화
              </Button>
            )}
          </div>
        </GuideGroup>

        {/* --- Outline 세트 --- */}
        <GuideGroup title='Outline Variants'>
          <div style={{ display: 'flex', gap: '10px', minHeight: '32px', alignItems: 'center' }}>
            {outlineTags.map((tag, index) => (
              <Tag
                {...args}
                variant='outline'
                key={`outline-${tag}`}
                ref={el => {
                  outlineRefs.current[index] = el;
                }}
                label={tag}
                onDelete={() =>
                  handleDelete(
                    tag,
                    index,
                    outlineTags,
                    setOutlineTags,
                    outlineRefs,
                    outlineResetRef,
                  )
                }
                endIcon={<Icon name='x' className='icon' strokeWidth={2.5} />}
              />
            ))}
            {outlineTags.length === 0 && (
              <Button
                ref={outlineResetRef}
                size='xs'
                variant='outline'
                color='danger'
                onClick={() => setOutlineTags(initialState)}
                startIcon={<Icon name='rotate' className='icon' strokeWidth={2.5} />}
                style={{ width: 'max-content' }}
              >
                Outline 초기화
              </Button>
            )}
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 🔗 Navigational: 클릭 시 특정 경로로 이동하는 링크형 태그입니다.
 * <a> 태그로 렌더링되어 웹 표준 링크 역할을 수행하며, 해시태그나 검색 키워드에 최적화되어 있습니다.
 * * [접근성 포인트]
 * - 가림 방지: 링크 위에 마우스 오버 시 브라우저 기본 툴팁이 인접 태그를 가리는(Partially Obscured) 결함을 방지하기 위해 title 속성을 지양하고 aria-label을 권장합니다.
 * - 외부 링크: target='_blank' 사용 시 endIcon을 통해 새 창 이동임을 시각적으로 암시합니다.
 */
export const Navigational: Story = {
  args: {
    label: '네이버로 이동',
    href: 'https://www.naver.com/',
    target: '_blank',
  },
  render: args => (
    <GuideWrapper style={{ margin: 'auto', width: 'fit-content' }}>
      {/* --- Solid Navigational --- */}
      <GuideGroup title='Solid Link'>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tag
            {...args}
            variant='solid'
            color='primary'
            endIcon={<Icon name='link' className='icon' strokeWidth={2.5} />}
          />
          <Tag
            {...args}
            variant='solid'
            color='secondary'
            label='문서 확인'
            endIcon={<Icon name='file' className='icon' strokeWidth={2.5} />}
          />
        </div>
      </GuideGroup>

      {/* --- Outline Navigational --- */}
      <GuideGroup title='Outline Link'>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tag
            {...args}
            variant='outline'
            color='primary'
            endIcon={<Icon name='link' className='icon' strokeWidth={2.5} />}
          />
          <Tag
            {...args}
            variant='outline'
            color='secondary'
            label='문서 확인'
            endIcon={<Icon name='file' className='icon' strokeWidth={2.5} />}
          />
        </div>
      </GuideGroup>
    </GuideWrapper>
  ),
};
