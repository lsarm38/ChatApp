using ChatApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly IMessageService _messageService;

    public RoomsController(IRoomService roomService, IMessageService messageService)
    {
        _roomService = roomService;
        _messageService = messageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _roomService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var room = await _roomService.GetByIdAsync(id);
        return room == null ? NotFound() : Ok(room);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(int id, [FromQuery] int count = 50)
    {
        var messages = await _messageService.GetRoomHistoryAsync(id, count);
        return Ok(messages);
    }
}