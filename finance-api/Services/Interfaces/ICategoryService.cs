using finance_api.Model;
using finance_api.Model.DTO.CategoryDTO;

namespace finance_api.Services.Interfaces
{
    public interface ICategoryService
    {
        public Task<List<ReturnCategory>> GetAllAsync(Guid userId);
        public Task<List<MinimalCategory>> GetAllMinmalAsync(Guid userId);
        public Task<ReturnCategory> GetByIdAsync(Guid id, Guid userId);
        public Task<ReturnCategory> CreateCategoryAsync(CreateCategory create, Guid userId);
        public Task<bool> UpdateCategory(Guid categoryId, UpdateCategory update, Guid userId);
        public Task<bool> DeleteCategoryAsync(Guid categoryId, Guid userId);
    }
}
