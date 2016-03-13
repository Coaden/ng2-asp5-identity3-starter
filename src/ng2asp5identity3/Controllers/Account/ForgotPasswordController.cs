using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;


namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class ForgotPasswordController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public ForgotPasswordController(
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
            _logger = loggerFactory.CreateLogger<ForgotPasswordController>();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByNameAsync(model.Email);
                    if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                    {
                        // Don't reveal that the user does not exist or is not confirmed
                        return Json(new { success = true, msg = "Go to Forgot Password Confirmation." });
                    }

                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);

                    var callbackUrl = HttpContext.Request.IsHttps ? "https://" : "http://";
                    callbackUrl += HttpContext.Request.Host;
                    callbackUrl += "/#/reset-password?userId=" + user.Id + "&code=" + WebUtility.UrlEncode(code);

                    //TODO: Setup a nicer email here
                    await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                       "Please reset your password by clicking here: <a href=\"" + callbackUrl + "\">link</a>");
                    return Json(new { success = true, msg = "Go to Forgot Password Confirmation." });
                }

                return Json(new { success = false, msg = "You entered an invalid email." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }
    }
}
