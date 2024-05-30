# Jasmine Allure Reporter
Allure framework is a  framework that gives the ability to generate nice HTML reports for a host of test frameworks. It provides a nice open-source way to generate and add HTML reporting in a nice UI that can be easily understood by anyone in the team. We can capture all the steps and screenshots whereever it is required to.

This Reporter will generate xml files inside a resultsDir, then we need to generate HTML out of them.
It will create XML and HTML report under allure-results folder.


# Steps for Allure Reporting

1. Download allure from https://dl.bintray.com/qameta/generic/io/qameta/allure/allure/. 
2. Unpack the archive to allure directory. Navigate to bin directory.Copy path and add to system PATH.
3. Open cmd and check allure version with allure --version. It should show the downloaded allure version(2.6.0)
4. To generate allure report, jasmine allure reporter and allure commandline packages are required and these added to package.json file. It will get installed automatically to node_module folder with the npm install command.

  

# Methods created 
Below methods are created in browserUtils.ts:
1. logStep(msg) - It will add step to the report
2. logFailStep(msg) - It will add step to the report as well as mark it as fail and also attach screenshot of failed step.
3. attachScreenshot(screenshotname) - Using this method we can attach screenshot to the report.

