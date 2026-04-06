using finance_api.Model;
using Microsoft.EntityFrameworkCore;

namespace finance_api.Repositories
{
    public class FinanceDBContext : DbContext
    {
        public Guid CurrentUserId { get; set; }
        public FinanceDBContext(DbContextOptions<FinanceDBContext> options): base(options)
        {
            
        }

        public DbSet<Transaction> transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Transaction>()
                .HasQueryFilter(t => !t.isDeleted && t.UserId == CurrentUserId);

            modelBuilder.Entity<Category>()
                .HasQueryFilter(c => !c.isDeleted && c.UserId == CurrentUserId);
            
            modelBuilder.Entity<User>()
                .HasQueryFilter(u => !u.IsDeleted);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .Property(c => c.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .Property(c => c.Balance)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .Property(c => c.Income)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .Property(c => c.Expense)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany()                
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany()
                .HasForeignKey(t => t.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Transaction>()
                .HasIndex(t => t.UserId);

            modelBuilder.Entity<Transaction>()
                .HasIndex(t => t.CategoryId);

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.UserId);
        }
    }
}
