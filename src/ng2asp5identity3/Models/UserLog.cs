using System;
using System.Collections.Generic;
using ng2asp5identity3.Models;

namespace ng2asp5identity3.Models
{
    public partial class UserLog
    {
        public int UserLogID { get; set; }
        public string IPAddress { get; set; }
        public DateTime LoginDate { get; set; }
        public string UserID { get; set; }

        public virtual ApplicationUser User { get; set; }
    }
}
