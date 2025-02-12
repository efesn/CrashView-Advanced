using CrashViewAdvanced.Entities;

public class Discussion
{
    public int Id { get; set; }
    public int CrashId { get; set; }
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Crash? Crash { get; set; }  
    public ICollection<Comment>? Comments { get; set; }  
    public Poll? Poll { get; set; } 
}
