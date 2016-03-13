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
    public class ManageLoginsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public ManageLoginsController(
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
            _logger = loggerFactory.CreateLogger<ManageLoginsController>();
        }

        //GET: /Manage/ManageLogins
        [HttpGet]
        public async Task<IActionResult> ManageLogins(ManageMessageId? message = null)
        {
            try
            {
                ViewData["StatusMessage"] =
                message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : message == ManageMessageId.AddLoginSuccess ? "The external login was added."
                : message == ManageMessageId.Error ? "An error has occurred."
                : "";
                var user = await GetCurrentUserAsync();
                if (user == null)
                {
                    return Json(new { success = false, msg = "No user." });
                }
                var userLogins = await _userManager.GetLoginsAsync(user);
                var otherLogins = _signInManager.GetExternalAuthenticationSchemes().Where(auth => userLogins.All(ul => auth.AuthenticationScheme != ul.LoginProvider)).ToList();
                ViewData["ShowRemoveButton"] = user.PasswordHash != null || userLogins.Count > 1;
                //return View(new ManageLoginsViewModel
                //{
                //    CurrentLogins = userLogins,
                //    OtherLogins = otherLogins
                //});
                return Json(new { success = true, msg = "Manage Logins." });
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