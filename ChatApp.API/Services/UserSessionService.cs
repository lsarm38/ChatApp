using ChatApp.API.Data;
using ChatApp.API.Models;
using ChatApp.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Services;

public class UserSessionService : IUserSessionService
{
    private readonly AppDbContext _context;

    public UserSessionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddUserAsync(string connectionId, string username, int roomId)
    {
        var existing = await _context.UserSessions
            .FirstOrDefaultAsync(u => u.ConnectionId == connectionId);

        if (existing != null)
        {
            existing.Username = username;
            existing.RoomId = roomId;
            existing.JoinedAt = DateTime.UtcNow;
        }
        else
        {
            _context.UserSessions.Add(new UserSession
            {
                ConnectionId = connectionId,
                Username = username,
                RoomId = roomId,
                JoinedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveUserAsync(string connectionId)
    {
        var session = await _context.UserSessions
            .FirstOrDefaultAsync(u => u.ConnectionId == connectionId);

        if (session != null)
        {
            _context.UserSessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<string>> GetUsersInRoomAsync(int roomId)
    {
        return await _context.UserSessions
            .Where(u => u.RoomId == roomId)
            .Select(u => u.Username)
            .ToListAsync();
    }

    public async Task<(string username, int roomId)?> GetUserAsync(string connectionId)
    {
        var session = await _context.UserSessions
            .FirstOrDefaultAsync(u => u.ConnectionId == connectionId);

        if (session == null) return null;
        return (session.Username, session.RoomId);
    }
}