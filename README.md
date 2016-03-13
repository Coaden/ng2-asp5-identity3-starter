# ng2-asp5-identity3-app-skeleton
Angular2 client-side, Running in VS2015 using ASP.NET 5 and Identity v3 - W/ Identity v3 Membership integration.

## A couple of things to note after you clone the project to get it up and running.

1.) You will need to make sure you have ASP.NET 5 installed and DNX upgraded to v1.0.0-rc1-update1. [You can get the latest ASP.NET 5 install from ASP.NET](http://docs.asp.net/en/latest/getting-started/installing-on-windows.html)

2.) Open the .sln file in VS 2015.  You will notice the node.js dependencies being restored. (The "Dependencies" folder will say "restoring")  Wait for this to finish.  Note: If you have difficulties here, close Visual Studio, delete the project.json.lock file in the project directory, and restart.

3.) From the menu, open Views->Other Windows->Task Runner Explorer.  This will display the options in the gulp.js file.  You will need to run 2 commands to get going.  First, run copy:libs, after that finishes, run build:all.  These copy all the needed explosed node_module files to the public www-root folder and build the .js and .map files.

4.) Run the project, open a browser and navigate to http://localhost:62046.

This should get you running, expect more documentation to follow in the weeks to come.

