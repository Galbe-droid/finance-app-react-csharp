namespace finance_api.Model.DTO.UserDTO
{
    public class UserInfo
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? Name { get; set; }
    }
}
