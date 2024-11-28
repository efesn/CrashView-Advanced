public class PollVote
{
    public int Id { get; set; }
    public int PollId { get; set; }
    public string Voter { get; set; }
    public string VoteOption { get; set; }
    public DateTime CreatedAt { get; set; }

    public Poll Poll { get; set; } 
}
