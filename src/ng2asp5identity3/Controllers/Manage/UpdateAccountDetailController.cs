using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;
using System.Linq;
using Microsoft.AspNet.Mvc.Rendering;
using ng2asp5identity3.ViewModels.Manage;
using System.Security.Claims;
using ng2asp5identity3.Controllers.Account;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UpdateAccountDetailController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;
        
        public UpdateAccountDetailController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<UpdateAccountDetailController>();
        }

        //
        // POST: /Manage/ChangePassword
        [HttpPost]
        public async Task<IActionResult> UpdateAccountDetail([FromBody] UpdateAccountDetailViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, msg = "Invalid model" });
                }
                var user = await GetCurrentUserAsync();
                if (user != null)
                {
                    var result = await UpdateAccount(user, model);
                    if (result == true)
                    {
                        _logger.LogInformation(3, "User updated their account detail successfully.");
                        return Json(new { success = true, msg = "Account detail changed." });
                    }

                    return Json(new { success = false, msg = "Error updating account detail." });
                }

                return Json(new { success = false, msg = "No user found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.Message });
            }
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        public enum ManageMessageId
        {
            AddPhoneSuccess,
            AddLoginSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

        private async Task<ApplicationUser> GetCurrentUserAsync()
        {
            return await _userManager.FindByIdAsync(HttpContext.User.GetUserId());
        }

        private async Task<Boolean> UpdateAccount(ApplicationUser user, UpdateAccountDetailViewModel model)
        {
            try
            {
                var userDetail = _dbContext.UserDetails.FirstOrDefault<UserDetails>(ud => ud.UserID == user.Id && ud.Active);

                if (userDetail == null)
                {
                    userDetail = new UserDetails();
                    userDetail.Active = true;
                    userDetail.UserID = user.Id;
                    userDetail.FirstName = model.FirstName;
                    userDetail.LastName = model.LastName;
                    userDetail.Company = model.Company;
                    userDetail.Phone = model.Phone;
                    _dbContext.UserDetails.Add(userDetail);
                }
                else
                {
                    userDetail.FirstName = model.FirstName;
                    userDetail.LastName = model.LastName;
                    userDetail.Company = model.Company;
                    userDetail.Phone = model.Phone;
                }
                await _dbContext.SaveChangesAsync();
                return true;

            }
            catch(Exception)
            {
                return false;
            }
        }

        #endregion
    }
}