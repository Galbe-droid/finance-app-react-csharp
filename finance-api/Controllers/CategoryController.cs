using finance_api.Model.DTO.CategoryDTO;
using finance_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace finance_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _categoryService.GetAllAsync(Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpGet]
        [Route("minimal")]
        public async Task<IActionResult> GetAllMinimal()
        {
            return Ok(await _categoryService.GetAllMinmalAsync(Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }

        [Authorize]
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _categoryService.GetByIdAsync(id ,Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }

        [Authorize]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateCategory([FromBody]CreateCategory create)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var category = await _categoryService.CreateCategoryAsync(create, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));

            return Ok(category);
        }
        [Authorize]
        [HttpPut]
        [Route("update/{id:guid}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody]UpdateCategory update)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return Ok(await _categoryService.UpdateCategory(id, update, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
        [Authorize]
        [HttpDelete]
        [Route("delete/{id:guid}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            return Ok(await _categoryService.DeleteCategoryAsync(id, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        }
    }
}
