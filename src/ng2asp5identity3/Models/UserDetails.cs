using System;
using System.Collections.Generic;
using ng2asp5identity3.Models;

namespace ng2asp5identity3.Models
{
    public partial class UserDetails
    {
        public int UserDetailId { get; set; }
        public bool Active { get; set; }
        public string Company { get; set; }
        public DateTime? DateMarkedInactive { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MarkedInactiveByUserID { get; set; }
        public string Phone { get; set; }
        public string UserID { get; set; }

        public virtual ApplicationUser User { get; set; }
    }
}
