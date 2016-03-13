using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ng2asp5identity3.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using ng2asp5identity3.Services;
using ng2asp5identity3.ViewModels.Account;
using Microsoft.AspNet.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ng2asp5identity3.Controllers.Account
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserInfoController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public UserInfoController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<UpdateAccountDetailController>();
        }

        [HttpGet]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UserInfo()
        {
            try
            {
                bool isAuthenticated = User.Identity.IsAuthenticated;
                if (!isAuthenticated)
                {
                    return new ObjectResult(new UserInfoViewModel(false));
                }

                var userEmail = User.Identity.Name;
                var user = await _userManager.FindByNameAsync(userEmail);

                if (user == null)
                {
                    return new ObjectResult(new UserInfoViewModel(false));
                }


                var userInfo = new UserInfoViewModel(true)
                {
                    Email = user.UserName,
                    EmailConfirmed = await _userManager.IsEmailConfirmedAsync(user)
                };

                var userDetails = _dbContext.UserDetails.SingleOrDefault(ud => ud.UserID == user.Id);
                if (userDetails != null)
                {
                    userInfo.FirstName = userDetails.FirstName;
                    userInfo.LastName = userDetails.LastName;
                    userInfo.Company = userDetails.Company;
                    userInfo.Phone = userDetails.Phone;
                }

                userInfo.Roles = new List<string>(await _userManager.GetRolesAsync(user));

                return new ObjectResult(userInfo);
            }
            catch (Exception)
            {
                return new ObjectResult(new UserInfoViewModel(false));
            }
        }
    }
}
