import type { Meta, StoryObj } from '@storybook/react-vite';
import GridCarousel from './GridCarousel';

const meta: Meta<typeof GridCarousel> = {
  title: 'UI/Organisms/Carousel/GridCarousel',
  component: GridCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof GridCarousel>;

export const Base: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <GridCarousel />
    </div>
  ),
};
