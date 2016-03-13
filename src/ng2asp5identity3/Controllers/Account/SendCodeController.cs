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

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class SendCodeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public SendCodeController(
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
            _logger = loggerFactory.CreateLogger<SendCodeController>();
        }

        //
        // GET: /Account/SendCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> SendCode(string returnUrl = null, bool rememberMe = false)
        {
            try
            {
                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (user == null)
                {
                    return Json(new { success = false, msg = "No user." });
                }
                var userFactors = await _userManager.GetValidTwoFactorProvidersAsync(user);
                var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
                return Json(new { success = true, msg = "Two factor options.", options = factorOptions });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SendCode(SendCodeViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, msg = "Invalid model." });
                }

                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (user == null)
                {
                    return Json(new { success = false, msg = "No user." });
                }

                // Generate the token and send it
                var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
                if (string.IsNullOrWhiteSpace(code))
                {
                    return Json(new { success = false, msg = "No code." });
                }

                var message = "Your security code is: " + code;
                if (model.SelectedProvider == "Email")
                {
                    await _emailSender.SendEmailAsync(await _userManager.GetEmailAsync(user), "Security Code", message);
                }
                else if (model.SelectedProvider == "Phone")
                {
                    await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);
                }
                return Json(new { success = true, msg = "Code sent.", pvdr = model.SelectedProvider });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }
    }
}
