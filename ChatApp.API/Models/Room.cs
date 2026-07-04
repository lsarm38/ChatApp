namespace ChatApp.API.Models;

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<UserSession> UserSessions { get; set; } = new List<UserSession>();
}