using finance_api.Middleware.Enum;

namespace finance_api.Model.DTO.TransactionDTO
{
    public class MininalTransaction
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public DateTimeOffset Date { get; set; }
        public TransactionType TransactionType { get; set; }
        public SourceType Source { get; set; }
        public string SourceName { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
