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
        return await _context.Discussions
            .Include(d => d.Comments)
            .Include(d => d.Poll)
                .ThenInclude(p => p.Votes)
            .Include(d => d.Crash)
                .ThenInclude(c => c.CrashDrivers)
            .ToListAsync();
    }

    // GET By Id
    [HttpGet("{id}")]
    public async Task<ActionResult<Discussion>> GetDiscussion(int id)
    {
        var discussion = await _context.Discussions
            .Include(d => d.Comments)
            .Include(d => d.Poll)
                .ThenInclude(p => p.Votes)
            .Include(d => d.Crash)
                .ThenInclude(c => c.CrashDrivers) // !!!
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
        discussion.Comments = new List<Comment>();

        if (discussion.Poll != null)
        {
            discussion.Poll.Votes = new List<PollVote>();
        }

        _context.Discussions.Add(discussion);
        await _context.SaveChangesAsync();

        var createdDiscussion = await _context.Discussions
            .Include(d => d.Comments)
            .Include(d => d.Poll)
                .ThenInclude(p => p.Votes)
            .FirstOrDefaultAsync(d => d.Id == discussion.Id);

        return CreatedAtAction(nameof(GetDiscussion), new { id = discussion.Id }, createdDiscussion);
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDiscussion(int id, DiscussionUpdateDto updateDto)
    {
        if (id != updateDto.Id)
        {
            return BadRequest();
        }

        var existingDiscussion = await _context.Discussions
            .Include(d => d.Poll)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (existingDiscussion == null)
        {
            return NotFound();
        }

        // Update basic properties
        existingDiscussion.Title = updateDto.Title;
        existingDiscussion.CrashId = updateDto.CrashId;

        // Update poll if it exists
        if (updateDto.Poll != null && existingDiscussion.Poll != null)
        {
            existingDiscussion.Poll.Question = updateDto.Poll.Question;
        }

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DiscussionExists(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscussion(int id)
    {
        var discussion = await _context.Discussions
            .Include(d => d.Comments)
            .Include(d => d.Poll)
                .ThenInclude(p => p.Votes)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (discussion == null)
        {
            return NotFound();
        }

        // Remove all comments
        if (discussion.Comments != null)
        {
            _context.Comments.RemoveRange(discussion.Comments);
        }

        // Remove poll votes and poll
        if (discussion.Poll != null)
        {
            if (discussion.Poll.Votes != null)
            {
                _context.PollVotes.RemoveRange(discussion.Poll.Votes);
            }
            _context.Polls.Remove(discussion.Poll);
        }

        // Finally remove the discussion
        _context.Discussions.Remove(discussion);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool DiscussionExists(int id)
    {
        return _context.Discussions.Any(e => e.Id == id);
    }
}
