import React from 'react';
import { socket } from '../socket/socket';

const ChatBox = ({ messages, typingUser, currentUser }) => {
    const handleReaction = (messageId, reaction) => {
        socket.emit('react_to_message', { messageId, reaction, username: currentUser });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white via-blue-50 to-purple-50">
            {messages.map((msg, i) => {
                if (msg.system) {
                    return (
                        <div key={i} className="text-center text-xs text-gray-500 italic">
                            {msg.message}
                        </div>
                    );
                }

                const isOwnMessage = msg.username === currentUser;

                return (
                    <div
                        key={i}
                        className={`rounded-xl px-4 py-2 text-sm shadow-md max-w-xs sm:max-w-sm md:max-w-md break-words transition-transform duration-150 ${isOwnMessage
                                ? 'bg-gradient-to-r from-green-100 to-green-200 self-end ml-auto text-right'
                                : 'bg-gradient-to-l from-blue-100 to-blue-200 self-start'
                            }`}
                    >
                        <strong className="block font-semibold text-gray-700 mb-1">
                            {msg.username}
                        </strong>
                        <p className="text-gray-800">{msg.message}</p>

                        {/* Reaction buttons */}
                        <div className="flex gap-2 mt-2 text-lg">
                            {['👍', '❤️', '😂'].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReaction(msg.id, emoji)}
                                    className="hover:scale-110 transition-transform"
                                    title={`React with ${emoji}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        {/* Show reactions */}
                        {msg.reactions?.length > 0 && (
                            <div className="text-xs mt-1 text-gray-600 flex flex-wrap gap-1">
                                {msg.reactions.map((r, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-white px-2 py-0.5 rounded-full shadow-sm text-gray-700"
                                    >
                                        {r.reaction} <span className="text-xs">({r.username})</span>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="text-[0.7rem] text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                );
            })}
            {typingUser && (
                <div className="italic text-gray-500 mt-2">{typingUser} is typing...</div>
            )}
        </div>
    );
};

export default ChatBox;
