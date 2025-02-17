﻿using System;
using System.Collections.Generic;

namespace CrashViewAdvanced.Entities;

public partial class CrashDriver
{
    public int Id { get; set; }

    public int CrashId { get; set; }

    public int DriverId { get; set; }
    public virtual Driver Driver { get; set; } = null!;
    public virtual Crash Crash { get; set; } = null!;
}
