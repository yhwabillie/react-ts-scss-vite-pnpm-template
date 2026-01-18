import type { Meta, StoryObj } from '@storybook/react-vite';
import Tag from './Tag';
import Icon from '../../atoms/Icon/Icon';
import { GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useRef, useState } from 'react';
import Button from '../../molecules/Button/Button';
import { useTranslation } from 'react-i18next';

const TAG_KEYS = ['label_a', 'label_b', 'label_c'];
const NAV_KEYS = ['label_a', 'label_b'];

const meta: Meta<typeof Tag> = {
  title: 'UI/Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Tag** 컴포넌트는 콘텐츠를 분류하거나 메타데이터를 나열할 때 사용하는 키워드 요소입니다. <br />' +
          '인터랙션이 강조된 Chip과 달리 정보를 "표시"하고 "분류"하는 데 목적이 있으며, 필요에 따라 링크(Link)나 삭제(Delete) 기능을 포함할 수 있습니다. <br /><br />' +
          '• 해시태그, 카테고리, 상태 키워드 등 용도에 최적화된 시각적 무게감 제공 <br />' +
          '• 속성에 따라 정적 요소, 링크(`<a>`), 또는 삭제 가능 버튼(`<button>`)으로 렌더링 <br />' +
          '• 삭제 기능 사용 시 포커스 유실을 방지하는 포지셔닝 로직 내장',
      },
    },
  },
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
 * 정보 분류를 위한 가장 기본적인 정적 키워드 태그입니다.
 * 별도의 인터랙션이 없는 순수 메타데이터 나열 시 사용합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Tag {...args}>{t('tag.base.label')}</Tag>
      </GuideWrapper>
    );
  },
};

/**
 * 시각적 무게감에 따른 변형입니다.
 * - Solid: 강한 강조가 필요한 핵심 키워드에 사용합니다.
 * - Outline: 보조 정보나 데이터가 많은 화면에서 시각적 간섭을 줄일 때 사용합니다.
 */
export const Variants: Story = {
  render: args => {
    const { t } = useTranslation();
    const label = t('tag.base.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Solid'>
          <Tag {...args} variant='solid' label={label} />
        </GuideGroup>
        <GuideGroup title='Outline'>
          <Tag {...args} variant='outline' label={label} />
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 레이아웃 밀도에 대응하는 크기 시스템입니다.
 * - SM: 리스트, 테이블 내부 등 좁은 영역에 최적화되어 있습니다.
 * - MD: 일반적인 상세 페이지나 카드 UI의 정보 표시용입니다.
 */
export const Sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const label = t('tag.base.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='SM'>
          <Tag {...args} size='sm' label={label} />
        </GuideGroup>
        <GuideGroup title='MD'>
          <Tag {...args} size='md' label={label} />
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 아이콘을 결합하여 정보의 성격이나 추가 동작을 암시합니다.
 * - Start Icon: 해시(#)나 카테고리 기호 등 분류 체계를 나타냅니다.
 * - End Icon: 링크 표시 등 후속 동작에 대한 시각적 힌트를 제공합니다.
 */
export const WithIcon: Story = {
  render: args => {
    const { t } = useTranslation();
    const label = t('tag.base.label');
    const navLabel = t('tag.navigational.solid_items.label_a');
    return (
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
              label={label}
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
              label={label}
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
              label={navLabel}
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
              label={navLabel}
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
    );
  },
};

/**
 * 서비스 무드 및 컴포넌트 성격에 따른 외형 정의입니다.
 * - Square/Rounded: 대시보드 및 관리 도구의 정갈한 스타일에 적합합니다.
 * - Pill: 해시태그 등 캐주얼한 키워드 강조 시 권장합니다.
 */
export const Shapes: Story = {
  render: args => {
    const { t } = useTranslation();
    const label = t('tag.base.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Square'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' shape='square' label={label} />
            <Tag {...args} variant='outline' shape='square' label={label} />
          </div>
        </GuideGroup>
        <GuideGroup title='Rounded'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' shape='rounded' label={label} />
            <Tag {...args} variant='outline' shape='rounded' label={label} />
          </div>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' shape='pill' label={label} />
            <Tag {...args} variant='outline' shape='pill' label={label} />
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 세만틱 컬러를 통한 의미 전달입니다.
 * 모든 조합은 배경 대비 4.5:1(AA) 이상의 명도 대비를 유지하여 가독성을 보장합니다.
 */
export const Colors: Story = {
  render: args => {
    const { t } = useTranslation();
    const label = t('tag.base.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Primary'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' color='primary' label={label} />
            <Tag {...args} variant='outline' color='primary' label={label} />
          </div>
        </GuideGroup>
        <GuideGroup title='Secondary'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' color='secondary' label={label} />
            <Tag {...args} variant='outline' color='secondary' label={label} />
          </div>
        </GuideGroup>
        <GuideGroup title='Tertiary'>
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Tag {...args} variant='solid' color='tertiary' label={label} />
            <Tag {...args} variant='outline' color='tertiary' label={label} />
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 삭제 기능이 포함된 인터랙티브 태그입니다.
 * - 포커스 관리: 항목 삭제 시 포커스가 유실되지 않도록 인접 요소로 자동 이동시키는 로직이 포함되어 있습니다.
 * - 접근성: 스크린 리더 사용자를 위해 삭제 버튼에 대한 명확한 aria-label 제공을 권장합니다.
 */
export const Deletable: Story = {
  render: args => {
    const { t } = useTranslation();
    const solidSeed = TAG_KEYS.map(key => t(`tag.deletable.solid_items.${key}`));
    const outlineSeed = TAG_KEYS.map(key => t(`tag.deletable.outline_items.${key}`));
    const initialState = solidSeed;

    // 1. 상태 분리 (Solid용, Outline용)
    const [solidTags, setSolidTags] = useState(solidSeed);
    const [outlineTags, setOutlineTags] = useState(outlineSeed);

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
                onClick={() => setSolidTags(solidSeed)}
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
                onClick={() => setOutlineTags(outlineSeed)}
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
 * 클릭 시 특정 경로로 이동하는 링크형 태그입니다.
 * - 렌더링: href 속성 존재 시 웹 표준 <a> 태그로 전환됩니다.
 */
export const Navigational: Story = {
  args: {
    label: '네이버로 이동',
    href: 'https://www.naver.com/',
    target: '_blank',
  },
  render: args => {
    const { t } = useTranslation();
    const solidLabels = NAV_KEYS.map(key => t(`tag.navigational.solid_items.${key}`));
    const outlineLabels = NAV_KEYS.map(key => t(`tag.navigational.outline_items.${key}`));

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content' }}>
        {/* --- Solid Navigational --- */}
        <GuideGroup title='Solid Link'>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Tag
              {...args}
              variant='solid'
              color='primary'
              label={solidLabels[0]}
              endIcon={<Icon name='link' className='icon' strokeWidth={2.5} />}
            />
            <Tag
              {...args}
              variant='solid'
              color='secondary'
              label={solidLabels[1]}
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
              label={outlineLabels[0]}
              endIcon={<Icon name='link' className='icon' strokeWidth={2.5} />}
            />
            <Tag
              {...args}
              variant='outline'
              color='secondary'
              label={outlineLabels[1]}
              endIcon={<Icon name='file' className='icon' strokeWidth={2.5} />}
            />
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};
