public class Poll
{
    public int Id { get; set; }
    public int? DiscussionId { get; set; }
    public string Question { get; set; }
    public DateTime CreatedAt { get; set; }

    public Discussion? Discussion { get; set; }  
    public ICollection<PollVote>? Votes { get; set; } = new List<PollVote>();
    
}
