using Microsoft.AspNetCore.Mvc;
using CrashViewAdvanced.Entities;
using CrashViewAdvanced.DTOs;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CrashViewAdvanced.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CrashesController : ControllerBase
    {
        private readonly CrashViewContext _context;

        public CrashesController(CrashViewContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCrashes()
        {
            var crashes = await _context.Crashes.Include(c => c.CrashDrivers).ToListAsync();
            //var crashes = await _context.Crashes.Include(c => c.CrashDrivers).ThenInclude(cd => cd.Driver).ToListAsync();
            return Ok(crashes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCrash([FromBody] CrashCreateDto crashCreateDto)
        {
            // Verify that all driver IDs exist before creating the crash
            foreach (var driverDto in crashCreateDto.CrashDrivers)
            {
                var driverExists = await _context.Drivers.AnyAsync(d => d.Id == driverDto.DriverId);
                if (!driverExists)
                {
                    return BadRequest($"Driver with ID {driverDto.DriverId} does not exist");
                }
            }

            var crash = new Crash
            {
                Date = crashCreateDto.Date,
                Description = crashCreateDto.Description,
                VideoUrl = crashCreateDto.VideoUrl,
                CrashDrivers = crashCreateDto.CrashDrivers.Select(cd => new CrashDriver
                {
                    DriverId = cd.DriverId
                }).ToList()
            };

            _context.Crashes.Add(crash);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCrashById), new { id = crash.Id }, crash);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCrashById(int id)
        {
            var crash = await _context.Crashes
                .Include(c => c.CrashDrivers)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (crash == null)
            {
                return NotFound();
            }

            return Ok(crash);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCrash(int id, [FromBody] Crash crash)
        {
            if (id != crash.Id) return BadRequest();

            var existingCrash = await _context.Crashes.FindAsync(id);
            if (existingCrash == null) return NotFound();

            existingCrash.Date = crash.Date;
            existingCrash.Description = crash.Description;
            existingCrash.VideoUrl = crash.VideoUrl;

            existingCrash.CrashDrivers.Clear();
            existingCrash.CrashDrivers = crash.CrashDrivers.Select(d => new CrashDriver
            {
                DriverId = d.DriverId,

            }).ToList();

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCrash(int id)
        {
            var crash = await _context.Crashes.FindAsync(id);
            if (crash == null) return NotFound();

            _context.Crashes.Remove(crash);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }
    }
}
