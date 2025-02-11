public class Comment
{
    public int Id { get; set; }
    public int DiscussionId { get; set; }
    public string Author { get; set; }
    public string CommentText { get; set; }
    public DateTime CreatedAt { get; set; }

    public Discussion? Discussion { get; set; }
}
