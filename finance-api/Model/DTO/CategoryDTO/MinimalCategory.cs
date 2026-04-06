using finance_api.Middleware.Enum;

namespace finance_api.Model.DTO.CategoryDTO
{
    public class MinimalCategory
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Balance { get; set; }
        public CategoryType CategoryType { get; set; }
        public int TransactionsCount { get; set; }
    }
}
