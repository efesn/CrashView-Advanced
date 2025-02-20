using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using CrashViewAdvanced.DTOs;
using CrashViewAdvanced.Entities;

namespace CrashViewAdvanced.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly CrashViewContext _context;

        public UsersController(CrashViewContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetUserProfile()
        {
            try 
            {
                var username = User.Identity?.Name;
                Console.WriteLine($"Username from token: {username}"); // Debug log

                if (string.IsNullOrEmpty(username))
                {
                    Console.WriteLine("Username is null or empty"); // Debug log
                    return Unauthorized();
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == username);

                Console.WriteLine($"User found: {user != null}"); // Debug log

                if (user == null)
                {
                    return NotFound();
                }

                var profile = new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = DateTime.UtcNow
                };

                return profile;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserProfile: {ex.Message}"); // Debug log
                return StatusCode(500, new { message = "An error occurred while fetching the profile", error = ex.Message });
            }
        }
    }
} 