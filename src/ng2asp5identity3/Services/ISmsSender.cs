using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng2asp5identity3.Services
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
