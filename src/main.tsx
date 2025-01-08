// 리액트돔의 역할을 한다. entry point라고 생각하기
// index.html에 리액트 파일을 뿌려주는 역할을 함.
import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";

// index.html 제어할 요소를 가져옴
const container = document.querySelector("#root");

const root = createRoot(container!);
root.render(<App />);
