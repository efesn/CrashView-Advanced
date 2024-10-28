using System;
using System.Collections.Generic;

namespace CrashViewAdvanced.Entities;

public partial class Driver
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public int TeamId { get; set; }

    public virtual ICollection<Crash> Crashes { get; set; } = new List<Crash>();

    public virtual Team Team { get; set; } = null!;
}
