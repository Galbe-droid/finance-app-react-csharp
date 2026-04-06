using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.UserDTO
{
    public class UpdateUsername
    {
        [Required]
        [RegularExpression("^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers and underscore.")]
        [MinLength(5, ErrorMessage = "Username has to be minimum of five characters")]
        [MaxLength(18, ErrorMessage = "Username has to be maximum of eighteen characters")]
        public string NewUsername { get; set; }
    }
}
