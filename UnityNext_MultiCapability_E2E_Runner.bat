rem -------------This is the script to setup the multiCapabilities environment---------
rem Step 1: Ensure you have JDK 1.8 or greater installed on the machine
rem Step 2: Ensure the local path C:\....\SPA has no spaces in it.

rem Step 3: Get latest of this this script and the latest test code
rem Step 4: Ensure that you already have the prerequisites to run the Angular front end on your machine
rem Step 5: Ensure that IE is set to zoom level 100% 
rem Step 6: Make sure you run this as admin.
rem Step 7: Disable form autocomplete for IE


rem ****START TEST HERE****
rem close all tasks with webdriver manager IE  and chromewebdrivers
taskkill /F /FI "WINDOWTITLE eq IEDRIVER" /T
taskkill /F /FI "WINDOWTITLE eq CHROMEDRIVER" /T
taskkill /F /FI "WINDOWTITLE eq ALLURE_OPEN" /T
taskkill /F /IM IEDriverServer*.exe
taskkill /F /IM chromedriver*.exe


rem Store execution path

set "var=%cd%"

call npm install -g allure-commandline
call npm install node-sass@latest
call npm install
call npm install protractor@latest
call npm install webdriver-manager@latest
call node .\node_modules\webdriver-manager\bin\webdriver-manager update --ie

rem next to start port 4444 for -ie test
start "IEDRIVER" cmd /c "node %var%\node_modules\webdriver-manager\bin\webdriver-manager start --ie"

rem next to start port 4443 for chrome test
start "CHROMEDRIVER" cmd /c "node %var%\node_modules\webdriver-manager\bin\webdriver-manager start --seleniumPort 4443"

rem now run the test after waiting 5 seconds for servers to start.
timeout 5
call npm run e2e
rem now wait 5 seconds for reports to be generated
timeout 5

rem pause with message for user to check allure
rem check allure results here c:\....\SPA\allure-results\Allure-HTML\{date}\index.html
rem best viewed in FireFox


rem close all tasks with webdriver manager IE  and chromewebdrivers
taskkill /F /FI "WINDOWTITLE eq IEDRIVER" /T
taskkill /F /FI "WINDOWTITLE eq CHROMEDRIVER" /T
taskkill /F /IM IEDriverServer*.exe
taskkill /F /IM chromedriver*.exe

rem Open results
start "ALLURE_OPEN" cmd /c "allure open %var%\allure-results\Allure-HTML"
