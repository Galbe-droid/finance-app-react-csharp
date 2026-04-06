using finance_api.Middleware.Enum;
using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.CategoryDTO
{
    public class CreateCategory
    {
        [Required]
        [MinLength(3, ErrorMessage = "Title has to be minimum of three characters")]
        [MaxLength(30, ErrorMessage = "Title has to be maximum of thirty characters")]
        public string Title { get; set; }
        [MaxLength(150, ErrorMessage = "Description has to be maximum of thirty characters")]
        public string Description { get; set; } = string.Empty;
    }
}
