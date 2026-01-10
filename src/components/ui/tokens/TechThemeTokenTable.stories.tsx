import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as TechTokens } from '../../../constants/generated/tech-tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Themes/Tech',
  component: ColorTokenTable,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ColorTokenTable>;

export const TechThemeTokens: Story = {
  render: () => <ColorTokenTable title='Tech Theme' category='System' tokens={TechTokens} />,
};
