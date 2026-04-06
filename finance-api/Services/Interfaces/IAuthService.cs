using finance_api.Model.DTO.UserDTO;

namespace finance_api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Sucess, object? Errors)> RegisterAsync(RegisterUser register);
        Task<string?> LoginAsync(LoginUser login);
        Task<UserInfo> GetUserAsync(string username);
        Task<UserInfo> ChangeNameAsync(UpdateName name, Guid userId);
        Task<UserInfo> ChangeEmailAsync(UpdateEmail email, Guid userId);
        Task<UserInfo> ChangeUsernameAsync(UpdateUsername username, Guid userId);
        Task<bool> ChangePasswordAsync(UpdatePassword password, Guid userId);
        Task<bool> DeleteUserAsync(Guid userId);
    }
}
