import type { Meta, StoryObj } from '@storybook/react-vite';
import TokenTable from './TokenTable';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as TechTokens } from '../../../constants/generated/tech-tokens';

const meta: Meta<typeof TokenTable> = {
  title: 'Tokens/Themes/Tech',
  component: TokenTable,
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

type Story = StoryObj<typeof TokenTable>;

export const TechThemeTokens: Story = {
  render: () => <TokenTable title='Tech Theme' category='System' tokens={TechTokens} />,
};
