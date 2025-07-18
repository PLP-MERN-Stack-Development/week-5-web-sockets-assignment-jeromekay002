import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../socket/socket"; // <-- import useSocket

export default function LoginPage() {
  const [input, setInput] = useState("");
  const { setUsername } = useUser();
  const navigate = useNavigate();
  const { connect } = useSocket(); // <-- destructure connect from hook

  const handleLogin = () => {
    if (input.trim()) {
      setUsername(input);
      connect(input); // <-- CONNECT to socket and emit join
      navigate("/chat");
    }
  };

  return (
    <div className="login-page p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Enter Username</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Your name"
        className="border px-4 py-2 rounded w-64"
      />
      <button
        onClick={handleLogin}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Join Chat
      </button>
    </div>
  );
}
