using System;
using System.Collections.Generic;

namespace CrashViewAdvanced.Entities;

public partial class Crash
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public string? Description { get; set; }

    public string? VideoUrl { get; set; }

    public virtual ICollection<CrashDriver> CrashDrivers { get; set; } = new List<CrashDriver>();
}
