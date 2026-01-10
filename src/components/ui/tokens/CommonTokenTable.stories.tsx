import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as SystemTokens } from '../../../constants/generated/tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Common/Colors',
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

export const SurfaceTokens: Story = {
  render: () => (
    <ColorTokenTable
      title='Surface(표면) & Elevation(위계)'
      category='System'
      tokens={SystemTokens}
    />
  ),
};
