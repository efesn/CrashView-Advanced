namespace CrashViewAdvanced.DTOs
{
    public class TeamDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<DriverDTO> Drivers { get; set; }
    }
}
