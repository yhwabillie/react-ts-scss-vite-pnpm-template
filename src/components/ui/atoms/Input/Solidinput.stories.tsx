import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';
import Icon from '../Icon/Icon'; // 아이콘 컴포넌트 가정
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import React, { useId } from 'react';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';
import IconButton from '../../molecules/IconButton/IconButton';
import clsx from 'clsx';
import IconFrame from '../../molecules/IconFrame/IconFrame';
import { useTranslation } from 'react-i18next';
import Card from '../../molecules/Card/Card';

const meta = {
  title: 'UI/Molecules/Input/Solid',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Solid Input**은 배경색이 채워진 형태의 입력 필드로, 폼(Form) 요소에서 가장 직관적인 시각적 영역을 제공합니다. <br /><br />' +
          '• 시작(Start)과 끝(End) 슬롯을 통해 아이콘, 단위, 액션 버튼 등을 자유롭게 배치 <br />' +
          '• 사이즈 및 곡률(Shape) 옵션이 내부 아이콘 및 버튼과 유기적으로 연동 <br />' +
          '• 긴 텍스트 입력 시 아이콘 영역을 침범하지 않도록 설계된 말줄임 로직 내장',
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
    variant: 'solid',
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
 * 별도의 옵션 없이 텍스트 입력을 위한 최소한의 명세를 정의합니다.
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
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <Card>
        <Input {...args} id={uniqueId} placeholder={t('input.placeholder.default')} />
      </Card>
    );
  },
};

/**
 * 디자인 시스템의 시멘틱 컬러를 적용하여 상태별 의미를 전달합니다.
 * 값이 비어있는 상태(Empty)와 입력된 상태(Filled)에서 아이콘 및 버튼과의 조화를 확인합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();
          const { t } = useTranslation();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                </Card>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                </Card>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 5단계 표준 높이 규격(32px ~ 48px)과 너비 대응 로직을 확인합니다.
 * 고정 너비와 유동 너비(XL - 100%) 환경에서 내부 요소들이 올바르게 정렬되는지 검증합니다.
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
                    <Card>
                      <Input
                        {...args}
                        size={size}
                        id={`${uniqueId}-${size}`}
                        placeholder={t('input.placeholder.default')}
                      />
                    </Card>
                  </GuideCell>
                  <Card>
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
                  </Card>
                  <Card>
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
                  </Card>
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
 * 입력창의 생애주기에 따른 시각적 피드백을 확인합니다.
 * 특히 'Focus' 상태에서의 테두리 강조와 'Read Only', 'Disabled' 상태의 접근성을 중점적으로 대조합니다.
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
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                </Card>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                </Card>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 모서리 곡률 설정에 따른 디자인 변화를 확인합니다.
 * Input의 곡률에 맞춰 내부 IconButton의 형태도 자동으로 동기화되어 일관성을 유지합니다.
 */
export const Shapes: Story = {
  render: args => {
    const { t } = useTranslation();
    const baseId = useId();
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
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              </Card>
            </GuideCell>
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

/**
 * 내부 슬롯(adornedStart, adornedEnd)에 아이콘 프레임이나 버튼이 결합된 형태입니다.
 * 요소 간의 여백(Gap)과 실제 사용자가 상호작용하기에 충분한 영역이 확보되었는지 검수합니다.
 */
export const Composition: Story = {
  render: args => {
    const { t } = useTranslation();
    const uniqueId = useId();

    return (
      <GuideGroup>
        <GuideRow direction='column'>
          <GuideCell caption='Left Icon'>
            <Card>
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
            </Card>
          </GuideCell>
          <GuideCell caption='Right Icon'>
            <Card>
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
            </Card>
          </GuideCell>
        </GuideRow>
      </GuideGroup>
    );
  },
};

/**
 * 입력창 너비보다 긴 텍스트가 입력되었을 때의 처리 로직입니다.
 * 좌우 슬롯에 요소가 배치된 상황에서도 텍스트가 겹치지 않고 안전하게 생략(Ellipsis)되는지 확인합니다.
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
                      placeholder={t('input.placeholder.default')}
                      defaultValue={t('long-text')}
                    />
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-adorned-start-${idx}`}
                      placeholder={t('input.placeholder.default')}
                      defaultValue={t('long-text')}
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
                      placeholder={t('input.placeholder.default')}
                      defaultValue={t('long-text')}
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
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    defaultValue={t('input.value')}
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
                </Card>
              </SpecimenRow>
            )}
          </React.Fragment>
        ))}
      </SpecimenGroup>
    );
  },
};
