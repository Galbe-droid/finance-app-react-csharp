using finance_api.Middleware.Enum;

namespace finance_api.Model
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; } = 0;
        public decimal Balance {  get; set; } = 0;
        public decimal Income { get; set; } = 0;
        public decimal Expense { get; set; } = 0;
        public CategoryType CategoryType { get; set; }

        public DateTimeOffset CreateAt { get; set; } = DateTimeOffset.UtcNow;
        public bool isDeleted { get; set; } = false;

        public Guid UserId { get; set; }    
        public User User { get; set; } = null!;

        public void CategoryCondition()
        {
            if(Balance >= 0)
            {
                CategoryType = CategoryType.Profit;
            }
            else
            {
                CategoryType = CategoryType.Debt;
            }
        }
    }
}
