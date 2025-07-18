// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Connect to socket server
  const connect = (username) => {
    socket.connect();
    if (username) {
      socket.emit('user_join', username);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Correct place for emitting a message
  const sendMessage = (message, username) => {
    if (!message.trim()) return;
    const msg = {
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    socket.emit('send_message', msg);
  };


  // Private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Typing
  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  // Listeners
  useEffect(() => {
    // Connection
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // Incoming public message
    const onReceiveMessage = (msg) => {
      console.log("Received message:", msg);

      if (msg.username && msg.message) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    // Incoming private message
    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Register events
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);
    socket.on("message_reaction", ({ messageId, reaction, username }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
              ...msg,
              reactions: [...(msg.reactions || []), { reaction, username }],
            }
            : msg
        )
      );
    });

    socket.on("new_message_notification", (data) => {
      if (Notification.permission === "granted") {
        new Notification("New Message from " + data.from, {
          body: data.message.text,
        });
      }
    });

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
      socket.off("message_reaction");

    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  };
};

export default socket;
