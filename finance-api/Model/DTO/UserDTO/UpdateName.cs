using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.UserDTO
{
    public class UpdateName
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
