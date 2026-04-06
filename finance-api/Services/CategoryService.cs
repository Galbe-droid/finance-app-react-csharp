using AutoMapper;
using finance_api.Middleware.Enum;
using finance_api.Model;
using finance_api.Model.DTO.CategoryDTO;
using finance_api.Model.DTO.TransactionDTO;
using finance_api.Repositories;
using finance_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace finance_api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly FinanceDBContext _dbContext;

        public CategoryService(IMapper mapper, FinanceDBContext dBContext)
        {
            _mapper = mapper;
            _dbContext = dBContext;
        }

        public async Task<List<ReturnCategory>> GetAllAsync(Guid userId)
        {
            List<ReturnCategory> returnCategoryList = new();
            _dbContext.CurrentUserId = userId;
            var categoryList = await _dbContext.Categories.ToListAsync();

            foreach(Category category in categoryList)
            {
                ReturnCategory returnCategory = new();
                returnCategory = await UpdateValues(category);
                returnCategoryList.Add(returnCategory);
            }

            return returnCategoryList;
        }
        public async Task<List<MinimalCategory>> GetAllMinmalAsync(Guid userId)
        {
            List<MinimalCategory> minimalCategoryList = new();
            _dbContext.CurrentUserId = userId;
            var categoryList = await _dbContext.Categories.ToListAsync();

            foreach (Category category in categoryList)
            {
                MinimalCategory minimal = new();
                minimal = _mapper.Map(category, minimal);

                minimal.TotalAmount = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id)
                    .SumAsync(t => t.Amount);

                minimal.Balance = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id)
                    .SumAsync(t => t.TransactionType == TransactionType.Income ? t.Amount : -t.Amount);
                
                minimal.TransactionsCount = _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id)
                    .Count();

                minimalCategoryList.Add(minimal);
            }

            return minimalCategoryList;
        }
        public async Task<ReturnCategory> GetByIdAsync(Guid id, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            ReturnCategory returnCategory = new();
            var category = await _dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId) ?? throw new ArgumentException("Category not found");

            returnCategory = ConvertToReturnCategory(category);

            return returnCategory;
        }
        public async Task<ReturnCategory> CreateCategoryAsync(CreateCategory create, Guid userId)
        {
            if (String.IsNullOrEmpty(create.Title))
            {
                throw new ArgumentException("Title is required");
            }

            _dbContext.CurrentUserId = userId;
            ReturnCategory returnCategory = new();
            var category = _mapper.Map<Category>(create);
            category.UserId = userId;
            category.User = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new ArgumentException("User not found");

            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();
            returnCategory = ConvertToReturnCategory(category);

            return returnCategory;
        }
        public async Task<bool> UpdateCategory(Guid categoryId, UpdateCategory update, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            var existentCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId) ?? throw new ArgumentException("Category not found");

            _mapper.Map(update, existentCategory);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteCategoryAsync(Guid categoryId, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            var existentCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == categoryId) ?? throw new ArgumentException("Category not found");

            await _dbContext.transactions.Where(t => t.UserId == userId && t.CategoryId == existentCategory.Id)
                                         .ExecuteUpdateAsync(setter => setter.SetProperty(x => x.CategoryId, (Guid?)null));
            existentCategory.isDeleted = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private ReturnCategory ConvertToReturnCategory(Category category)
        {
            ReturnCategory returnCategory = new();
            int transactionCount = _dbContext.transactions.Where(t => t.CategoryId == category.Id).Count();

            if (transactionCount == 0)
            {
                _mapper.Map(category, returnCategory);
                return returnCategory;
            }

            returnCategory = _mapper.Map(category, returnCategory);

            return returnCategory;
        }

        private async Task<ReturnCategory> UpdateValues(Category category)
        {
            category.TotalAmount = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id)
                    .SumAsync(t => t.Amount);
            category.Balance = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id)
                    .SumAsync(t => t.TransactionType == TransactionType.Income ? t.Amount : -t.Amount);
            category.CategoryCondition();
            category.Income = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id && t.TransactionType == TransactionType.Income)
                    .SumAsync(t => t.Amount);
            category.Expense = await _dbContext.transactions
                    .Where(t => t.CategoryId == category.Id && t.TransactionType == TransactionType.Expense)
                    .SumAsync(t => -t.Amount);


            await _dbContext.SaveChangesAsync();

            ReturnCategory returnCategory = new();
            returnCategory = ConvertToReturnCategory(category);

            return returnCategory;
        }
    }
}
