import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse, delay } from 'msw'; // ✅ msw에서 필수 기능 임포트
import { UserCard } from './UserCard';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'Test/MSW-Check',
  component: UserCard,
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 데이터 조회 성공 케이스
export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://api.example.com/user', () => {
          return HttpResponse.json({
            name: '홍길동 (MSW 작동중!)',
            email: 'msw-test@example.com',
          });
        }),
      ],
    },
  },
  // ✅ play 함수를 추가하면 Test Runner가 이것까지 자동으로 실행합니다.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ❌ 기존 코드: 바로 없으면 실패
    // await expect(canvas.getByText(/홍길동/)).toBeInTheDocument();

    // ✅ 수정 코드: 'findBy'를 사용하여 나타날 때까지 기다림 (기본 1000ms)
    const userName = await canvas.findByText(/홍길동/);
    await expect(userName).toBeInTheDocument();
  },
};

// 2. 서버 에러(500) 케이스
export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://api.example.com/user', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

// 3. 로딩 상태 확인 케이스 (2초 지연)
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://api.example.com/user', async () => {
          await delay(2000); // ✅ 인위적인 지연 발생
          return HttpResponse.json({ name: '느린 사용자', email: 'slow@test.com' });
        }),
      ],
    },
  },
};
