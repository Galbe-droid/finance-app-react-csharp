using finance_api.Middleware.Enum;
using System.Diagnostics;

namespace finance_api.Model
{
    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;
        public TransactionType TransactionType { get; set; }
        public SourceType Source { get; set; }
        public string SourceName { get; set; } = string.Empty;
        public string SourceDescription { get; set; } = string.Empty;

        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public bool isDeleted { get; set; } = false;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public void SourceNaming()
        {
            if(Source != SourceType.Another)
            {
                SourceName = Source.ToString();
            }
        }
    }
}
