import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenRow } from '../../guide/Specimen';
import { GuideCell } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Molecules/Button/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ButtonGroup은 서로 연관된 동작을 수행하는 버튼들을 하나의 논리적 단위로 묶어주는 컨테이너입니다. <br />' +
          '단순한 시각적 정렬뿐만 아니라 스크린 리더 등 보조 공학 기기 사용자에게 버튼들 간의 관계를 명확히 전달합니다.',
      },
    },
  },

  argTypes: {
    // Identification
    role: {
      control: 'inline-radio',
      options: ['group', 'toolbar'],
      table: { category: 'Identification' },
    },
    ariaLabel: {
      control: 'text',
      table: { category: 'Identification' },
    },

    // Styles
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      table: { category: 'Styles' },
    },

    // ETC
    children: {
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
    align: 'center',
    role: 'group',
    ariaLabel: '편집 작업',
    children: undefined,
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

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

    return (
      <ButtonGroup {...args}>
        <Button variant='outline' size={args.size}>
          {t('button-group.edit')}
        </Button>
        <Button variant='solid' size={args.size}>
          {t('button-group.save')}
        </Button>
      </ButtonGroup>
    );
  },
};

export const AlignLeft: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼 그룹을 부모 컨테이너 내에서 왼쪽, 중앙, 오른쪽으로 정렬합니다. 페이지의 레이아웃 맥락(예: 모달 하단, 폼 하단 등)에 따라 적절한 정렬 방식을 선택합니다.',
      },
    },
  },
  args: {
    align: 'left',
  },
  render: args => {
    const { t } = useTranslation();

    return (
      <AnatomyWrapper title='부모 요소 width: 500px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '500px' }}>
            <ButtonGroup {...args}>
              <Button variant='outline' size={args.size}>
                {t('button-group.edit')}
              </Button>
              <Button variant='solid' size={args.size}>
                {t('button-group.save')}
              </Button>
            </ButtonGroup>
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
    );
  },
};

export const AlignCenter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '중앙 정렬은 주로 모달 창의 하단 액션이나 랜딩 페이지의 핵심 섹션에서 시선을 집중시킬 때 사용합니다.',
      },
    },
  },
  args: {
    align: 'center',
  },
  render: args => {
    const { t } = useTranslation();

    return (
      <AnatomyWrapper title='부모 요소 width: 500px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '500px' }}>
            <ButtonGroup {...args}>
              <Button variant='outline' size={args.size}>
                {t('button-group.edit')}
              </Button>
              <Button variant='solid' size={args.size}>
                {t('button-group.save')}
              </Button>
            </ButtonGroup>
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
    );
  },
};

export const AlignRight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '오른쪽 정렬은 일반적인 웹 양식(Form)이나 데이터 상세 페이지 하단에서 다음 단계로 나아가는 주 액션 흐름을 배치할 때 권장됩니다.',
      },
    },
  },
  args: {
    align: 'right',
  },
  render: args => {
    const { t } = useTranslation();

    return (
      <AnatomyWrapper title='부모 요소 width: 500px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '500px' }}>
            <ButtonGroup {...args}>
              <Button variant='outline' size={args.size}>
                {t('button-group.edit')}
              </Button>
              <Button variant='solid' size={args.size}>
                {t('button-group.save')}
              </Button>
            </ButtonGroup>
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '시스템에서 정의한 5가지 표준 사이즈를 통해 내부 버튼들의 크기를 일괄적으로 제어합니다. <br> 버튼 그룹의 크기는 포함된 버튼들의 높이와 간격에 영향을 줍니다.',
      },
    },
  },
  args: {
    align: 'right',
  },
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];
    const { t } = useTranslation();

    return (
      <div
        style={{ display: 'inline-flex', gap: '15px', alignItems: 'end', flexDirection: 'column' }}
      >
        {sizeOptions.map(size => (
          <GuideCell caption={size} style={{ alignItems: 'flex-start' }}>
            <AnatomyWrapper title='부모 요소 width: 500px'>
              <SpecimenRow>
                <SpecimenCell style={{ width: '500px' }}>
                  <ButtonGroup {...args} size={size}>
                    <Button variant='outline' size={size}>
                      {t('button-group.edit')}
                    </Button>
                    <Button variant='solid' size={size}>
                      {t('button-group.save')}
                    </Button>
                  </ButtonGroup>
                </SpecimenCell>
              </SpecimenRow>
            </AnatomyWrapper>
          </GuideCell>
        ))}
      </div>
    );
  },
};
