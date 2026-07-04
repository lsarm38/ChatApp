namespace ChatApp.API.Services.Interfaces;

public interface IUserSessionService
{
    Task AddUserAsync(string connectionId, string username, int roomId);
    Task RemoveUserAsync(string connectionId);
    Task<IEnumerable<string>> GetUsersInRoomAsync(int roomId);
    Task<(string username, int roomId)?> GetUserAsync(string connectionId);
}