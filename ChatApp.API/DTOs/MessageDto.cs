namespace ChatApp.API.DTOs;

public class MessageDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public int RoomId { get; set; }
}