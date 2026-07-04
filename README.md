# ChatApp

A real-time chat application with public rooms, typing indicators, online user lists, and message history. Built with SignalR for WebSocket communication, a C# / ASP.NET Core backend, and a React / TypeScript frontend.

🔗 **[Live Demo](https://chat-app-delta-ten-28.vercel.app)** · **[API](https://chatapp-api-gzg2.onrender.com/swagger)**

---

## Features

- **Public chat rooms** — join any of the available rooms and start chatting instantly
- **Real-time messaging** — messages delivered instantly via SignalR WebSockets
- **Typing indicators** — see when other users are typing
- **Online user list** — live list of who's currently in the room
- **Message history** — previous messages load when you join a room
- **Auto-cleanup** — users are removed from rooms automatically on disconnect
- **Username on entry** — no account required, just pick a username and go

---

## Tech Stack

**Backend**
- C# / ASP.NET Core
- SignalR (WebSocket hub)
- Entity Framework Core
- PostgreSQL (production)
- REST API + SignalR hub

**Frontend**
- React 19 / TypeScript
- Vite
- Tailwind CSS
- @microsoft/signalr client
- Axios
- React Router

**Infrastructure**
- API hosted on [Render](https://render.com)
- Database hosted on [Supabase](https://supabase.com) (PostgreSQL)
- Frontend hosted on [Vercel](https://vercel.com)

---

## Project Structure

```
ChatApp/
├── ChatApp.API/                  # ASP.NET Core backend
│   ├── Controllers/              # REST endpoints
│   ├── Data/                     # DbContext
│   ├── DTOs/                     # Request/response models
│   ├── Hubs/                     # SignalR ChatHub
│   ├── Models/                   # EF Core entities
│   └── Services/                 # Business logic
│       └── Interfaces/           # Service contracts
└── chatapp-client/               # React frontend
    └── src/
        ├── api/                  # Axios API calls
        ├── components/           # Reusable UI components
        ├── hooks/                # useChat SignalR hook
        ├── pages/                # Lobby and ChatRoom pages
        └── types/                # TypeScript interfaces
```

---

## SignalR Events

**Client → Server**
| Event | Parameters | Description |
|---|---|---|
| `JoinRoom` | username, roomId | Join a chat room |
| `LeaveRoom` | roomId | Leave a chat room |
| `SendMessage` | roomId, content | Send a message |
| `TypingStarted` | roomId | Notify others you're typing |
| `TypingStopped` | roomId | Notify others you stopped typing |

**Server → Client**
| Event | Parameters | Description |
|---|---|---|
| `ReceiveMessage` | message | New message received |
| `UsersUpdated` | users[] | Online user list changed |
| `UserJoined` | username | User joined the room |
| `UserLeft` | username | User left the room |
| `UserTyping` | username | User started typing |
| `UserStoppedTyping` | username | User stopped typing |

---

## Getting Started

### Prerequisites

- [.NET 9 or 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js LTS](https://nodejs.org)
- A PostgreSQL database ([Supabase](https://supabase.com) recommended)

### Backend

1. Navigate to the backend folder:
```bash
cd ChatApp.API
```

2. Add an `appsettings.Development.json` file:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Port=...;Database=...;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

3. Run migrations and start the API:
```bash
dotnet restore
dotnet ef database update
dotnet run
```

The API will start at `http://localhost:5186`. Swagger UI available at `http://localhost:5186/swagger`.

### Frontend

1. Navigate to the frontend folder:
```bash
cd chatapp-client
```

2. Add a `.env.local` file:
```
VITE_API_URL=http://localhost:5186/api
VITE_HUB_URL=http://localhost:5186/hubs/chat
```

3. Install and run:
```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

> Make sure the backend is running before starting the frontend.

---

## Database Schema

**Rooms** — chat rooms with name and description (seeded with General, Tech Talk, Random)

**Messages** — chat messages linked to a room with username, content, and timestamp (cascade delete)

**UserSessions** — active connection tracking with connectionId and roomId for online presence (cascade delete)

---

## Roadmap

- [ ] Private messaging between users
- [ ] User authentication
- [ ] Message reactions
- [ ] Room creation by users
- [ ] File/image sharing

---

## Author

Luis Sarmiento — [LinkedIn](https://www.linkedin.com/in/luis-sarmiento-40023b54/) · [Portfolio](https://portfolio-iota-six-44.vercel.app)
