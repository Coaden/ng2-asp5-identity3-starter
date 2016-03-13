using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;
using System;
using System.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class RegisterController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public RegisterController(
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
            _logger = loggerFactory.CreateLogger<RegisterController>();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = new ApplicationUser {UserName = model.Email, Email = model.Email};
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                        // Send an email with this link
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var callbackUrl = Url.Action("ConfirmEmail", "ConfirmEmail", new {userId = user.Id, code = code},
                            protocol: HttpContext.Request.Scheme);
                        await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                            "Please confirm your account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>");
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        _logger.LogInformation(3, "User created a new account with password.");

                        return Json(new {success = true, msg = "User created a new account with password."});
                    }
                    
                    // If we got this far, something failed, redisplay form
                    var errorMsg = result.Errors.First().Description;
                    return Json(new { success = false, msg = errorMsg });
                }
                return Json(new { success = false, msg = "Unknown Error" });
            }
            catch (Exception ex)
            {
                return Json(new {success = false, msg = ex.ToString()});
            }
        }
    }
}