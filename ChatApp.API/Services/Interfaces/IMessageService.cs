using ChatApp.API.DTOs;

namespace ChatApp.API.Services.Interfaces;

public interface IMessageService
{
    Task<IEnumerable<MessageDto>> GetRoomHistoryAsync(int roomId, int count = 50);
    Task<MessageDto> SaveMessageAsync(int roomId, string username, string content);
}