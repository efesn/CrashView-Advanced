using System;
using System.Collections.Generic;
using CrashViewAdvanced.Entities;

namespace CrashViewAdvanced.DTOs
{
    public class CrashCreateDto
    {
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public List<CrashDriverDto> CrashDrivers { get; set; }
    }
}
