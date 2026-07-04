using ChatApp.API.DTOs;

namespace ChatApp.API.Services.Interfaces;

public interface IRoomService
{
    Task<IEnumerable<RoomDto>> GetAllAsync();
    Task<RoomDto?> GetByIdAsync(int id);
}