using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.UserDTO
{
    public class UpdateEmail
    {
        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }
    }
}
