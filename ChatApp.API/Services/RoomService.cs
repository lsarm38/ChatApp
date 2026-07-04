using ChatApp.API.Data;
using ChatApp.API.DTOs;
using ChatApp.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Services;

public class RoomService : IRoomService
{
    private readonly AppDbContext _context;

    public RoomService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RoomDto>> GetAllAsync()
    {
        var rooms = await _context.Rooms.ToListAsync();
        var sessions = await _context.UserSessions.ToListAsync();

        return rooms.Select(r => new RoomDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            OnlineCount = sessions.Count(s => s.RoomId == r.Id)
        });
    }

    public async Task<RoomDto?> GetByIdAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return null;

        var onlineCount = await _context.UserSessions
            .CountAsync(s => s.RoomId == id);

        return new RoomDto
        {
            Id = room.Id,
            Name = room.Name,
            Description = room.Description,
            OnlineCount = onlineCount
        };
    }
}