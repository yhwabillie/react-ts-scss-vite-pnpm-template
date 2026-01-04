import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onPageChange: { action: 'paged' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

/**
 * 💡 기본 페이지네이션 (Interactive)
 * 실제 상태 변경을 확인하기 위해 useState를 활용한 렌더러를 사용합니다.
 */
export const Default: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={page => {
          setCurrentPage(page);
          args.onPageChange(page);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

/**
 * 📱 모바일 UI
 * 번호 목록 대신 '현재 / 전체' 텍스트만 노출하는 간결 모드입니다.
 */
export const Mobile: Story = {
  args: {
    ...Default.args,
    isMobileUI: true,
  },
};

/**
 * 🔢 많은 페이지 (Ellipsis 테스트용)
 * 페이지가 많을 때 siblingCount에 따라 어떻게 번호가 렌더링되는지 확인합니다.
 */
export const ManyPages: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(5);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
  args: {
    currentPage: 5,
    totalPages: 100,
    siblingCount: 2, // 현재 페이지 주변에 2개씩 노출
  },
};

/**
 * 🛑 버튼 비활성화 상태
 * 첫 페이지 혹은 마지막 페이지일 때의 내비게이션 버튼 상태를 확인합니다.
 */
export const FirstAndLast: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>[첫 페이지 상태]</p>
        <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      </div>
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          [마지막 페이지 상태]
        </p>
        <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
      </div>
    </div>
  ),
};
