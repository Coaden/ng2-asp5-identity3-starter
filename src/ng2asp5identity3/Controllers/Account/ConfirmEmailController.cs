using System;
using System.Threading.Tasks;
using ng2asp5identity3.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;


namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class ConfirmEmailController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public ConfirmEmailController(
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
            _logger = loggerFactory.CreateLogger<ConfirmEmailController>();
        }

        //
        // GET: /Account/ConfirmEmail
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            try
            {
                if (userId == null || code == null)
                {
                    //return Json(new { success = false, msg = "No user or code." });
                    return Redirect("/#/membership-notification/089BB357-6A9D-4F6E-8305-275CEF3F0FF7");
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    //return Json(new { success = false, msg = "No user." });
                    return Redirect("/#/membership-notification/089BB357-6A9D-4F6E-8305-275CEF3F0FF7");
                }
                var result = await _userManager.ConfirmEmailAsync(user, code);

                if(!result.Succeeded)
                {
                    //return Json(new { success = false, msg = result.ToString() });
                    return Redirect("/#/membership-notification/089BB357-6A9D-4F6E-8305-275CEF3F0FF7");
                }

                await _signInManager.SignInAsync(user, isPersistent: false);
                return Redirect("/#/membership-notification/1FB1C0B0-B671-4EA1-8E88-5FE85095EBAA");
                                
            }
            catch (Exception)
            {
                //return Json(new { success = false, msg = "Unknown Error." });        
                return Redirect("/#/membership-notification/089BB357-6A9D-4F6E-8305-275CEF3F0FF7");
            }
        }
    }
}
