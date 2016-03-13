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
    public class EnableTwoFactorAuthenticationController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public EnableTwoFactorAuthenticationController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<EnableTwoFactorAuthenticationController>();
        }

        //
        // POST: /Manage/EnableTwoFactorAuthentication
        [HttpPost]
        public async Task<IActionResult> EnableTwoFactorAuthentication()
        {
            try
            {
                var user = await GetCurrentUserAsync();
                if (user != null)
                {
                    await _userManager.SetTwoFactorEnabledAsync(user, true);
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    _logger.LogInformation(1, "User enabled two-factor authentication.");
                }
                //return RedirectToAction("Index", "Manage");
                return Json(new { success = true, msg = "Enabled." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
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

        #endregion
    }
}