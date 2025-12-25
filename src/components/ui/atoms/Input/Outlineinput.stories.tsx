import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';
import Icon from '../Icon/Icon'; // 아이콘 컴포넌트 가정
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import React, { useId } from 'react';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import IconButton from '../../molecules/IconButton/IconButton';

const meta = {
  title: 'UI/Molecules/Input/Outline',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
    placeholder: '정보를 입력해 주세요',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 가장 기본이 되는 형태입니다.
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

    return (
      <AnatomyWrapper title='부모 요소 : 800px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '800px' }}>
            <Input {...args} id={uniqueId} />
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
    );
  },
};

/**
 * 디자인 시스템의 시멘틱 컬러(Primary, Danger 등)가 적용된 상태를 비교합니다.
 * 빈 값(Empty)과 입력 완료(Filled) 상태에서 아이콘 버튼과의 색상 조화를 검수합니다.
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

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <SpecimenCell caption='Empty'>
                  <Input {...args} id={`${uniqueId}-${color}-emtpy`} />
                  <Input
                    {...args}
                    id={`${uniqueId}-${color}-emtpy-adorned-start`}
                    className='adorned-start'
                    adornedStart={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
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
                  <Input
                    {...args}
                    id={`${uniqueId}-${color}-emtpy-adorned-end`}
                    className='adorned-end'
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
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
                <SpecimenCell caption='Filled'>
                  <Input
                    {...args}
                    id={`${uniqueId}-${color}-filled`}
                    defaultValue='내용이 입력된 상태입니다.'
                  />
                  <Input
                    {...args}
                    id={`${uniqueId}-${color}-filled-adorned-start`}
                    defaultValue='내용이 입력된 상태입니다.'
                    className='adorned-start'
                    adornedStart={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
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
                  <Input
                    {...args}
                    id={`${uniqueId}-${color}-filled-adorned-end`}
                    defaultValue='내용이 입력된 상태입니다.'
                    className='adorned-end'
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
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
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * SCSS Map에 정의된 5가지 높이(32px ~ 48px) 규격을 확인합니다.
 * Adornment(아이콘)가 포함되어도 고정된 높이가 유지되는지, 텍스트 정렬이 올바른지 검증합니다.
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
                    <Input {...args} id={`${uniqueId}-${size}`} size={size} />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      id={`${uniqueId}-${size}-adorned-start`}
                      size={size}
                      className='adorned-start'
                      adornedStart={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
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
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      id={`${uniqueId}-${size}-adorned-end`}
                      size={size}
                      className='adorned-end'
                      adornedEnd={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
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
                  </GuideCell>
                </AnatomyWrapper>
              ) : (
                <GuideRow direction='column'>
                  <GuideCell caption={captionText}>
                    <Input {...args} size={size} id={`${uniqueId}-${size}`} />
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-${size}-adorned-start`}
                      className='adorned-start'
                      adornedStart={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
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
                  </GuideCell>
                  <GuideCell>
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-${size}-adorned-end`}
                      className='adorned-end'
                      adornedEnd={
                        <IconButton
                          variant='ghost'
                          color='primary'
                          shape='rounded'
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
 * Input의 생애주기 상태(Normal, Hover, Focus, Disabled 등)를 대조합니다.
 * 특히 'Focus (Typing)' 상태에서 커서와 배경색 변화 등 타이핑 중 인터랙션을 중점적으로 확인합니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      // 타이핑 중(Focus + Value) 상태를 명확히 확인할 수 있는 지점
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
                  <Input {...args} {...state.props} id={`${uniqueId}-empty`} />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-empty-adorned-start`}
                    className='adorned-start'
                    adornedStart={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
                        ariaLabel='검색 버튼'
                        disabled={state.props.disabled || state.props.readOnly}
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
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-empty-adorned-end`}
                    className='adorned-end'
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
                        ariaLabel='검색 버튼'
                        disabled={state.props.disabled || state.props.readOnly}
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
                <SpecimenCell caption='Filled'>
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled`}
                    defaultValue='내용이 입력된 상태입니다.'
                  />
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled-adorned-start`}
                    defaultValue='내용이 입력된 상태입니다.'
                    className='adorned-start'
                    adornedStart={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
                        ariaLabel='검색 버튼'
                        disabled={state.props.disabled || state.props.readOnly}
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
                  <Input
                    {...args}
                    {...state.props}
                    id={`${uniqueId}-filled-adorned-end`}
                    defaultValue='내용이 입력된 상태입니다.'
                    className='adorned-end'
                    adornedEnd={
                      <IconButton
                        variant='ghost'
                        color='primary'
                        shape='rounded'
                        size={args.size}
                        ariaLabel='검색 버튼'
                        disabled={state.props.disabled || state.props.readOnly}
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
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 모서리 곡률(Square, Rounded, Pill) 설정에 따른 디자인 변화를 확인합니다.
 * Input의 Shape에 맞춰 내부 IconButton의 Shape도 함께 연동되어 일관성을 유지합니다.
 */
export const Shapes: Story = {
  render: args => {
    const baseId = useId(); // React 18 useId 활용
    const shapeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];

    // 1. 공통 아이콘 버튼 렌더러 (Shape 동기화)
    const renderIconButton = (shape: 'square' | 'rounded' | 'pill') => (
      <IconButton
        variant='ghost'
        color='primary'
        shape={shape} // 부모의 shape를 따름
        size={args.size}
        ariaLabel='검색 버튼'
        icon={<Icon className='icon' name='search' strokeWidth={2.5} />}
      />
    );

    return (
      <GuideGroup direction='column'>
        {shapeOptions.map(shape => (
          <GuideRow key={shape} direction='column'>
            {/* 상단 캡션용 Cell */}
            <GuideCell caption={shape.toUpperCase()}>
              {/* 케이스 1: 기본 형태 (Empty) */}
              <Input {...args} shape={shape} id={`${baseId}-${shape}-empty`} />

              {/* 케이스 2: Adorned Start (Filled) */}
              <Input
                {...args}
                shape={shape}
                id={`${baseId}-${shape}-start`}
                className='adorned-start'
                adornedStart={renderIconButton(shape)}
              />

              {/* 케이스 3: Adorned End (Filled) */}
              <Input
                {...args}
                shape={shape}
                id={`${baseId}-${shape}-end`}
                className='adorned-end'
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
 * 내부 슬롯(adornedStart, adornedEnd)에 IconButton이 배치된 결합 형태입니다.
 * 요소 간의 간격(Gap)과 클릭 영역이 충분히 확보되었는지 레이아웃을 검수합니다.
 */
export const Composition: Story = {
  render: args => {
    const uniqueId = useId();

    return (
      <GuideGroup>
        <GuideRow direction='column'>
          <GuideCell caption='Left Icon'>
            <Input
              {...args}
              id={`${uniqueId}-left`}
              className='adorned-start'
              adornedStart={
                <IconButton
                  variant='ghost'
                  color='primary'
                  size={args.size}
                  ariaLabel='검색 버튼'
                  icon={<Icon className='icon' name='search' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
          <GuideCell caption='Right Icon'>
            <Input
              {...args}
              id={`${uniqueId}-right`}
              className='adorned-end'
              adornedEnd={
                <IconButton
                  variant='ghost'
                  color='primary'
                  size={args.size}
                  ariaLabel='검색 버튼'
                  icon={<Icon className='icon' name='search' strokeWidth={2.5} />}
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
 * 입력창 너비보다 긴 텍스트가 입력되었을 때의 '말줄임(Ellipsis)' 처리 로직을 확인합니다.
 * 좌우 아이콘이 있는 상태에서도 텍스트가 영역을 침범하지 않고 안전하게 생략되는지 확인합니다.
 */
export const LongText: Story = {
  render: args => {
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
                      defaultValue='말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시'
                      placeholder='비어있는 상태'
                    />
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-adorned-start-${idx}`}
                      defaultValue='말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시'
                      className='adorned-start'
                      adornedStart={
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
                    <Input
                      {...args}
                      size={size}
                      id={`${uniqueId}-adorned-end-${idx}`}
                      defaultValue='말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시'
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
                    defaultValue='말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시 말줄임 말줄임 표시 말줄임 표시'
                    placeholder='비어있는 상태'
                  />
                  <Input
                    {...args}
                    size={size}
                    id={`${uniqueId}-adorned-start-${idx}`}
                    defaultValue='내용이 입력된 상태입니다.'
                    className='adorned-start'
                    adornedStart={
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
                  <Input
                    {...args}
                    size={size}
                    id={`${uniqueId}-adorned-end-${idx}`}
                    defaultValue='내용이 입력된 상태입니다.'
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
