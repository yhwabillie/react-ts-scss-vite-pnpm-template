import type { Meta, StoryObj } from '@storybook/react-vite';
import SingleItemCarousel from './SingleItemCarousel';

const meta: Meta<typeof SingleItemCarousel> = {
  title: 'UI/Organisms/Carousel/SingleItemCarousel',
  component: SingleItemCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SingleItemCarousel>;

export const Base: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <SingleItemCarousel />
    </div>
  ),
};
