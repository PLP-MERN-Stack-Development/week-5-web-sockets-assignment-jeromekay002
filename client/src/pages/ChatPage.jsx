import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import InputBar from '../components/InputBar';
import UserList from '../components/UserList';
import { useUser } from '../context/UserContext';
import { useSocket } from '../socket/socket';

const ChatPage = () => {
    const { username, setUsername } = useUser();
    const {
        messages,
        users,
        typingUsers,
        sendMessage,
        sendPrivateMessage,
        setTyping,
        connect,
    } = useSocket();

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (username) {
            connect(username);
        }
    }, [username]);

    const handleSend = (message) => {
        if (selectedUser) {
            sendPrivateMessage(selectedUser.id, message);
        } else {
            sendMessage(message, username);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="flex flex-col md:flex-row w-full max-w-6xl h-[90vh] shadow-xl rounded-xl overflow-hidden border border-gray-200">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 bg-white p-4 border-r overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4 text-purple-700">Users</h2>
                    <UserList
                        users={users}
                        onSelectUser={setSelectedUser}
                        selectedUser={selectedUser}
                    />
                    {selectedUser && (
                        <div className="mt-4 text-sm text-blue-500">
                            Private chat with: {selectedUser.username}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    <ChatBox messages={messages} typingUser={typingUsers[0]} currentUser={username} />
                    <InputBar
                        username={username}
                        setUsername={setUsername}
                        setTyping={setTyping}
                        onSendMessage={handleSend}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
