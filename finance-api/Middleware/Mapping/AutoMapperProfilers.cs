using AutoMapper;
using finance_api.Model;
using finance_api.Model.DTO.CategoryDTO;
using finance_api.Model.DTO.TransactionDTO;
using finance_api.Model.DTO.UserDTO;

namespace finance_api.Middleware.Mapping
{
    public class AutoMapperProfilers : Profile
    {
        public AutoMapperProfilers()
        {
            CreateMap<CreateTransaction, Transaction>();
            CreateMap<UpdateTransaction, Transaction>();
            CreateMap<CreateCategory, Category>();
            CreateMap<UpdateCategory, Category>();

            CreateMap<Transaction, MininalTransaction>();
            CreateMap<Transaction, ReturnTransaction>();
            CreateMap<Category, MinimalCategory>();
            CreateMap<Category, ReturnCategory>();

            CreateMap<User, UserInfo>();
        }
    }
}
