using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ng2asp5identity3.ViewModels.Manage
{
    public class UpdateAccountDetailViewModel
    {
        [Required]        
        [Display(Name = "FirstName")]
        public string FirstName { get; set; }

        [Required]
        [Display(Name = "LastName")]
        public string LastName { get; set; }

        [Required]
        [Display(Name = "Company")]
        public string Company { get; set; }

        [Required]
        [Display(Name = "Phone")]
        public string Phone { get; set; }

    }
}
