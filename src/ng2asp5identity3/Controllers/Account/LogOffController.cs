using System;
using System.Threading.Tasks;
using ng2asp5identity3.Models;
using ng2asp5identity3.Services;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class LogOffController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public LogOffController(
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
            _logger = loggerFactory.CreateLogger<LogOffController>();
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        public async Task<IActionResult> LogOff()
        {
            var test = User.Identity.Name;
            
            try
            {
                await _signInManager.SignOutAsync();
                _logger.LogInformation(4, "User logged out.");
                return Json(new { success = true, msg = "User logged out." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.ToString() });
            }
        }
    }
}
