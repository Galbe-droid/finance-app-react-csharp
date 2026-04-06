using AutoMapper;
using finance_api.Model;
using finance_api.Model.DTO.UserDTO;
using finance_api.Repositories;
using finance_api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace finance_api.Services
{
    public class AuthService : IAuthService
    {
        private readonly JwtService _jwt;
        private readonly PasswordHasher<User> _hasher;
        private readonly FinanceDBContext _financeDBContext;
        private readonly IMapper _mapper;

        public AuthService(JwtService jwt, FinanceDBContext financeDBContext, IMapper mapper)
        {
            _jwt = jwt;
            _hasher = new PasswordHasher<User>();
            _financeDBContext = financeDBContext;
            _mapper = mapper;
        }

        public async Task<string?> LoginAsync(LoginUser login)
        {
            var user = await _financeDBContext.Users.FirstOrDefaultAsync(u => u.Username == login.Login);
            
            if (login.Login.Contains('@') && user == null)
            {
                user = await _financeDBContext.Users.FirstOrDefaultAsync(u => u.Email == login.Login);
            }

            if(user == null)
            {
                return null;
            }

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);

            if(result == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return _jwt.GenerateToken(user);
        }

        public async Task<(bool Sucess, object? Errors)> RegisterAsync(RegisterUser register)
        {
            var errors = new Dictionary<string, string>();

            if (await _financeDBContext.Users.AnyAsync(x => x.Username == register.Username))
                errors["username"] = "Username ja existe";

            if (await _financeDBContext.Users.AnyAsync(x => x.Email == register.Email))
                errors["email"] = "Email ja existe";           

            if(errors.Any())
                return (false, errors);

            var user = new User
            {
                Email = register.Email,
                Username = register.Username,
                Name = register.Name
            };

            user.PasswordHash = _hasher.HashPassword(user, register.Password);

            _financeDBContext.Users.Add(user);

            await _financeDBContext.SaveChangesAsync();

            return (true, null);
        }

        public async Task<UserInfo> GetUserAsync(string username)
        {
            var user = await _financeDBContext.Users.FirstOrDefaultAsync(u => u.Username == username || u.Email == username) ?? throw new ArgumentException("User not found");

            UserInfo info = new()
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Name = user.Name,
            };

            return info;
        }

        public async Task<UserInfo> ChangeNameAsync(UpdateName name, Guid userId)
        {
            _financeDBContext.CurrentUserId = userId;

            var user = await _financeDBContext.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");

            user.Name = name.Name;

            await _financeDBContext.SaveChangesAsync();

            UserInfo info = new();
            _mapper.Map(user, info);

            return info;
        }

        public async Task<bool> ChangePasswordAsync(UpdatePassword password, Guid userId)
        {
            _financeDBContext.CurrentUserId = userId;

            var user = await _financeDBContext.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password.ConfirmPassword);

            if(result == PasswordVerificationResult.Failed)
            {
                return false;
            }

            user.PasswordHash = _hasher.HashPassword(user, password.NewPassword);

            await _financeDBContext.SaveChangesAsync();

            return true;
        }

        public async Task<UserInfo> ChangeEmailAsync(UpdateEmail email, Guid userId)
        {
            _financeDBContext.CurrentUserId = userId;
            var user = await _financeDBContext.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");

            bool exists = await _financeDBContext.Users.AnyAsync(x => x.Email == email.NewEmail);

            if (exists)
            {
                throw new ArgumentException("Email exists");
            }

            user.Email = email.NewEmail;

            await _financeDBContext.SaveChangesAsync();

            UserInfo info = new();

            _mapper.Map(user, info);

            return info;
        }

        public async Task<UserInfo> ChangeUsernameAsync(UpdateUsername username, Guid userId)
        {
            _financeDBContext.CurrentUserId = userId;
            var user = await _financeDBContext.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");
            bool exists = await _financeDBContext.Users.AnyAsync(x => x.Username == username.NewUsername);
            
            if (exists)
            {
                throw new ArgumentException("Username exists");
            }

            user.Username = username.NewUsername;
            await _financeDBContext.SaveChangesAsync();
            UserInfo info = new();
            _mapper.Map(user, info);
            return info;
        }

        public async Task<bool> DeleteUserAsync(Guid id) 
        {
            _financeDBContext.CurrentUserId = id;
            var user = await _financeDBContext.Users.FindAsync(id) ?? throw new ArgumentException("User not found");

            user.IsDeleted = true;

            await _financeDBContext.SaveChangesAsync();

            return true;
        }
    }
}
