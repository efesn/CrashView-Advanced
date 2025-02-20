using CrashViewAdvanced.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; 
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CrashViewAdvanced.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace CrashViewAdvanced.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CrashViewContext _context;
        private readonly IConfiguration _configuration; 

        public AuthController(CrashViewContext context, IConfiguration configuration) 
        {
            _context = context;
            _configuration = configuration; 
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationDTO registrationDto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == registrationDto.UserName);

            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);

            var newUser = new User
            {
                UserName = registrationDto.UserName,
                Email = registrationDto.Email,
                PasswordHash = hashedPassword, 
                Role = "User" 
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username);
            
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid username or password" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new { 
                token = token,
                message = "Login successful",
                role = user.Role
            });
        }

        [HttpGet("verify-admin")]
        [Authorize]
        public async Task<IActionResult> VerifyAdmin()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new { isAdmin = user.Role == "Admin" });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No token found");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);

            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JwtSettings:Audience"],
                    ValidateLifetime = false 
                };

                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                var username = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("Invalid token");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
                if (user == null)
                {
                    return Unauthorized("User not found");
                }

                var newToken = GenerateJwtToken(user);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddDays(7)
                };
                Response.Cookies.Append("jwt", newToken, cookieOptions);

                return Ok(new { message = "Token refreshed successfully" });
            }
            catch
            {
                return Unauthorized("Invalid token");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string inputPassword, string storedPasswordHash)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedPasswordHash); 
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("admin-login")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
        {
            Console.WriteLine($"Received admin login request for user: {request.Username}");

            try 
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username);

                if (user == null)
                {
                    Console.WriteLine("User not found in database");
                    return Unauthorized(new { message = "Invalid admin credentials" });
                }

                Console.WriteLine($"Found user with role: {user.Role}");

                if (!VerifyPassword(request.Password, user.PasswordHash))
                {
                    Console.WriteLine("Password verification failed");
                    return Unauthorized(new { message = "Invalid admin credentials" });
                }

                Console.WriteLine("Password verified successfully");

                if (user.Role != "Admin")
                {
                    Console.WriteLine($"User is not admin. Role: {user.Role}");
                    return Unauthorized(new { message = "Access denied. Only administrators can access this area." });
                }

                var token = GenerateJwtToken(user);
                Console.WriteLine("JWT token generated");

                return Ok(new { 
                    message = "Admin login successful",
                    role = user.Role,
                    token = token
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during admin login: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("create-initial-admin")]
        public async Task<IActionResult> CreateInitialAdmin(RegistrationDTO registrationDto)
        {
            // Check if any admin user exists
            var adminExists = await _context.Users.AnyAsync(u => u.Role == "Admin");
            if (adminExists)
            {
                return BadRequest("Admin user already exists. Cannot create initial admin.");
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == registrationDto.UserName);

            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);

            var adminUser = new User
            {
                UserName = registrationDto.UserName,
                Email = registrationDto.Email,
                PasswordHash = hashedPassword,
                Role = "Admin"  // Explicitly set as Admin
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Initial admin user created successfully" });
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var currentUsername = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == currentUsername);
            
            if (currentUser?.Role != "Admin")
            {
                return Unauthorized("Only administrators can view user list.");
            }

            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
