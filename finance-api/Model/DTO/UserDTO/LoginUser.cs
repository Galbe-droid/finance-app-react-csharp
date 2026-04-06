using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.UserDTO
{
    public class LoginUser
    {
        [Required]
        public string Login { get; set; }
        [Required]
        [PasswordPropertyText]
        public string Password { get; set; }
    }
}
