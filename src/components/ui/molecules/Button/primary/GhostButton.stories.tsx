import Button from '@/components/ui/molecules/Button/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';
import Icon from '../../../atoms/Icon/Icon';
import RingSpinner from '../../../atoms/Spinner/LoadingSpinner/RingSpinner';

const meta = {
  title: 'UI/Molecules/Button/Primary/Ghost',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GhostBase: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <div style={{ display: 'inline-flex', gap: '20px' }}>
        <Button variant='ghost' color='primary' shape={args.shape} size={args.size}>
          {t('hello')}
        </Button>
        <Button variant='ghost' color='primary' shape={args.shape} size={args.size} disabled>
          {t('hello')}
        </Button>
      </div>
    );
  },
};

export const GhostSizes: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
        <Button variant='ghost' color='primary' shape={args.shape} size='xl'>
          {t('hello')}
        </Button>
        <Button variant='ghost' color='primary' shape={args.shape} size='lg'>
          {t('hello')}
        </Button>
        <Button variant='ghost' color='primary' shape={args.shape} size='md'>
          {t('hello')}
        </Button>
        <Button variant='ghost' color='primary' shape={args.shape} size='sm'>
          {t('hello')}
        </Button>
        <Button variant='ghost' color='primary' shape={args.shape} size='xs'>
          {t('hello')}
        </Button>
      </div>
    );
  },
};

export const GhostLeftIcon: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <div style={{ display: 'inline-flex', gap: '20px' }}>
        <Button
          variant='ghost'
          color='primary'
          shape={args.shape}
          size={args.size}
          startIcon={
            <Icon
              name='chevron-left'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          }
        >
          {t('hello')}
        </Button>
        <Button
          variant='ghost'
          color='primary'
          shape={args.shape}
          size={args.size}
          startIcon={
            <Icon
              name='chevron-left'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          }
          disabled
        >
          {t('hello')}
        </Button>
      </div>
    );
  },
};

export const GhostRightIcon: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <div style={{ display: 'inline-flex', gap: '20px' }}>
        <Button
          variant='ghost'
          color='primary'
          shape={args.shape}
          size={args.size}
          endIcon={
            <Icon
              name='chevron-right'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          }
        >
          {t('hello')}
        </Button>
        <Button
          variant='ghost'
          color='primary'
          shape={args.shape}
          size={args.size}
          endIcon={
            <Icon
              name='chevron-right'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          }
          disabled
        >
          {t('hello')}
        </Button>
      </div>
    );
  },
};

export const GhostLeftSpinner: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <Button
        variant='ghost'
        color='primary'
        shape={args.shape}
        size={args.size}
        startIcon={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
      >
        {t('hello')}
      </Button>
    );
  },
};

export const GhostRightSpinner: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <Button
        variant='ghost'
        color='primary'
        shape={args.shape}
        size={args.size}
        endIcon={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
      >
        {t('hello')}
      </Button>
    );
  },
};
