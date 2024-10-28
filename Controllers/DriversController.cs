using CrashViewAdvanced.Entities;
using CrashViewAdvanced.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CrashViewAdvanced.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        private readonly CrashViewContext _context;

        public DriversController(CrashViewContext context)
        {
            _context = context;
        }

        
        // GET: api/drivers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DriverDTO>>> GetDrivers()
        {
            var drivers = await _context.Drivers
                .Include(d => d.Team) 
                .Select(d => new DriverDTO
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    TeamId = d.TeamId,
                    Team = new TeamDTO
                    {
                        Id = d.Team.Id,
                        Name = d.Team.Name,
                        Drivers = d.Team.Drivers.Select(driver => new DriverDTO
                        {
                            Id = driver.Id,
                            FirstName = driver.FirstName,
                            LastName = driver.LastName,
                            TeamId = driver.TeamId
                        }).ToList()  
                    }
                })
                .ToListAsync();

            return Ok(drivers);
        }


        // GET: api/drivers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DriverDTO>> GetDriver(int id)
        {
            var driver = await _context.Drivers
                .Include(d => d.Team) 
                .Where(d => d.Id == id)
                .Select(d => new DriverDTO
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    TeamId = d.TeamId,
                    Team = new TeamDTO
                    {
                        Id = d.Team.Id,
                        Name = d.Team.Name,
                        Drivers = d.Team.Drivers.Select(driver => new DriverDTO
                        {
                            Id = driver.Id,
                            FirstName = driver.FirstName,
                            LastName = driver.LastName,
                            TeamId = driver.TeamId
                        }).ToList() 
                    }
                })
                .FirstOrDefaultAsync();

            return driver == null ? NotFound() : Ok(driver);
        }


        // POST: api/drivers
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DriverDTO>> PostDriver(DriverDTO driverDto)
        {
            var driver = new Driver
            {
                FirstName = driverDto.FirstName,
                LastName = driverDto.LastName,
                TeamId = driverDto.TeamId,
                
            };

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            
            driverDto.Id = driver.Id; 

            return CreatedAtAction(nameof(GetDriver), new { id = driver.Id }, driverDto);
        }

        // PUT: api/drivers/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutDriver(int id, DriverDTO driverDto)
        {
            if (id != driverDto.Id)
            {
                return BadRequest();
            }

            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
            {
                return NotFound();
            }

            driver.FirstName = driverDto.FirstName;
            driver.LastName = driverDto.LastName;
            driver.TeamId = driverDto.TeamId;
            

            _context.Entry(driver).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DriverExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/drivers/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
            {
                return NotFound();
            }

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DriverExists(int id)
        {
            return _context.Drivers.Any(e => e.Id == id);
        }
    }
}
