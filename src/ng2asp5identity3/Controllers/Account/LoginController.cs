using System;
using System.Threading.Tasks;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public LoginController(
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
            _logger = loggerFactory.CreateLogger<LoginController>();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model, string returnUrl = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // This doesn't count login failures towards account lockout
                    // To enable password failures to trigger account lockout, set lockoutOnFailure: true

                    var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation(1, "User logged in.");
                        return Json(new { success = true, msg = "User logged in." });
                    }
                    if (result.RequiresTwoFactor)
                    {
                        //return RedirectToAction(nameof(SendCode), new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                        return Json(new { success = false, msg = "Two factor required." });
                    }
                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning(2, "User account locked out.");
                        return Json(new { success = false, msg = "User account locked out." });
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                        return Json(new { success = false, msg = "Invalid login attempt." });
                    }
                }

                // If we got this far, something failed, redisplay form
                return Json(new { success = false, msg = "Invalid login attempt." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }
    }
}
