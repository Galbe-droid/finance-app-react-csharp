using finance_api.Model.DTO.UserDTO;
using finance_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace finance_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("fixed")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService; 
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> login([FromBody]LoginUser login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            
            var token = await _authService.LoginAsync(login);

            if(token == null)
            {
                return Unauthorized();
            }

            var userInfo = await _authService.GetUserAsync(login.Login);

            return Ok(new { token, userInfo });
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> register([FromBody]RegisterUser register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _authService.RegisterAsync(register);

            if (!result.Sucess)
            {
                return BadRequest(new {errors = result.Errors});
            }

            return Ok();
        }
        [Authorize]
        [HttpPut]
        [Route("updateName/{id:guid}")]
        public async Task<IActionResult> updateName(Guid id, [FromBody]UpdateName name)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _authService.ChangeNameAsync(name, id);

            if(result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }
        [Authorize]
        [HttpPut]
        [Route("updatePassword/{id:guid}")]
        public async Task<IActionResult> updatePassword(Guid id, [FromBody]UpdatePassword password)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _authService.ChangePasswordAsync(password, id);

            if (!result)
            {
                return BadRequest();
            } 
            
            return Ok();
        }
        [Authorize]
        [HttpPut]
        [Route("updateEmail/{id:guid}")]
        public async Task<IActionResult> updateEmail(Guid id, [FromBody]UpdateEmail email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.ChangeEmailAsync(email, id);

            if (result == null)
            {
                return BadRequest();
            }
            return Ok(result);
        }
        [Authorize] 
        [HttpPut]
        [Route("updateUsername/{id:guid}")]
        public async Task<IActionResult> updateLogin(Guid id, [FromBody]UpdateUsername username)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.ChangeUsernameAsync(username, id);
            if (result == null)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{id:guid}")]
        public async Task<IActionResult> delete(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _authService.DeleteUserAsync(id);

            if (!result)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
