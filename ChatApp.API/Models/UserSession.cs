namespace ChatApp.API.Models;

public class UserSession
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string ConnectionId { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public Room Room { get; set; } = null!;
}