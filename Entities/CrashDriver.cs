using System;
using System.Collections.Generic;

namespace CrashViewAdvanced.Entities;

public partial class CrashDriver
{
    public int Id { get; set; }

    public int CrashId { get; set; }

    public int DriverId { get; set; }

    public bool Injured { get; set; }
    public int DamageLevel { get; set; }

    public string? RoleInCrash { get; set; }

    public virtual Driver Driver { get; set; }
    public virtual Crash Crash { get; set; } = null!;
}
