using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace CrashViewAdvanced.Entities;

public partial class CrashViewContext : DbContext
{
    public CrashViewContext()
    {
    }

    public CrashViewContext(DbContextOptions<CrashViewContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Crash> Crashes { get; set; }

    public virtual DbSet<CrashDriver> CrashDrivers { get; set; }
    public virtual DbSet<Driver> Drivers { get; set; }
    public virtual DbSet<Team> Teams { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public DbSet<Discussion> Discussions { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Poll> Polls { get; set; }
    public DbSet<PollVote> PollVotes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=CrashViewAdvanced;Trusted_Connection=True;TrustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Crash>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Crashes__3214EC0766803C63");

            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.VideoUrl).HasMaxLength(255);
        });

        modelBuilder.Entity<CrashDriver>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.ToTable("CrashDriver");

            entity.HasOne(d => d.Crash)
                .WithMany(p => p.CrashDrivers)
                .HasForeignKey(d => d.CrashId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Driver)
                .WithMany(p => p.CrashDrivers)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
