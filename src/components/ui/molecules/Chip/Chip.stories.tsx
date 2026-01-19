import type { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './Chip';
import Icon from '../../atoms/Icon/Icon';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CHIP_KEYS = ['label_a', 'label_b', 'label_c'];

const meta: Meta<typeof Chip> = {
  title: 'UI/Molecules/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Chip**은 입력, 선택, 필터링 등 다양한 액션을 컴팩트한 형태로 제공하는 요소입니다. <br /><br />' +
          '• **Role-based Semantic**: 설정된 `role`에 따라 내부적으로 `span`, `button`, `a` 태그로 자동 변환되어 의미론적 마크업을 완성합니다. <br />' +
          '• **Accessibility Focus**: 선택(`aria-checked`), 필터(`aria-pressed`), 비활성화(`aria-disabled`) 등의 상태를 보조 공학 기기에 정확히 전달합니다. <br />' +
          '• **UX Interaction**: 입력형 칩(`input`) 삭제 시 다음 요소로 포커스를 자동 이동시키는 등의 세밀한 조작 경험이 포함되어 있습니다.',
      },
    },
  },
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

/**
 * 인터랙션이 없는 가장 기본적인 정적 상태입니다.
 * - **Use Case**: 카테고리 태그, 읽기 전용 상태 표시(배지) 등에 사용됩니다.
 */
export const Static: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper>
        <GuideCell>
          <Chip {...args} label={t('chip.static.label')} />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/**
 * SM(Small)과 MD(Medium) 두 가지 사이즈를 검증합니다.
 * - **Checklist**: 아이콘 포함 여부나 삭제 버튼 유무에 관계없이 일정한 높이와 내부 여백이 유지되는지 확인합니다.
 */
export const Sizes: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.static.label');
    return (
      <GuideWrapper
        style={{ width: 'fit-content', margin: 'auto', gap: '40px', alignItems: 'center' }}
      >
        <GuideGroup title='SM'>
          <GuideCell>
            <Chip {...args} variant='solid' size='sm' label={label} />
            <Chip
              {...args}
              variant='solid'
              size='sm'
              label={label}
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
              label={label}
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
            <Chip {...args} role='input' variant='solid' size='sm' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' size='sm' label={label} />
            <Chip
              {...args}
              variant='outline'
              size='sm'
              label={label}
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
              label={label}
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
            <Chip {...args} role='input' variant='outline' size='sm' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='MD'>
          <GuideCell>
            <Chip {...args} variant='solid' size='md' label={label} />
            <Chip
              {...args}
              variant='solid'
              size='md'
              label={label}
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
              label={label}
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
            <Chip {...args} role='input' variant='solid' size='md' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' size='md' label={label} />
            <Chip
              {...args}
              variant='outline'
              size='md'
              label={label}
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
              label={label}
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
            <Chip {...args} role='input' variant='outline' size='md' label={label} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 시각적 무게감에 따른 두 가지 스타일입니다.
 * - **Solid**: 강조하고 싶은 핵심 정보나 선택된 상태에 사용합니다.
 * - **Outline**: 부가적인 정보나 선택되지 않은 대기 상태에 적합합니다.
 */
export const Variants: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.static.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Solid'>
          <GuideCell>
            <Chip {...args} variant='solid' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Outline'>
          <GuideCell>
            <Chip {...args} variant='outline' label={label} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 디자인 시스템의 테마 컬러를 적용합니다.
 * - **Caution**: Tertiary 컬러(#a78bfa)의 경우 배경 대비 텍스트 가독성 수치를 확인하여 접근성 기준을 준수하는지 점검하세요.
 */
export const Colors: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.static.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Primary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='primary' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='primary' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Secondary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='secondary' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='secondary' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Tertiary'>
          <GuideCell>
            <Chip {...args} variant='solid' color='tertiary' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} variant='outline' color='tertiary' label={label} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 모서리 곡률(Square, Rounded, Pill)에 따른 디자인 변화를 확인합니다.
 * - 서비스 전반의 톤앤매너와 일치하는 형태를 선택하여 일관성을 유지합니다.
 */
export const Shapes: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.static.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Square'>
          <GuideCell>
            <Chip {...args} shape='square' variant='solid' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='square' variant='outline' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rouned'>
          <GuideCell>
            <Chip {...args} shape='rounded' variant='solid' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='rounded' variant='outline' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Chip {...args} shape='pill' variant='solid' label={label} />
          </GuideCell>
          <GuideCell>
            <Chip {...args} shape='pill' variant='outline' label={label} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 텍스트 전후방에 아이콘이 배치된 형태입니다.
 * - **Visual Clue**: 아이콘을 통해 칩이 수행할 액션(삭제, 공유, 체크 등)을 직관적으로 암시합니다.
 */
export const WithIcon: Story = {
  args: {
    role: 'static',
    label: '정적 태그',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.static.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup title='Start Icon'>
          <GuideCell>
            <Chip
              {...args}
              variant='solid'
              label={label}
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
              label={label}
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
              label={label}
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
              label={label}
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

/**
 * 칩의 물리적 인터랙션과 논리적 상태를 검증합니다.
 * - **Focus/Hover**: 마우스 및 키보드 접근 시 나타나는 시각적 피드백을 확인합니다.
 * - **Disabled**: 비활성 상태 시 클릭 이벤트와 포커스 진입이 차단되는지 체크합니다.
 */
export const States: Story = {
  args: {
    label: '상태별 칩',
    role: 'action',
  },
  render: args => {
    const { t } = useTranslation();
    const label = t('chip.status.label');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '30px' }}>
        <GuideGroup title='인터랙션 상태'>
          <GuideCell caption='Default'>
            <Chip {...args} label={label} />
          </GuideCell>
          <GuideCell caption='Hover'>
            <Chip {...args} className='pseudo-hover' label={label} />
          </GuideCell>
          <GuideCell caption='Focus'>
            <Chip {...args} className='pseudo-focus' label={label} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='논리적 상태'>
          <GuideCell caption='Selected'>
            <Chip
              {...args}
              label={label}
              startIcon={<Icon name='check' className='icon' strokeWidth={2.5} />}
              selected={true}
            />
          </GuideCell>
          <GuideCell caption='Disabled'>
            <Chip
              {...args}
              label={label}
              startIcon={<Icon name='check' className='icon' strokeWidth={2.5} />}
              disabled={true}
            />
          </GuideCell>
          <GuideCell caption='Disabled'>
            <Chip
              {...args}
              variant='outline'
              label={label}
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

/**
 * 여러 옵션 중 하나만 선택할 수 있는 라디오 버튼 형식의 그룹입니다.
 * - **A11y**: 내부적으로 `role="radio"`와 `aria-checked`가 동작하여 접근성을 보장합니다.
 */
export const ChoiceGroup: StoryObj<typeof Chip> = {
  render: args => {
    const { t } = useTranslation();
    const options = CHIP_KEYS.map(key => t(`chip.choice.items.${key}`));
    const [selectedLabel, setSelectedLabel] = useState<string>(options[0]);

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

/**
 * 여러 옵션을 다중 선택하거나 해제할 수 있는 체크박스 형식의 그룹입니다.
 * - **Feedback**: 선택된 상태에서 'Check' 아이콘을 동적으로 노출하여 시각적 인지도를 높입니다.
 */
export const FilterGroup: StoryObj<typeof Chip> = {
  render: args => {
    const { t } = useTranslation();
    const options = CHIP_KEYS.map(key => t(`chip.filter.items.${key}`));
    // 1. 초기값에 1, 2번째를 포함시켜 기본 선택 상태로 설정
    const [selected, setSelected] = useState<string[]>(options.slice(0, 2));

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

/**
 * 사용자가 항목을 자유롭게 삭제할 수 있는 입력형 칩 그룹입니다.
 * - **Focus Management**: 칩 삭제 후 포커스가 사라지지 않도록 다음(또는 이전) 칩으로 포커스를 자동 이동시키는 로직을 포함합니다.
 * - **A11y Reminder**: 저장하신 지침에 따라, 연속 삭제 시 브라우저 툴팁이 다른 요소를 가리는 'partially obscured' 문제를 방지하기 위해 `title` 속성 사용을 지양합니다.
 */
export const InputGroup: StoryObj<typeof Chip> = {
  render: args => {
    const { t } = useTranslation();
    const solidSeed = CHIP_KEYS.map(key => t(`chip.input.solid.items.${key}`));
    const outlineSeed = CHIP_KEYS.map(key => t(`chip.input.outline.items.${key}`));
    const [solidTags, setSolidTags] = useState<string[]>(solidSeed);
    const [outlineTags, setOutlineTags] = useState<string[]>(outlineSeed);

    const solidGroupId = useId();
    const outlineGroupId = useId();

    const handleFocusNext = (groupId: string, index: number) => {
      // 상태 업데이트 및 리렌더링이 완료된 후 실행되도록 보장
      setTimeout(() => {
        const container = document.querySelector<HTMLDivElement>(
          `[data-chip-group="${groupId}"]`,
        );
        if (!container) return;

        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        if (buttons.length === 0) return;

        const nextIndex = Math.min(index, buttons.length - 1);
        buttons[nextIndex]?.focus();
      }, 0);
    };

    const handleSolidDelete = (tag: string, index: number) => {
      handleFocusNext(solidGroupId, index);
      setSolidTags(prev => prev.filter(t => t !== tag));
    };

    const handleOutlineDelete = (tag: string, index: number) => {
      handleFocusNext(outlineGroupId, index);
      setOutlineTags(prev => prev.filter(t => t !== tag));
    };

    return (
      <GuideWrapper
        style={{ gap: '14px', margin: 'auto', width: 'fit-content', alignItems: 'flex-start' }}
      >
        <GuideGroup title='Solid Input Chips'>
          <div data-chip-group={solidGroupId} style={{ display: 'flex', gap: '10px' }}>
            {solidTags.map((tag, index) => (
              <Chip
                {...args}
                key={tag}
                label={tag}
                role='input'
                variant='solid'
                onDelete={() => handleSolidDelete(tag, index)}
              />
            ))}
          </div>
        </GuideGroup>
        <GuideGroup title='Outline Input Chips'>
          <div data-chip-group={outlineGroupId} style={{ display: 'flex', gap: '10px' }}>
            {outlineTags.map((tag, index) => (
              <Chip
                {...args}
                key={tag}
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

/**
 * 특정 액션(다운로드, 공유)을 실행하거나 외부 링크로 이동하는 브리지 역할을 합니다.
 * - **Tag Morphing**: `href` 속성 존재 시 자동으로 `<a>` 태그로 변환되어 검색 엔진과 접근성을 최적화합니다.
 */
export const ActionGroup: StoryObj<typeof Chip> = {
  render: args => {
    const { t } = useTranslation();
    const shareLabel = t('chip.action.interaction.share');
    const downloadLabel = t('chip.action.interaction.download');
    const navLabel1 = t('chip.action.navigation.label_1');
    const navLabel2 = t('chip.action.navigation.label_2');
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
              label={downloadLabel}
              role='action'
              onSelect={handleDownload}
              endIcon={<Icon name='download' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label={shareLabel}
              role='action'
              onSelect={handleShare}
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label={downloadLabel}
              role='action'
              variant='outline'
              onSelect={handleDownload}
              endIcon={<Icon name='download' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label={shareLabel}
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
              label={navLabel1}
              role='action'
              href='https://storybook.js.org/'
              target='_blank'
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip {...args} label={navLabel2} role='action' href='/profile' />
            <Chip
              {...args}
              label={navLabel1}
              role='action'
              href='https://storybook.js.org/'
              target='_blank'
              variant='outline'
              endIcon={<Icon name='share' className='icon' strokeWidth={2.5} />}
            />
            <Chip
              {...args}
              label={navLabel2}
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
