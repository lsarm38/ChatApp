namespace ChatApp.API.DTOs;

public class RoomDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OnlineCount { get; set; }
}