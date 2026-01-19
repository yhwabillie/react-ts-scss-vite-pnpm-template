import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';
import Icon from '../Icon/Icon';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import React, { useId } from 'react';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';
import IconButton from '../../molecules/IconButton/IconButton';
import clsx from 'clsx';
import IconFrame from '../../molecules/IconFrame/IconFrame';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Molecules/Input/Outline',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Outline Input**은 배경색 없이 테두리(Border)로 영역을 구분하는 스타일로, 페이지의 복잡도를 낮추고 깔끔한 레이아웃을 유지할 때 사용합니다. <br /><br />' +
          '• 흰색 배경이나 밝은 톤의 레이아웃에서 가독성이 높으며 현대적인 느낌을 제공 <br />' +
          '• 포커스 시 보더 컬러와 두께 변화를 통해 사용자의 입력 위치를 명확히 안내 <br />' +
          '• 내부 아이콘 프레임 및 액션 버튼과 결합 시 보더 라인을 공유하여 시각적 통일성 부여',
      },
    },
  },
  argTypes: {
    // 1. Base Configuration (기본 식별 및 데이터 관련)
    id: {
      description: '컴포넌트의 고유 식별자입니다.',
      table: { category: 'Base Config' },
    },
    as: {
      description: '렌더링할 HTML 태그 또는 컴포넌트 타입을 지정합니다.',
      table: { category: 'Base Config' },
    },
    placeholder: {
      description: '입력 전 사용자에게 노출되는 안내 문구입니다.',
      table: { category: 'Base Config' },
    },
    value: {
      control: 'text',
      description: '입력 필드의 데이터 값입니다 (제어 컴포넌트).',
      table: { category: 'Base Config' },
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'email', 'password', 'tel'],
      description: '입력 데이터의 데이터 타입을 정의합니다.',
      table: { category: 'Base Config' },
    },

    // 2. Appearance & Style (시각적 디자인 관련)
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft'],
      description: '입력창의 전체적인 시각적 스타일 테마를 설정합니다.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      description: '컴포넌트의 브랜드 컬러 또는 상태별 의미론적 색상을 지정합니다.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '컴포넌트의 높이(Height)와 내부 여백을 조절합니다.',
      table: { category: 'Appearance' },
    },
    shape: {
      control: 'inline-radio',
      options: ['rounded', 'square', 'pill'],
      description: '컴포넌트의 모서리 곡률(Border Radius)을 지정합니다.',
      table: { category: 'Appearance' },
    },

    // 3. Content Slots (내부 삽입 요소 관련)
    adornedStart: {
      description: '입력창 내부 시작 지점에 배치할 아이콘이나 텍스트 요소입니다.',
      table: { category: 'Content Slots' },
    },
    adornedEnd: {
      description: '입력창 내부 종료 지점에 배치할 아이콘, 버튼 등의 요소입니다.',
      table: { category: 'Content Slots' },
    },

    // 4. Accessibility & Feedback (접근성 및 기타)
    role: {
      description: 'WAI-ARIA를 위한 요소의 역할을 정의합니다.',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: '추가적인 커스텀 스타일을 적용하기 위한 클래스명입니다.',
      table: { category: 'Misc' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    shape: 'rounded',
    as: 'label',
    type: 'text',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 가장 기본이 되는 형태입니다.
 * 투명한 배경과 세밀한 보더 라인을 통해 정의된 Outline 스타일의 표준을 확인합니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {},
  render: args => {
    const { t } = useTranslation();
    const uniqueId = useId();

    return <Input {...args} id={uniqueId} placeholder={t('input.placeholder.default')} />;
  },
};

/**
 * 테두리(Border)와 내부 텍스트, 아이콘에 시멘틱 컬러가 적용된 예시입니다.
 * 배경색이 없는 만큼 보더 컬러를 통해 성공(Success)이나 오류(Danger) 상태를 명확히 구분합니다.
 */
export const Colors: Story = {
  render: args => {
    const { t } = useTranslation();
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <SpecimenCell caption='Empty'>
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-emtpy`}
                    placeholder={t('input.placeholder.default')}
                  />
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-emtpy-adorned-start`}
                    className='adorned-start'
                    placeholder='YYYY-MM-DD'
                    adornedStart={
                      <IconFrame size={args.size}>
                        <Icon
                          className='icon'
                          name='calendar'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                        />
                      </IconFrame>
                    }
                  />
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-emtpy-adorned-end`}
                    type='password'
                    className='adorned-end'
                    placeholder={t('input.placeholder.password')}
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color={color}
                        shape={args.shape}
                        size={args.size}
                        ariaLabel='비밀번호 표시'
                        icon={
                          <Icon
                            className='icon'
                            name='eye'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        }
                      />
                    }
                  />
                </SpecimenCell>
                <SpecimenCell caption='Filled'>
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-filled`}
                    placeholder={t('input.placeholder.default')}
                    defaultValue={t('input.value')}
                  />
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-filled-adorned-start`}
                    defaultValue='2026-01-01'
                    className='adorned-start'
                    placeholder='YYYY-MM-DD'
                    adornedStart={
                      <IconFrame size={args.size}>
                        <Icon
                          className='icon'
                          name='calendar'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                        />
                      </IconFrame>
                    }
                  />
                  <Input
                    {...args}
                    color={color}
                    id={`${uniqueId}-${color}-filled-adorned-end`}
                    type='password'
                    defaultValue='aa112233'
                    className='adorned-end'
                    placeholder={t('input.placeholder.password')}
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color={color}
                        shape={args.shape}
                        size={args.size}
                        ariaLabel='비밀번호 표시'
                        icon={
                          <Icon
                            className='icon'
                            name='eye'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        }
                      />
                    }
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 5가지 표준 높이 규격에 따른 보더의 섬세함과 텍스트 정렬을 검수합니다.
 * 특히 보더 라인이 얇은 특성상 사이즈가 작아질 때의 시인성을 중점적으로 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    // SCSS Map에 정의된 height 정보를 매핑
    const sizeWidthtInfo: Record<string, string> = {
      xs: '120',
      sm: '200',
      md: '320',
      lg: '480',
      xl: '100%',
    };
    const sizeHeightInfo: Record<string, string> = {
      xs: '32',
      sm: '36',
      md: '40',
      lg: '44',
      xl: '48',
    };

    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <SpecimenGroup flexWrapCenter={true}>
        {sizeOptions.map(size => {
          // 캡션에 Height 값 표시 (예: XS (32px))
          const captionText = `${size.toUpperCase()} (${sizeWidthtInfo[size]}x${sizeHeightInfo[size]})`;

          return (
            <React.Fragment key={size}>
              {size === 'xl' ? (
                <AnatomyWrapper title='부모 요소 width : 800px' style={{ width: '800px' }}>
                  <GuideCell caption={captionText}>
                    <Input
                      {...args}
                      id={`${uniqueId}-${size}`}
                      size={size}
                      placeholder={t('input.placeholder.default')}
                    />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      id={`${uniqueId}-${size}-adorned-start`}
                      size={size}
                      type='password'
                      placeholder='YYYY-MM-DD'
                      className='adorned-start'
                      adornedStart={
                        <IconFrame size={size}>
                          <Icon
                            className='icon'
                            name='calendar'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        </IconFrame>
                      }
                    />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      id={`${uniqueId}-${size}-adorned-end`}
                      type='password'
                      size={size}
                      className='adorned-end'
                      placeholder={t('input.placeholder.password')}
                      adornedEnd={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
                          size={size}
                          ariaLabel='비밀번호 표시'
                          icon={
                            <Icon
                              className='icon'
                              name='eye'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2.5}
                            />
                          }
                        />
                      }
                    />
                  </GuideCell>
                </AnatomyWrapper>
              ) : (
                <GuideRow direction='column'>
                  <GuideCell caption={captionText}>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-${size}`}
                      placeholder={t('input.placeholder.default')}
                    />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-${size}-adorned-start`}
                      placeholder='YYYY-MM-DD'
                      className='adorned-start'
                      adornedStart={
                        <IconFrame size={size}>
                          <Icon
                            className='icon'
                            name='calendar'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        </IconFrame>
                      }
                    />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-${size}-adorned-end`}
                      type='password'
                      placeholder={t('input.placeholder.password')}
                      className='adorned-end'
                      adornedEnd={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
                          size={size}
                          ariaLabel='비밀번호 표시'
                          icon={
                            <Icon
                              className='icon'
                              name='eye'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2.5}
                            />
                          }
                        />
                      }
                    />
                  </GuideCell>
                </GuideRow>
              )}
            </React.Fragment>
          );
        })}
      </SpecimenGroup>
    );
  },
};

/**
 * 마우스 오버(Hover) 시의 보더 변화와 타이핑(Focus) 시의 강조 효과를 대조합니다.
 * 비활성화(Disabled) 상태에서는 보더 라인의 투명도와 컬러가 어떻게 감쇠되는지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const { t } = useTranslation();
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus (Typing)', props: { className: 'pseudo-focus-visible' } },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <SpecimenCell caption='Empty'>
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-empty`}
                    placeholder={t('input.placeholder.default')}
                  />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-empty-adorned-start`}
                    className={clsx('adorned-start', state.props.className)}
                    placeholder='YYYY-MM-DD'
                    adornedStart={
                      <IconFrame size={args.size}>
                        <Icon
                          className='icon'
                          name='calendar'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                        />
                      </IconFrame>
                    }
                  />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-empty-adorned-end`}
                    type='password'
                    className={clsx('adorned-end', state.props.className)}
                    placeholder={t('input.placeholder.password')}
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color={args.color}
                        shape={args.shape}
                        size={args.size}
                        ariaLabel='비밀번호 표시'
                        disabled={state.props.disabled || state.props.readOnly}
                        icon={
                          <Icon
                            className='icon'
                            name='eye'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        }
                      />
                    }
                  />
                </SpecimenCell>
                <SpecimenCell caption='Filled'>
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled`}
                    placeholder={t('input.placeholder.default')}
                    defaultValue={t('input.value')}
                  />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled-adorned-start`}
                    placeholder='YYYY-MM-DD'
                    defaultValue='2026-01-01'
                    className={clsx('adorned-start', state.props.className)}
                    adornedStart={
                      <IconFrame size={args.size}>
                        <Icon
                          className='icon'
                          name='calendar'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                        />
                      </IconFrame>
                    }
                  />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled-adorned-end`}
                    type='password'
                    placeholder={t('input.placeholder.password')}
                    defaultValue='aa112233'
                    className={clsx('adorned-end', state.props.className)}
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color={args.color}
                        shape={args.shape}
                        size={args.size}
                        ariaLabel='비밀번호 표시'
                        disabled={state.props.disabled || state.props.readOnly}
                        icon={
                          <Icon
                            className='icon'
                            name='eye'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        }
                      />
                    }
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * Outline 스타일에서 가장 시각적으로 두드러지는 모서리 곡률 옵션입니다.
 * 직선적인 Square부터 부드러운 Pill까지, 보더 라인이 형성하는 외형을 테스트합니다.
 */
export const Shapes: Story = {
  render: args => {
    const { t } = useTranslation();
    const baseId = useId(); // React 18 useId 활용
    const shapeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];

    // 공통 아이콘 버튼 렌더러 (Shape 동기화)
    const renderIconButton = (shape: 'square' | 'rounded' | 'pill') => (
      <IconButton
        variant='ghost'
        color='primary'
        shape={shape} // 부모의 shape를 따름
        size={args.size}
        ariaLabel='비밀번호 표시'
        icon={<Icon className='icon' name='eye' strokeWidth={2.5} />}
      />
    );

    return (
      <GuideGroup direction='column'>
        {shapeOptions.map(shape => (
          <GuideRow key={shape} direction='column'>
            {/* 상단 캡션용 Cell */}
            <GuideCell caption={shape.toUpperCase()}>
              {/* 케이스 1: 기본 형태 (Empty) */}
              <Input
                {...args}
                shape={shape}
                id={`${baseId}-${shape}-empty`}
                placeholder={t('input.placeholder.default')}
              />

              {/* 케이스 2: Adorned Start (Filled) */}
              <Input
                {...args}
                shape={shape}
                id={`${baseId}-${shape}-start`}
                className='adorned-start'
                placeholder='YYYY-MM-DD'
                adornedStart={
                  <IconFrame size={args.size}>
                    <Icon
                      className='icon'
                      name='calendar'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2.5}
                    />
                  </IconFrame>
                }
              />

              {/* 케이스 3: Adorned End (Filled) */}
              <Input
                {...args}
                shape={shape}
                id={`${baseId}-${shape}-end`}
                type='password'
                className='adorned-end'
                placeholder={t('input.placeholder.password')}
                adornedEnd={renderIconButton(shape)}
              />
            </GuideCell>
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

/**
 * 시작과 끝 슬롯에 요소가 배치된 결합 형태입니다.
 * 보더로 구획된 내부 공간 안에서 아이콘과 입력 텍스트가 조화롭게 배치되었는지 확인합니다.
 */
export const Composition: Story = {
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <GuideGroup>
        <GuideRow direction='column'>
          <GuideCell caption='Left Icon'>
            <Input
              {...args}
              id={`${uniqueId}-left`}
              className='adorned-start'
              placeholder='YYYY-MM-DD'
              adornedStart={
                <IconFrame size={args.size}>
                  <Icon
                    className='icon'
                    name='calendar'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                  />
                </IconFrame>
              }
            />
          </GuideCell>
          <GuideCell caption='Right Icon'>
            <Input
              {...args}
              id={`${uniqueId}-right`}
              type='password'
              className='adorned-end'
              placeholder={t('input.placeholder.password')}
              adornedEnd={
                <IconButton
                  variant='ghost'
                  color='primary'
                  size={args.size}
                  ariaLabel='비밀번호 표시'
                  icon={<Icon className='icon' name='eye' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
        </GuideRow>
      </GuideGroup>
    );
  },
};

/**
 * 보더 영역 내에서 긴 텍스트가 입력되었을 때의 말줄임 로직을 검증합니다.
 * Outline 스타일의 특성상 텍스트가 보더 가이드라인을 벗어나지 않도록 안전 영역을 확인합니다.
 */
export const LongText: Story = {
  render: args => {
    const { t } = useTranslation();
    const sizeOptions: Array<'md' | 'xl'> = ['md', 'xl'];
    const uniqueId = `input-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <SpecimenGroup direction='column'>
        {sizeOptions.map((size, idx) => (
          <React.Fragment key={size}>
            {size === 'xl' ? (
              <AnatomyWrapper title='부모 요소 : 800px'>
                <SpecimenRow>
                  <SpecimenCell caption='XL (100%)' style={{ width: '800px' }}>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-empty-${idx}`}
                      defaultValue={t('long-text')}
                      placeholder={t('input.placeholder.default')}
                    />
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-adorned-start-${idx}`}
                      defaultValue={t('long-text')}
                      placeholder={t('input.placeholder.default')}
                      className='adorned-start'
                      adornedStart={
                        <IconFrame size={size}>
                          <Icon
                            className='icon'
                            name='map-pin'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        </IconFrame>
                      }
                    />
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-adorned-end-${idx}`}
                      defaultValue={t('long-text')}
                      placeholder={t('input.placeholder.default')}
                      className='adorned-end'
                      adornedEnd={
                        <IconButton
                          variant='ghost'
                          color={args.color}
                          shape={args.shape}
                          size={size}
                          ariaLabel='검색 버튼'
                          icon={
                            <Icon
                              className='icon'
                              name='search'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2.5}
                            />
                          }
                        />
                      }
                    />
                  </SpecimenCell>
                </SpecimenRow>
              </AnatomyWrapper>
            ) : (
              <SpecimenRow>
                <SpecimenCell>
                  <Input
                    {...args}
                    size={size}
                    id={`${uniqueId}-empty-${idx}`}
                    defaultValue={t('long-text')}
                    placeholder={t('input.placeholder.default')}
                  />
                  <Input
                    {...args}
                    size={size}
                    id={`${uniqueId}-adorned-start-${idx}`}
                    placeholder={t('input.placeholder.default')}
                    className='adorned-start'
                    adornedStart={
                      <IconFrame size={size}>
                        <Icon
                          className='icon'
                          name='map-pin'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                        />
                      </IconFrame>
                    }
                  />
                  <Input
                    {...args}
                    size={size}
                    id={`${uniqueId}-adorned-end-${idx}`}
                    defaultValue={t('input.value')}
                    placeholder={t('input.placeholder.default')}
                    className='adorned-end'
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color={args.color}
                        shape={args.shape}
                        size={size}
                        ariaLabel='검색 버튼'
                        icon={
                          <Icon
                            className='icon'
                            name='search'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                          />
                        }
                      />
                    }
                  />
                </SpecimenCell>
              </SpecimenRow>
            )}
          </React.Fragment>
        ))}
      </SpecimenGroup>
    );
  },
};
