using finance_api.Model.DTO.TransactionDTO;
using finance_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace finance_api.Controllers
{    
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            Console.WriteLine(User.Identity?.IsAuthenticated);
            return Ok(await _transactionService.GetAllAsync(Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpGet]
        [Route("minimal")]
        public async Task<IActionResult> GetAllMinimal()
        {
            return Ok(await _transactionService.GetAllMinimalAsync(Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return Ok(await _transactionService.GetByIdAsync(id, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateTransaction([FromBody]CreateTransaction create)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return Ok(await _transactionService.CreateTransaction(create, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpPut]
        [Route("update/{id:guid}")]
        public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody]UpdateTransaction update)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            return Ok(await _transactionService.UpdateTransaction(id, update, userId));
        }
        [Authorize]
        [HttpDelete]
        [Route("delete/{id:guid}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            return Ok(await _transactionService.DeleteTransaction(id, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
    }
}
