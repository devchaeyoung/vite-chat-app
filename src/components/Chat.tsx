import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styled from "@emotion/styled";

interface Message {
  author: string;
  body: string;
  room: string;
}

interface ChatProps {
  username: string;
  onLogout: () => void;
}

const socket = io("http://localhost:3000", { autoConnect: false });

export function Chat({ username, onLogout }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");

  useEffect(() => {
    // 앱 마운트전에 socket을 연결합니다.
    socket.connect();

    // socket 연결 상태를 확인한다.
    socket.on("connect", () => {
      console.log("socket connect!!");
    });

    // 채팅방 생성 시 넘어오는 socket 정보입니다.
    socket.on("joinedRoom", (room: string) => {
      setCurrentRoom(room);
      setMessages([]);
      console.log("채팅방 입장: " + room);
    });

    socket.on("chat", (payload: Message) => {
      console.log(payload);
      // 함수형 업데이트
      setMessages(prev => [...prev, payload]);
    });
    // 마지막 클린업 함수 작성.

    return () => {
      socket.off("connect");
      socket.off("chat");
      socket.off("joinedRoom");
      socket.disconnect();
    };
  }, []);

  // 아래 코드처럼 하면 안되는 이유
  // messages 배열이 바뀔 때마다 socket이벤트 리스너가 계속 추가됨
  //   useEffect(() => {
  //     socket.on("chat", (payload: Message) => {
  //       console.log(payload);
  //       // 함수형 업데이트
  //       setMessages(messages.concat(payload));
  //     });
  //   }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    const message: Message = { author: username, body: input, room: currentRoom };
    socket.emit("chat", message);
    setInput("");
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom", room);
    socket.emit("joinRoom", room);
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", room);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <span>{currentRoom ? `${currentRoom} 채팅방` : "채팅"}</span>
        <HeaderRight>
          <Username>{username}</Username>
          <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
        </HeaderRight>
      </ChatHeader>

      <MessageList>
        {messages.map((msg, i) => (
          <MessageItem key={i} isOutgoing={username === msg.author}>
            <MessageWrapper>
              <MessageAuthor>{msg.author}</MessageAuthor>
              <MessageBubble>
                <MessageBody>{msg.body}</MessageBody>
              </MessageBubble>
            </MessageWrapper>
          </MessageItem>
        ))}
      </MessageList>

      <RoomControls>
        <RoomInput type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="방 이름 입력..." />
        <RoomButton onClick={handleCreateRoom}>방 만들기</RoomButton>
        <RoomButton onClick={handleJoinRoom}>방 참여하기</RoomButton>
      </RoomControls>

      <ChatComposer>
        <ComposerInput
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
          placeholder="메시지를 입력하세요..."
          disabled={!currentRoom}
        />
      </ChatComposer>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Username = styled.span`
  font-weight: bold;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageItem = styled.div<{ isOutgoing: boolean }>`
  display: flex;
  justify-content: ${props => (props.isOutgoing ? "flex-end" : "flex-start")};
  margin-bottom: 1rem;
`;

const MessageWrapper = styled.div`
  max-width: 70%;
`;

const MessageAuthor = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
`;

const MessageBubble = styled.div`
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: inline-block;
`;

const MessageBody = styled.span`
  word-break: break-word;
`;

const RoomControls = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

const RoomInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const RoomButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatComposer = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

const ComposerInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;
