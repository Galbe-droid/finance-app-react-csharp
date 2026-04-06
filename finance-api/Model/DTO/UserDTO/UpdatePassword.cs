using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.UserDTO
{
    public class UpdatePassword
    {
        [Required]
        [PasswordPropertyText]
        [MinLength(6, ErrorMessage = "Password has to be minimum of six characters")]
        public string ConfirmPassword { get; set; } = string.Empty;
        [Required]
        [PasswordPropertyText]
        [MinLength(6, ErrorMessage = "Password has to be minimum of six characters")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
