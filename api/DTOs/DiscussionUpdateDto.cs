public class DiscussionUpdateDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int CrashId { get; set; }
    public PollUpdateDto Poll { get; set; }
}

public class PollUpdateDto
{
    public int Id { get; set; }
    public string Question { get; set; }
} 