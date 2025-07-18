const UserList = ({ users, onSelectUser, selectedUser }) => {
    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Online Users</h2>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
