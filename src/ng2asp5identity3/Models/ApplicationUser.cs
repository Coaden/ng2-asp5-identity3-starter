using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ng2asp5identity3.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<UserDetails> UserDetails { get; set; }
        public virtual ICollection<UserLog> UserLog { get; set; }
    }
}
