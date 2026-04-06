namespace finance_api.Model
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public string Name { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
