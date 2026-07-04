interface Props {
  users: string[];
  currentUser: string;
}

export default function UserList({ users, currentUser }: Props) {
  return (
    <div className="w-56 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Online — {users.length}
        </h3>
      </div>
      <ul className="p-4 space-y-2 overflow-y-auto">
        {users.map((user) => (
          <li key={user} className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                user === currentUser ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {user[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-sm truncate ${user === currentUser ? "text-blue-400 font-medium" : "text-gray-300"}`}
              >
                {user}
              </span>
              {user === currentUser && (
                <span className="text-xs text-gray-600">you</span>
              )}
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 ml-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}
