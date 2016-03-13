using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng2asp5identity3.ViewModels.Account
{
    public class UserInfoViewModel
    {
        public Boolean LoggedIn { get; set; }
        public String Email { get; set; }
        public Boolean EmailConfirmed { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Company { get; set; }
        public String Phone { get; set; }
        public List<String> Roles { get; set; }

        public UserInfoViewModel( bool loggedIn)
        {
            this.LoggedIn = loggedIn;

            this.Email = "";
            this.EmailConfirmed = false;
            this.FirstName = "";
            this.LastName = "";
            this.Company = "";
            this.Phone = "";
        }
    }
}