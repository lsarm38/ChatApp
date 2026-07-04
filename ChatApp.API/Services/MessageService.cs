using ChatApp.API.Data;
using ChatApp.API.DTOs;
using ChatApp.API.Models;
using ChatApp.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Services;

public class MessageService : IMessageService
{
    private readonly AppDbContext _context;

    public MessageService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MessageDto>> GetRoomHistoryAsync(int roomId, int count = 50)
    {
        return await _context.Messages
            .Where(m => m.RoomId == roomId)
            .OrderByDescending(m => m.SentAt)
            .Take(count)
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Username = m.Username,
                Content = m.Content,
                SentAt = m.SentAt,
                RoomId = m.RoomId
            })
            .ToListAsync();
    }

    public async Task<MessageDto> SaveMessageAsync(int roomId, string username, string content)
    {
        var message = new Message
        {
            RoomId = roomId,
            Username = username,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return new MessageDto
        {
            Id = message.Id,
            Username = message.Username,
            Content = message.Content,
            SentAt = message.SentAt,
            RoomId = message.RoomId
        };
    }
}