import React, { useEffect, useState } from 'react';

interface UserData {
  name: string;
  email: string;
}

export const UserCard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.example.com/user')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setError(true));
  }, []);

  if (error) return <div>데이터를 불러오지 못했습니다.</div>;
  if (!user) return <div>로딩 중...</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h2>사용자 정보</h2>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
    </div>
  );
};
