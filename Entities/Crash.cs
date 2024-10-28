using System;
using System.Collections.Generic;

namespace CrashViewAdvanced.Entities;

public partial class Crash
{
    public int Id { get; set; }

    public string? Description { get; set; }

    public DateTime Date { get; set; }

    public string? VideoUrl { get; set; }

    public int? DriverId { get; set; }

    public virtual Driver? Driver { get; set; }
}
