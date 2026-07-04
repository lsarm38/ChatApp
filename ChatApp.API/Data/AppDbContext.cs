using ChatApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Room>()
            .HasMany(r => r.Messages)
            .WithOne(m => m.Room)
            .HasForeignKey(m => m.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Room>()
            .HasMany(r => r.UserSessions)
            .WithOne(u => u.Room)
            .HasForeignKey(u => u.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed some default rooms
        modelBuilder.Entity<Room>().HasData(
            new Room { Id = 1, Name = "General", Description = "General chat for everyone", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Room { Id = 2, Name = "Tech Talk", Description = "Discuss all things technology", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Room { Id = 3, Name = "Random", Description = "Anything goes", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}