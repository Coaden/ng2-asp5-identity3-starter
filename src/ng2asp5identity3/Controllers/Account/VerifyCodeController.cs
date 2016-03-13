using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class VerifyCodeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public VerifyCodeController(
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
            _logger = loggerFactory.CreateLogger<VerifyCodeController>();
        }

        //
        // GET: /Account/VerifyCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCode(string provider, bool rememberMe, string returnUrl = null)
        {
            try
            {
                // Require that the user has already logged in via username/password or external login
                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (user == null)
                {
                    return Json(new { success = false, msg = "No user." });
                }
                return Json(new { success = true, msg = "Provider verified.", pvdr = provider });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, msg = "Invalid model." });
                }

                // The following code protects for brute force attacks against the two factor codes.
                // If a user enters incorrect codes for a specified amount of time then the user account
                // will be locked out for a specified amount of time.
                var result = await _signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe, model.RememberBrowser);
                if (result.Succeeded)
                {
                    return Json(new { success = true, msg = "Code verified." });
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning(7, "User account locked out.");
                    return Json(new { success = false, msg = "User account locked out." });
                }
                else
                {
                    ModelState.AddModelError("", "Invalid code.");
                    return Json(new { success = false, msg = "Invalid code." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }
    }
}
