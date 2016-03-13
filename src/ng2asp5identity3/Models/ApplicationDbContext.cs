using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ng2asp5identity3.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;

namespace ng2asp5identity3.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public virtual DbSet<UserDetails> UserDetails { get; set; }
        public virtual DbSet<UserLog> UserLog { get; set; }

        public ApplicationDbContext()
        {
            Database.EnsureCreated();
            //Database.Migrate();
        }


        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            builder.Entity<UserDetails>(entity =>
            {
                entity.HasKey(e => e.UserDetailId);

                entity.Property(e => e.Active).HasDefaultValue(true);

                entity.Property(e => e.MarkedInactiveByUserID).HasMaxLength(128);

                entity.Property(e => e.UserID)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.UserDetails).HasForeignKey(d => d.UserID).OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<UserLog>(entity =>
            {
                entity.Property(e => e.IPAddress).HasMaxLength(450);

                entity.Property(e => e.LoginDate).HasColumnType("datetime");

                entity.Property(e => e.UserID)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.UserLog).HasForeignKey(d => d.UserID).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
