using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrashViewAdvanced.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CrashViewAdvanced.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PollController : ControllerBase
    {
        private readonly CrashViewContext _context;

        public PollController(CrashViewContext context)
        {
            _context = context;
        }

        // GET: api/poll
        [HttpGet]
        public async Task<ActionResult> GetPolls()
        {
            var polls = await _context.Polls.Include(p => p.Votes).ToListAsync();
            return Ok(polls);
        }

        // POST: api/poll
        [HttpPost]
        public async Task<ActionResult<Poll>> CreatePoll([FromBody] Poll poll)
        {
            if (poll == null)
            {
                return BadRequest("Poll data is required.");
            }

            _context.Polls.Add(poll);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPolls), new { id = poll.Id }, poll);
        }

        // PUT: api/poll/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePoll(int id, [FromBody] Poll poll)
        {
            if (id != poll.Id)
            {
                return BadRequest("Poll ID mismatch.");
            }

            var existingPoll = await _context.Polls.FindAsync(id);
            if (existingPoll == null)
            {
                return NotFound(new { message = "Poll not found!" });
            }

            existingPoll.Question = poll.Question;
            existingPoll.DiscussionId = poll.DiscussionId;  

            _context.Polls.Update(existingPoll);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/poll/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePoll(int id)
        {
            var poll = await _context.Polls.FindAsync(id);
            if (poll == null)
            {
                return NotFound(new { message = "Poll not found!" });
            }

            _context.Polls.Remove(poll);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/poll/vote
        [HttpPost("vote")]
        public async Task<ActionResult> VotePoll([FromBody] VoteRequest voteRequest)
        {
            var poll = await _context.Polls.FindAsync(voteRequest.PollId);
            if (poll == null)
            {
                return NotFound(new { message = "Poll not found!" });
            }

            var existingVote = await _context.PollVotes
                .Where(v => v.PollId == voteRequest.PollId && v.Voter == voteRequest.Voter)
                .FirstOrDefaultAsync();

            if (existingVote != null)
            {
                existingVote.VoteOption = voteRequest.VoteOption;
                _context.PollVotes.Update(existingVote);
            }
            else
            {
                var newVote = new PollVote
                {
                    PollId = voteRequest.PollId,
                    Voter = voteRequest.Voter,
                    VoteOption = voteRequest.VoteOption,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PollVotes.Add(newVote);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Vote successfully registered!" });
        }
    }

    public class VoteRequest
    {
        public int PollId { get; set; }
        public string Voter { get; set; }
        public string VoteOption { get; set; }
    }
}
