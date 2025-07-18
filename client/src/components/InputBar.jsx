import React, { useState } from 'react';

const InputBar = ({ username, setUsername, setTyping, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [inputUsername, setInputUsername] = useState('');

    const handleJoin = (e) => {
        e.preventDefault();
        const trimmedName = inputUsername.trim();
        if (!trimmedName) return;

        setUsername(trimmedName);
    };

    const handleSend = (e) => {
        e.preventDefault();
        onSendMessage(message);
        setMessage('');
    };

    return (
        <form
            onSubmit={username ? handleSend : handleJoin}
            className="flex p-4 bg-white border-t border-gray-300"
        >
            {!username ? (
                <>
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your name to join chat..."
                        value={inputUsername}
                        onChange={(e) => setInputUsername(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                        Join
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={() => setTyping(true)}
                        onKeyUp={() => setTimeout(() => setTyping(false), 1000)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                        Send
                    </button>
                </>
            )}
        </form>
    );
};

export default InputBar;
