# ng2-asp5-identity3-app-starter

###This is an application skeleton incorperating the basics needed to build a full Angular2 application based on Microsoft's vNext technology.

####Angular2 client, VS2015/ASP.NET 5 and Identity v3 Membership integration with ng-semantic/semantic-ui.

## A couple of things to note after you clone the project to get it up and running.

1.) You will need to make sure you have ASP.NET 5 installed and upgraded to v1.0.0-rc1-update1. [You can get the latest ASP.NET 5 install from ASP.NET](http://docs.asp.net/en/latest/getting-started/installing-on-windows.html)

2.) Open the .sln file in VS 2015.  You will notice the node.js dependencies being restored. (The "Dependencies" folder will say "Restoring...")  Wait for this to finish.

3.) From the menu, open Views->Other Windows->Task Runner Explorer.  This will display the options in the gulpfile.js file.  You may need to refresh, or restart Visual Studio.  You will need to run 2 commands to get going by double clicking on the options in the Tasks area.  First, run copy:libs, after that finishes, run build:all.  These copy all the needed node_module files to the public www-root folder and build the .js and .map files.

4.) In order to use the membership system you need to configure you SMTP settings in appsettings.json, appsettings.development.json and appsettings.release.json.  For more information on configuration in ASP.NET 5 see [this article](http://coaden.net/blog/2016/02/28/application-configuration-in-asp-net-5-mv6-vnext/).

5.) Run the project, open a browser and navigate to http://localhost:62046.

This should get you running, expect more documentation to follow in the weeks to come.

