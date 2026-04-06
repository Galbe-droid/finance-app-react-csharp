using finance_api.Middleware.Enum;
using finance_api.Model.DTO.TransactionDTO;

namespace finance_api.Model.DTO.CategoryDTO
{
    public class ReturnCategory
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Balance { get; set; }
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
        public CategoryType CategoryType { get; set; }

        public DateTimeOffset CreateAt { get; set; }
    }
}
