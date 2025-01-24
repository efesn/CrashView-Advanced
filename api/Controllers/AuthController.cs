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
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.UserName);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash)) 
            {
                return Unauthorized(); 
            }

            var token = GenerateJwtToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddDays(7)
            };
            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new { 
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
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

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
    }
}
