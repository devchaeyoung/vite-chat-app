# Vite React ChatApp

## 프로젝트 실행 방법

```bash
yarn
yarn start
```

## server api

server github url : https://github.com/ckdwns9121/chat-app-test

```javascript
const socket = io("http://localhost:3000", { autoConnect: false });
```

- Message Dto

```javascript
{
  author: string;
  body: string;
  room: string;
}
```

- 채팅방 생성 : "createRoom"
- 채팅방 참여 : "joinRoom"
- 메시지 : "chat"
