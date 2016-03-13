using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng2asp5identity3.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
