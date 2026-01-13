import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageSelector from './LanguageSelector';
import { GuideCell } from '../../guide/Guide';
import { languageSelectorOptions, type LanguageCode } from './LanguageSelector.mock';
import { useState } from 'react';
import { SpecimenCell, SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

const meta: Meta<typeof LanguageSelector> = {
  title: 'UI/Molecules/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**LanguageSelector**는 서비스의 언어 설정을 직관적으로 변경할 수 있는 드롭다운 형태의 컴포넌트입니다. <br /><br />' +
          '• **Visual Identity**: 현재 선택된 언어의 국기 아이콘 또는 언어 명칭을 버튼 내부에 표시하여 가독성을 높였습니다. <br />' +
          '• **State Sync**: 외부 상태(`value`)와 결합하여 페이지 전체의 다국어 컨텍스트를 실시간으로 제어할 수 있습니다. <br />' +
          '• **Dropdown UX**: 버튼의 너비와 드롭다운 리스트의 너비를 동기화하고, 포털(Portal) 기술을 사용하여 레이아웃 간섭 없이 상위에 노출됩니다.',
      },
    },
  },

  argTypes: {
    variant: {
      description: '버튼의 시각적 스타일 변주',
      control: 'inline-radio',
      options: ['solid', 'outline'],
      table: { category: 'Style' },
    },
    color: {
      description: '버튼의 브랜드 컬러 적용',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      table: { category: 'Style' },
    },
    size: {
      description: '컴포넌트의 전체적인 크기',
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { category: 'Style' },
    },

    // 2. 핵심 데이터 Props
    value: {
      description: '현재 선택된 언어 코드 (언어 변경의 상태값)',
      control: 'select',
      options: ['ko', 'en', 'ja', 'zh'],
      table: { category: 'Data' },
    },
    options: {
      description: '드롭다운에 표시될 언어 리스트 데이터',
      control: 'object',
      table: { category: 'Data' },
    },
    onValueChange: {
      description: '언어 선택 시 호출되는 콜백 함수',
      action: 'valueChanged', // Storybook Actions 탭에 로그 기록
      table: { category: 'Events' },
    },

    // 3. 내부 구성 요소 Props
    buttonProps: {
      description: '내부 Button 컴포넌트에 전달될 상세 속성',
      control: 'object',
      table: { category: 'Component' },
    },
    id: {
      description: '컴포넌트 고유 식별자',
      control: 'text',
      table: { category: 'Attribute' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    options: languageSelectorOptions,
    value: 'ko',
    buttonProps: {
      shape: 'rounded',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

/**
 * 가장 기본적인 형태의 언어 선택기입니다.
 * - **Interaction**: 버튼 클릭 시 나타나는 언어 리스트와, 선택 시 `onValueChange`를 통한 상태 업데이트 흐름을 확인합니다.
 */
export const Base: Story = {
  render: args => {
    const [currentLang, setCurrentLang] = useState(args.value);

    const handleValueChange = (newLang: string) => {
      setCurrentLang(newLang as LanguageCode);
      console.log(`언어 변경됨: ${newLang}`);
    };

    return (
      <GuideCell caption={`현재 선택된 언어 코드: ${currentLang}`}>
        <LanguageSelector {...args} value={currentLang} onValueChange={handleValueChange} />
      </GuideCell>
    );
  },
};

/**
 * 브랜드 컬러 시스템(Primary, Secondary, Tertiary)별 테마를 검증합니다.
 * - **Contrast Check**: 다크모드 환경에서도 각 테마의 텍스트와 아이콘 프레임이 웹 접근성 가이드(AA등급 이상)를 만족하는지 확인합니다.
 * - **Selected State**: 드롭다운 내부에서 선택된 아이템의 강조 색상이 버튼의 메인 테마 색상과 조화를 이루는지 점검합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

    const [currentLang, setCurrentLang] = useState(args.value);

    const handleValueChange = (newLang: string) => {
      setCurrentLang(newLang as LanguageCode);
      console.log(`언어 변경됨: ${newLang}`);
    };

    return (
      <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        {colorOptions.map(color => (
          <SpecimenGroup key={color} title={color}>
            <SpecimenCell>
              <LanguageSelector
                {...args}
                color={color}
                value={currentLang}
                onValueChange={handleValueChange}
              />
            </SpecimenCell>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * XL부터 XS까지 다양한 크기 환경에서의 레이아웃을 검증합니다.
 * - **Proportional Scaling**: 사이즈 변화에 따라 버튼의 내부 패딩, 폰트 크기, 국기 아이콘의 비율이 적절히 조절되는지 확인합니다.
 * - **Width Sync**: 버튼의 크기가 변하더라도 드롭다운 팝오버가 버튼의 하단 너비에 정확히 맞춰 렌더링되는지 체크합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    const [currentLang, setCurrentLang] = useState(args.value);

    const handleValueChange = (newLang: string) => {
      setCurrentLang(newLang as LanguageCode);
      console.log(`언어 변경됨: ${newLang}`);
    };

    return (
      <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        {sizeOptions.map(size => (
          <SpecimenGroup key={size} title={size.toUpperCase()}>
            <SpecimenCell>
              <LanguageSelector
                {...args}
                size={size}
                value={currentLang}
                onValueChange={handleValueChange}
              />
            </SpecimenCell>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};
