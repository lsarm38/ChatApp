using ChatApp.API.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.API.Hubs;

public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly IUserSessionService _userSessionService;

    public ChatHub(IMessageService messageService, IUserSessionService userSessionService)
    {
        _messageService = messageService;
        _userSessionService = userSessionService;
    }

    public async Task JoinRoom(string username, int roomId)
    {
        await _userSessionService.AddUserAsync(Context.ConnectionId, username, roomId);
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());

        var users = await _userSessionService.GetUsersInRoomAsync(roomId);
        await Clients.Group(roomId.ToString()).SendAsync("UsersUpdated", users);
        await Clients.Group(roomId.ToString()).SendAsync("UserJoined", username);
    }

    public async Task LeaveRoom(int roomId)
    {
        var user = await _userSessionService.GetUserAsync(Context.ConnectionId);
        if (user == null) return;

        await _userSessionService.RemoveUserAsync(Context.ConnectionId);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId.ToString());

        var users = await _userSessionService.GetUsersInRoomAsync(roomId);
        await Clients.Group(roomId.ToString()).SendAsync("UsersUpdated", users);
        await Clients.Group(roomId.ToString()).SendAsync("UserLeft", user.Value.username);
    }

    public async Task SendMessage(int roomId, string content)
    {
        var user = await _userSessionService.GetUserAsync(Context.ConnectionId);
        if (user == null) return;

        var message = await _messageService.SaveMessageAsync(roomId, user.Value.username, content);
        await Clients.Group(roomId.ToString()).SendAsync("ReceiveMessage", message);
    }

    public async Task TypingStarted(int roomId)
    {
        var user = await _userSessionService.GetUserAsync(Context.ConnectionId);
        if (user == null) return;

        await Clients.OthersInGroup(roomId.ToString())
            .SendAsync("UserTyping", user.Value.username);
    }

    public async Task TypingStopped(int roomId)
    {
        var user = await _userSessionService.GetUserAsync(Context.ConnectionId);
        if (user == null) return;

        await Clients.OthersInGroup(roomId.ToString())
            .SendAsync("UserStoppedTyping", user.Value.username);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = await _userSessionService.GetUserAsync(Context.ConnectionId);
        if (user != null)
        {
            await _userSessionService.RemoveUserAsync(Context.ConnectionId);
            var users = await _userSessionService.GetUsersInRoomAsync(user.Value.roomId);
            await Clients.Group(user.Value.roomId.ToString()).SendAsync("UsersUpdated", users);
            await Clients.Group(user.Value.roomId.ToString()).SendAsync("UserLeft", user.Value.username);
        }

        await base.OnDisconnectedAsync(exception);
    }
}