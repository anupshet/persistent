# Command to start execution without generating reports

protractor protractor.conf.js --params.user.report='false' 


# Command to start execution and generate the reports

protractor protractor.conf.js --params.user.report='true' 
OR
protractor protractor.conf.js (Handled in protractor.conf.js)

# Changes done in the protractor.conf.js

1. New parameter "report" is added in the protractor.conf.js file.
2. The reporting code execution is handled in protractor.conf.js file by the conditional values.
3. Conditional values such as "true" or "false" are the parameter value which are passed from CLI. 


