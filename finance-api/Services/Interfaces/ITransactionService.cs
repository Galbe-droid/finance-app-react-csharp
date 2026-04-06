using finance_api.Model;
using finance_api.Model.DTO.TransactionDTO;

namespace finance_api.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<List<ReturnTransaction>> GetAllAsync(Guid userId);
        Task<List<MininalTransaction>> GetAllMinimalAsync(Guid userId);
        Task<ReturnTransaction> GetByIdAsync(Guid id, Guid userId);
        Task<ReturnTransaction> CreateTransaction(CreateTransaction create, Guid userId);
        Task<bool> UpdateTransaction(Guid transactionId, UpdateTransaction update, Guid userId);
        Task<bool> DeleteTransaction(Guid transactionId, Guid userId);
    }
}
