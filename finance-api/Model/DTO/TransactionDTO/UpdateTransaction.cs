using finance_api.Middleware.Enum;
using System.ComponentModel.DataAnnotations;

namespace finance_api.Model.DTO.TransactionDTO
{
    public class UpdateTransaction
    {
        [Required]
        [MinLength(3, ErrorMessage = "Title has to be minimum of three characters")]
        [MaxLength(30, ErrorMessage = "Title has to be maximum of thirty characters")]
        public required string Title { get; set; }
        [MaxLength(100, ErrorMessage = "Description has to be maximum of one hundred characters")]
        public string? Description { get; set; }
        [Required]
        public decimal Amount { get; set; }
        public DateTimeOffset Date { get; set; } = DateTimeOffset.Now;
        [Required]
        public TransactionType TransactionType { get; set; }
        [Required]
        public SourceType Source { get; set; }
        [MaxLength(20, ErrorMessage = "SourceName has to be maximum of ten characters")]
        public string? SourceName { get; set; }
        [MaxLength(100, ErrorMessage = "SourceDescription has to be maximum of one hundred characters")]
        public string? SourceDescription { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
