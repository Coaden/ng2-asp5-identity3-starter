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
    public class VerifyPhoneNumberController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public VerifyPhoneNumberController(
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
            _logger = loggerFactory.CreateLogger<VerifyPhoneNumberController>();
        }

        //
        // GET: /Manage/VerifyPhoneNumber
        [HttpGet]
        public async Task<IActionResult> VerifyPhoneNumber(string phoneNumber)
        {
            var code = await _userManager.GenerateChangePhoneNumberTokenAsync(await GetCurrentUserAsync(), phoneNumber);
            // Send an SMS to verify the phone number
            //return phoneNumber == null ? View("Error") : View(new VerifyPhoneNumberViewModel { PhoneNumber = phoneNumber });
            // TODO: build URL with code.
            return Json(new { success = true, msg = "Just put this here, need to build url with code." });
        }

        //
        // POST: /Manage/VerifyPhoneNumber
        [HttpPost]
        public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneNumberViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, msg = "Model is invalid." });
                }
                var user = await GetCurrentUserAsync();
                if (user != null)
                {
                    var result = await _userManager.ChangePhoneNumberAsync(user, model.PhoneNumber, model.Code);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return Json(new { success = true, msg = "Phone number verified." });
                    }
                }
                // If we got this far, something failed, redisplay the form
                ModelState.AddModelError(string.Empty, "Failed to verify phone number");
                return Json(new { success = false, msg = "Error verifying number." });
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