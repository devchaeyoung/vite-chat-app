import React, { useState } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";

function App() {
  const [username, setUsername] = useState("");

  const handleLogin = (name: string) => {
    setUsername(name);
  };

  const handleLogout = () => {
    setUsername("");
  };

  return <div className="app">{!username ? <Login onLogin={handleLogin} /> : <Chat username={username} onLogout={handleLogout} />}</div>;
}

export default App;
