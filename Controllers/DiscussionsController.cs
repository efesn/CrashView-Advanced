using CrashViewAdvanced.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml.Serialization;

[Route("api/[controller]")]
[ApiController]
public class DiscussionsController : ControllerBase
{
    private readonly CrashViewContext _context;

    public DiscussionsController(CrashViewContext context)
    {
        _context = context;
    }

    // GET all
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Discussion>>> GetDiscussions()
    {
        return await _context.Discussions.Include(d => d.Comments).Include(d => d.Poll).ToListAsync();
    }

    // GET By Id
    [HttpGet("{id}")]
    public async Task<ActionResult<Discussion>> GetDiscussion(int id)
    {
        var discussion = await _context.Discussions
            .Include(d => d.Comments)
            .Include(d => d.Poll)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (discussion == null)
        {
            return NotFound();
        }

        return discussion;
    }

    // POST
    [HttpPost]
    public async Task<ActionResult<Discussion>> PostDiscussion(Discussion discussion)
    {
        _context.Discussions.Add(discussion);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDiscussion), new { id = discussion.Id }, discussion);
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDiscussion(int id, Discussion discussion)
    {
        if (id != discussion.Id)
        {
            return BadRequest();
        }

        _context.Entry(discussion).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DiscussionExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscussion(int id)
    {
        var discussion = await _context.Discussions.FindAsync(id);
        if (discussion == null)
        {
            return NotFound();
        }

        _context.Discussions.Remove(discussion);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool DiscussionExists(int id)
    {
        return _context.Discussions.Any(e => e.Id == id);
    }
}
