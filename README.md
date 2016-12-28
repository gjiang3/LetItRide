# LetItRide
Group web project creating a website for a service similar to Uber where customer can request rides to destination. 
Uses MySQL, HTML,  PHP and Javascript.

Coded by: Jimmy Kwong, Guohua Jiang, Ernest Ip and Pak Ho Ip

I. Introduction
Letitride is a new shuttle service in the Bay Area counties. (San Francisco, San Mateo, Santa Clara, Alameda, and Contra Costa) This service allows for registered sub-contracted driver to receive the next customer request for a drive to their destination.
 
II. Installation/Setup 
A simplified setup instruction video is posted here: https://www.youtube.com/watch?v=jnkaKFuq3Zs
a. 	Setting up Xampp:
-        Install XAMPP from the proper operating system in this page: https://www.apachefriends.org/download.html
-        Ensure Javascript is enabled in your browser 
-        Open XAMPP Control Panel, click [Start] buttons to start Apache server and MySQL database
-        Unzip project package: letitride.zip
-        Place the extracted content to overwrite the content of folder htdocs inside folder xampp. (Usually C:/xampp/htdocs).
-        Access http://localhost/phpmyadmin/ or click Admin on the MySQL 
-        Click on the “Import” tab
-        Under “File to Import,” click the “Choose File” button
-        Go to xampp/htdocs/SQL script in the computer
-        Select the earliest SQL file as stated from the file name and click open to return to PhpMyAdmin’s import page
-     In the import page, click ‘Go’ on the bottom of the page to execute the SQL script 
-     Repeat the process for the other SQL files from earliest to latest except for backup	
Alternatively import the All_In_One.sql to PHPMyAdmin to setup all the schemas and data at once
-        After the creation of the tables, set the password, “password” for the root user of the database. Assuming the user have never set a password for root access, Instructions can be found in: http://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html
Alternatively, on command line access the MySQL folder in your Xampp folder 
Use the cd command to navigate into the MySQL folder
Use cd command to navigate into bin. Should look something like this: C:\….\xampp\mysql\bin\ where … may be other directory that the user put the Xampp folders into
Type “mysql -u root” and press the enter key
Type in the query, “set password for ‘root’@’localhost’ = password(‘password’);”
Once query executed, type exit and press enter key to leave the MySQL console 
To reset the password, use command line to cd to the bin folder again.
Type in “mysql -u root -p” and press enter
Type in “password” when prompted for password and press enter
Type in the query, “set password for ‘root’@’localhost’ = password(‘’);” and press enter to reset the password to root
Type exit to leave the MySQL console
-        Access http://localhost/  or http://localhost/index.html in your browser to see the website
Note: Each browser on a single computer can only operated by one user at a time. In other words if there are two users, they mustn’t use a single internet browser(like Chrome) and have two different tabs, each tab belong to one of the user. 


III.         Navigation

a.  Homepage

The homepage of the Letitride webpage consist of an animation that follows your mouse or pointer, the “Let it ride” title, and a button to navigate to the register/login on the bottom of the page.
 
b.     Register/Login Page

The register and login page has two forms. The default form is the registration form. There are three section of the registration, name, email, and password. To register the user must fill in each field with at least one character, and then click the “Get Started” button. The webpage will display an error message if the requirement for each field is not met and refresh the page. Once successfully registered, there will be a message saying the user successfully registered. To access the form for login, click the login button on the top and the login form will be display. There will be two field on the login form, Email and Password. In order to login, the user must type in an email that has been registered as well as the correct password associated with it. If the user input an email not in the database or password not associated with the email, a message saying “Invalid login credential” will appear, and the page will refresh to the register form.
Requirement for Name is between 1 to 255 characters. 
Requirement for Email is 1 to 40 characters. 
Requirement for Password is 1 to 30 characters. 
Login information is not case sensitive.


c.     Additional information pages
There are two additional information pages. One is for the customer accounts which makes you input the credit card number in the text field.  The other is for driver accounts which makes you input the drivers license, license plate, car model, routing number, and bank account number. If fields are left empty and the user clicks continue, it will pop up an error saying that the fields are empty.  If the credit card number already exists in the Database, and you try to input that same number it will give the user a pop up message saying it already exists in the Database. Finally, it will check if there's already values inputted corresponding to the USER ID, and if there is, then the login button will skip the additional information pages and head straight to the driver home page / customer home page. 

 
d. Customer home page

 Customers can request a ride using customer home page. There are three ways that customers can enter a location, typing the exact address, entering a keyword, or clicking the map to pinpoint a location. Clicking the map when the switch turns to red will set the destination address in the destination field, while clicking the map when the switch turns to green will set the pick up location in the pick up location field. 
My location button can recenter the map to the customer current location.
Logout button would redirect back to the index page.  
Request a ride would send a request to the system searching for available driver. When the system find a driver, the driver’s info and estimated waiting time will display on the screen. If there is no available driver or no driver within 30 minutes of the pick up location, system will display a “driver not found” message.
Requirement :
Both pick up location and destination fields must be filled in in order to initiate a request, other wise, an error message will display. 
Once the system dispatch a diver, a driving simulation will begin. During this process, do not hit  go back, forward, or refresh. Do not overlay, minimize, or type links to another page. Doing any of the above might cause the simulation to halt. 
During simulation user must not close the browser
User can only exit the page by pressing the “Log out” button
User must not enter this page using the web address alone but through the Login(or additional customer info) page
User must not enter the address manually into the address bar on the page

e.     Customer’s Profile

The profile page for customers contains profile image, name, phone number, email, and credit card number. This page also allow users to change their passwords. Input validations are enforced in this page. 
Requirement:
Users must fill out all the information. 
Email must follow the email format. 
Phone number fields accepts only numeric number.
Credit card  fields accepts only numeric number,
 Changing password requests the inputs in both password and confirm password fields  match. 

f. Driver Homepage   
After logging in and have entered driver additional information, the user will arrived at the customer homepage. If at any time on this page, the browser ask for location service, the user must enable location detection in order for the website to service. If the user wants to sign out from the driver role, the driver can press the “sign out” button to return to the register/login page. If the driver is ready and will commit to wait for work, the driver may click the “Look For Customer” button on screen. After the driver press the button, the driver may not cancel their wait on the customer until a customer is found. Once a customer is found to match with the driver, a route will be plotted for the driver, showing where the route to the customer. At this point the buttons on the left should changed to only having “Confirm Pick Up” button. The “Confirm Pick Up” button should only be clickable when the driver has arrived at the customer pickup location. In the test version, a bot script to move along the path will appear and begin moving along the path to the destination. Once the driver arrive at the destination and have picked up the customer, the driver should press the “Confirm Pick Up” button. Then a “Confirm Ride End” button will appear in the place of “Confirm Pick Up” button and should only be press after driver has arrived at the customer’s destination. In the test version, once the button is pressed, a bot script to move along the path from customer pickup location to customer destination will appear and the bot will move along that path until it arrives at the customer destination. After the driver has arrived at the customer’s destination, the driver should press the “Confirm Ride End” button at that moment. Then the panels will be back to how it was when loaded into the driver homepage and the webpage will auto-detect the location of the driver and center the location on the map.
Location detection must be enabled for this webpage to work.
After entering the driver homepage button, do not use the go back, forward, close, or refresh button of the browser as well as changing the website link and going back to this page. If user is trying to navigate to another website, either open another tab or program(not recommended when the bot is running), or do so after logging out.
Do not Shut Down, Log Off , put the device to sleep or do any other similar activity during the ride. The website must remain active during the ride. 
After driver press the “Look for Customer” button, the driver cannot cancel the request and as per previous rule, must not close the browser.
The driver should respond as quickly as possible when paired up with a customer and drive to user’s location as quickly and safely as possible
During the ride, the user may not minimize or switch tabs or switch to another application to make webpage inactive, and as per another previous rule, do not close, go back, forward and etc.
User must not enter the driver home page through web address but by login(or driver additional information) page only.
For different browser, the experimental bot may move in different speed since it is dictated by pixel density of the browser.
A user must have logged-in before accessing pages other than login.html and index.html and in those other page, can only use in-page button to navigate through the website
