import React, { useState } from "react";
import styled from "@emotion/styled";

interface LoginProps {
  onLogin: (username: string) => void; // 로그인 처리 함수
}

export function Login({ onLogin }: LoginProps) {
  // 사용자 이름 입력값 상태 관리
  const [username, setUsername] = useState("");

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username); // 유효한 이름이 입력된 경우 로그인 처리
    }
  };

  return (
    <Container>
      <Title>채팅 로그인</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="닉네임을 입력하세요" />
        <Button type="submit">입장하기</Button>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;
