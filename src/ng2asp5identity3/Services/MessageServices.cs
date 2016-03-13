using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ng2asp5identity3.OptionModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.OptionsModel;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using MimeKit.Utils;

namespace ng2asp5identity3.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        private readonly IOptions<SmtpOptions> _smtpOptions;

        public AuthMessageSender(IOptions<SmtpOptions> smtpOptions)
        {
            _smtpOptions = smtpOptions;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            // use SMTP here to send an email.
            var host = _smtpOptions.Value.Host;
            var port = _smtpOptions.Value.Port;
            var userName = _smtpOptions.Value.UserName;
            var password = _smtpOptions.Value.Password;
            var fromName = _smtpOptions.Value.FromName;
            var fromAddress = _smtpOptions.Value.FromAddress;
            var deliverMethod = _smtpOptions.Value.DeliveryMethod;
            var defaultCredentials = _smtpOptions.Value.DefaultCredentials;
            var enableSsl = _smtpOptions.Value.EnableSsl;

            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress(fromName, fromAddress));
            msg.To.Add(new MailboxAddress(email, email));
            msg.Subject = subject;

            var builder = new BodyBuilder();

            //for reference on building the message body with MimeKit/MailKit see: http://www.mimekit.net/docs/html/CreatingMessages.htm

            // Set the plain-text version of the message text
            builder.TextBody = "";

            // Set the html version of the message text
            builder.HtmlBody = string.Format(message);

            // Now we just need to set the message body and we're done
            msg.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                // Connect to the server
                client.Connect(host, port, enableSsl);

                // Note: since we don't have an OAuth2 token, disable
                // the XOAUTH2 authentication mechanism.
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                // Note: only needed if the SMTP server requires authentication
                client.Authenticate(userName, password);

                client.Send(msg);
                client.Disconnect(true);
            }

            return Task.FromResult(0);
        }
        
        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
