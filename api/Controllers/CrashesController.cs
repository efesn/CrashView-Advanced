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
            var crashes = await _context.Crashes.ToListAsync();
            return Ok(crashes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCrash([FromBody] CrashCreateDto crashDto)
        {
            var crash = new Crash
            {
                Date = crashDto.Date,
                Description = crashDto.Description,
                VideoUrl = crashDto.VideoUrl,
                CrashDrivers = crashDto.DriversInCrash.Select(d => new CrashDriver
                {
                    DriverId = d.DriverId,
                   // Injured = d.InjuryStatus,
                   // DamageLevel = d.DamageLevel,
                   // RoleInCrash = d.IsResponsible ? "Responsible" : "Not Responsible"
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
                Injured = d.Injured,
                DamageLevel = d.DamageLevel,
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
