using CrashViewAdvanced.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly CrashViewContext _context;

    public CommentsController(CrashViewContext context)
    {
        _context = context;
    }

    // GET: api/Comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
    {
        return await _context.Comments.ToListAsync();
    }

    // GET: api/Comments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Comment>> GetComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);

        if (comment == null)
        {
            return NotFound();
        }

        return comment;
    }

    // POST: api/Comments
    [HttpPost]
    public async Task<ActionResult<Comment>> PostComment(Comment comment)
    {
        // Set CreatedAt if not provided
        if (comment.CreatedAt == default)
        {
            comment.CreatedAt = DateTime.UtcNow;
        }

        // Clear the navigation property to prevent validation error
        comment.Discussion = null;

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Fetch the complete comment with discussion for the response
        var createdComment = await _context.Comments
            .Include(c => c.Discussion)
            .FirstOrDefaultAsync(c => c.Id == comment.Id);

        return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, createdComment);
    }

    // PUT: api/Comments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutComment(int id, Comment comment)
    {
        if (id != comment.Id)
        {
            return BadRequest();
        }

        _context.Entry(comment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CommentExists(id))
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

    // DELETE: api/Comments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CommentExists(int id)
    {
        return _context.Comments.Any(e => e.Id == id);
    }
}
