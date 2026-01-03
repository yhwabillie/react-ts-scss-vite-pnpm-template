import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageSelector from './LanguageSelector';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import {
  languageSelectorOptions,
  type LanguageCode,
  type LanguageSelectItem,
} from './LanguageSelector.mock';
import { useState } from 'react';
import { SpecimenCell, SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

const meta: Meta<typeof LanguageSelector> = {
  title: 'UI/Molecules/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],

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
 * 💡 테스트 포인트:
 * - **컬러 시스템 검증**: Primary, Secondary, Tertiary 각 컬러별로 버튼의 배경, 텍스트, 아이콘 프레임(`IconFrame`)이 디자인 가이드에 맞게 적용되는지 확인합니다.
 * - **명도 대비(Contrast)**: 특히 다크모드(#121212)와 라이트 모드 환경에서 각 컬러별 텍스트 명도 대비가 최소 4.5:1(AA 등급)을 만족하여 언어 식별에 문제가 없는지 확인합니다.
 * - **선택 상태(Selected)**: 드롭다운 리스트 내에서 `is-selected` 상태의 배경색이 각 브랜드 컬러(`color`) 테마와 조화롭게 어우러지면서도 시각적으로 명확히 구분되는지 확인합니다.
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
 * 💡 테스트 포인트:
 * - XL부터 XS까지 각 사이즈별로 버튼의 패딩, 폰트 크기, 아이콘 프레임이 가이드에 맞게 조절되는지 확인합니다.
 * - **상태 제어(Controlled)**: 특정 사이즈에서 언어를 변경하면 모든 사이즈의 `LanguageSelector`가 동일한 언어로 동기화되는지 확인합니다. (데이터 흐름 검증)
 * - **포털 너비 동기화**: 사이즈별로 버튼의 너비가 다를 때, 드롭다운 리스트의 너비가 해당 버튼 너비에 맞춰 유동적으로 변하는지 확인합니다.
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
