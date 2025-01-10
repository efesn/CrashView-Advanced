using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrashViewAdvanced.Entities;
using CrashViewAdvanced.DTOs;

namespace CrashViewAdvanced.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly CrashViewContext _context;

        public TeamsController(CrashViewContext context)
        {
            _context = context;
        }

        // GET: api/teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamDTO>>> GetTeams()
        {
            var teams = await _context.Teams
                .Include(t => t.Drivers) 
                .Select(team => new TeamDTO
                {
                    Id = team.Id,
                    Name = team.Name,
                    Drivers = team.Drivers.Select(driver => new DriverDTO
                    {
                        Id = driver.Id,
                        FirstName = driver.FirstName,
                        LastName = driver.LastName,
                        TeamId = driver.TeamId
                    }).ToList()
                }).ToListAsync();

            return Ok(teams);
        }

        // GET: api/teams/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDTO>> GetTeam(int id)
        {
            var team = await _context.Teams
                .Include(t => t.Drivers) 
                .Where(t => t.Id == id)
                .Select(t => new TeamDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Drivers = t.Drivers.Select(driver => new DriverDTO
                    {
                        Id = driver.Id,
                        FirstName = driver.FirstName,
                        LastName = driver.LastName,
                        TeamId = driver.TeamId
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return team == null ? NotFound() : Ok(team);
        }

        // POST: api/teams
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeamDTO>> PostTeam(TeamDTO teamDto)
        {
            var team = new Team
            {
                Name = teamDto.Name,
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync(); 

            foreach (var driverDto in teamDto.Drivers)
            {
              
                var existingDriver = await _context.Drivers.FindAsync(driverDto.Id);
                if (existingDriver != null)
                {
                    
                    existingDriver.TeamId = team.Id;
                }
                else
                {
                  
                    var newDriver = new Driver
                    {
                        FirstName = driverDto.FirstName,
                        LastName = driverDto.LastName,
                        TeamId = team.Id 
                    };
                    _context.Drivers.Add(newDriver);
                }
            }

            await _context.SaveChangesAsync(); 

            var createdTeamDto = new TeamDTO
            {
                Id = team.Id,
                Name = team.Name,
                Drivers = new List<DriverDTO>() 
            };

            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, createdTeamDto);
        }


        // PUT: api/teams/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutTeam(int id, TeamDTO teamDto)
        {
            if (id != teamDto.Id)
            {
                return BadRequest();
            }

            var team = await _context.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            team.Name = teamDto.Name;
        

            _context.Entry(team).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/teams/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.Id == id);
        }
    }
}
