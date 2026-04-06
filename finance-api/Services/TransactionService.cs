using AutoMapper;
using finance_api.Model;
using finance_api.Model.DTO.TransactionDTO;
using finance_api.Repositories;
using finance_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace finance_api.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IMapper _mapper;
        private readonly FinanceDBContext _dbContext;

        public TransactionService(IMapper mapper, FinanceDBContext dBContext)
        {
            _mapper = mapper;
            _dbContext = dBContext;
        }

        public async Task<List<ReturnTransaction>> GetAllAsync(Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            List<ReturnTransaction> returnTransactionList = new();
            var transactionList = await _dbContext.transactions.AsNoTracking().ToListAsync();

            foreach(Transaction transaction in transactionList)
            {
                ReturnTransaction returnTransaction = new();
                returnTransaction.CategoryName = CheckForCategory(transaction);
                returnTransactionList.Add(_mapper.Map(transaction, returnTransaction));
            }

            return returnTransactionList;
        }
        public async Task<List<MininalTransaction>> GetAllMinimalAsync(Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            List<MininalTransaction> minimalTransactionList = new();
            var transactionList = await _dbContext.transactions.AsNoTracking().ToListAsync();

            foreach (Transaction transaction in transactionList)
            {
                MininalTransaction minimalTransaction = new();
                minimalTransaction.CategoryName = CheckForCategory(transaction);
                minimalTransactionList.Add(_mapper.Map(transaction, minimalTransaction));
            }

            return minimalTransactionList;
        }       
        public async Task<ReturnTransaction> GetByIdAsync(Guid id, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            ReturnTransaction returnTransaction = new();

            var transaction = await _dbContext.transactions.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId) ?? throw new ArgumentException("User not found");
            _mapper.Map(transaction, returnTransaction);

            return returnTransaction;
        }
        public async Task<ReturnTransaction> CreateTransaction(CreateTransaction create, Guid userId)
        {
            if (String.IsNullOrEmpty(create.Title))
            {
                throw new ArgumentException("Title is required");                
            }

            if (String.IsNullOrEmpty(create.SourceName) && create.Source == 0)
            {
                throw new ArgumentException("Source name is required if Source is other");
            }

            _dbContext.CurrentUserId = userId;

            var transaction = _mapper.Map<Transaction>(create);
            transaction.UserId = userId;
            transaction.User = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new ArgumentException("User not found");

            transaction.SourceNaming();

            _dbContext.transactions.Add(transaction);
            await _dbContext.SaveChangesAsync();

            ReturnTransaction returnTransaction = new();
            returnTransaction.CategoryName = CheckForCategory(transaction);
            _mapper.Map(transaction, returnTransaction);

            return returnTransaction;
        }
        public async Task<bool> UpdateTransaction(Guid transactionId, UpdateTransaction update, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            var transaction = await _dbContext.transactions.FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

            if(transaction == null)
            {
                return false;
            }

            _mapper.Map(update, transaction);
            transaction.SourceNaming();
            await _dbContext.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteTransaction(Guid id, Guid userId)
        {
            _dbContext.CurrentUserId = userId;
            var transaction = await _dbContext.transactions.FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return false;
            }

            transaction.isDeleted = true;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        private string CheckForCategory(Transaction transaction)
        {
            if (transaction.CategoryId == null)
            {
                return string.Empty;
            }

            if(transaction.Category == null)
            {
                transaction.Category = _dbContext.Categories.FirstOrDefault(c => c.Id == transaction.CategoryId) ?? throw new ArgumentException("Category not found");
            }

            return transaction.Category.Title;
        }
    }
}
