namespace CrashViewAdvanced.DTOs
{
    public class DriverDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int TeamId { get; set; }
        public TeamDTO Team { get; set; }
    }

}
