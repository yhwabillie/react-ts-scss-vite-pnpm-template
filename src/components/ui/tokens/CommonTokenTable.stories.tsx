import type { Meta, StoryObj } from '@storybook/react-vite';
import TokenTable from './TokenTable';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as SystemTokens } from '../../../constants/generated/tokens';

const meta: Meta<typeof TokenTable> = {
  title: 'Tokens/Common',
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

export const SurfaceTokens: Story = {
  render: () => (
    <TokenTable title='Surface(표면) & Elevation(위계)' category='System' tokens={SystemTokens} />
  ),
};
