import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';
import FormField from '../../molecules/FormField/FormField';
import Radio from '../Radio/Radio';
import Checkbox from '../Checkbox/Checkbox';
import Switch from '../../molecules/Switch/Switch';
import AnatomyWrapper from '@/components/ui/guide/AnatomyWrapper';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Label 컴포넌트는 입력 요소(Switch, Checkbox 등)의 설명을 텍스트로 제공합니다. <br />' +
          '5가지 표준 사이즈를 제공하여 다양한 UI 컨텍스트에 유연하게 대응합니다.',
      },
    },
  },
  argTypes: {
    // Styles
    size: {
      control: 'inline-radio',
      description: '라벨의 크기를 결정합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Etc
    children: {
      control: 'text',
      description: '라벨에 표시될 텍스트 또는 컴포넌트 콘텐츠입니다.',
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      description: '외부 커스텀 스타일을 위한 클래스명입니다.',
      table: { category: 'Etc' },
    },
  },
  args: {
    size: 'xl',
    children: '기본 라벨 텍스트',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본 사용 예시
 * 라벨 컴포넌트의 기본적인 렌더링 형태를 확인합니다.
 * 주로 입력 폼 요소의 제목이나 설명 텍스트로 활용됩니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();
    return <Label {...args}>{t('label.base')}</Label>;
  },
};

/**
 * 크기 변주
 * XL부터 XS까지 다섯 가지 사이즈 구성을 통해 디자인 시스템의 타이포그래피 스케일을 확인합니다.
 * 각 사이즈는 대응하는 입력 요소(Input, Radio, Checkbox 등)의 크기와 조화를 이루도록 설계되었습니다.
 */
export const Sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sizes.map(size => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Label {...args} size={size}>
              {size.toUpperCase()} - {t('label.sizes')}
            </Label>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 실무 적용 사례
 * Radio, Checkbox, Switch 등 다양한 폼 제어 요소와 결합하여 사용되는 사례입니다.
 * htmlFor 속성을 통해 입력 요소와 연결함으로써 접근성을 확보하고 클릭 영역을 확장합니다.
 */
export const Usage: Story = {
  render: args => {
    const { t } = useTranslation();

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <FormField as='label' htmlFor='radio-id' size={args.size}>
          <Radio
            as='span'
            id='radio-id'
            defaultChecked
            name='radio-name'
            color='primary'
            size={args.size}
          />
          <AnatomyWrapper minimal={true}>
            <Label size={args.size}>{t('label.usage.radio')}</Label>
          </AnatomyWrapper>
        </FormField>

        <FormField as='label' htmlFor='checkbox-id' size={args.size}>
          <Checkbox
            as='span'
            id='checkbox-id'
            defaultChecked
            name='checkbox-name'
            color='primary'
            size={args.size}
          />
          <AnatomyWrapper minimal={true}>
            <Label size={args.size}>{t('label.usage.checkbox')}</Label>
          </AnatomyWrapper>
        </FormField>
        <Switch
          color='primary'
          id='switch-id'
          name='switch-name'
          size={args.size}
          defaultChecked
          children={
            <AnatomyWrapper minimal={true}>
              <Label size={args.size}>{t('label.usage.switch')}</Label>
            </AnatomyWrapper>
          }
        />
      </div>
    );
  },
};
