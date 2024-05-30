var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 66192,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: Wait timed out after 20001ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 20001ms\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:28:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.clickOnReportsIcon (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:25:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:32:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658048601,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658048607,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658054939,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658054940,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658054941,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658054942,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0070005d-00ef-00bf-00f3-0032006c0054.png",
        "timestamp": 1686658039355,
        "duration": 27655
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 43324,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: Wait timed out after 20020ms",
            "Expected false to be true."
        ],
        "trace": [
            "TimeoutError: Wait timed out after 20020ms\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:28:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.clickOnReportsIcon (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:25:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:32:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:30:24\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658116115,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658116121,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658121183,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658121184,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658121184,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658121185,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00360050-00db-00ac-00dc-00f1002d00da.png",
        "timestamp": 1686658106088,
        "duration": 34112
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 54456,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: Wait timed out after 20010ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 20010ms\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:28:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.clickOnReportsIcon (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:25:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:32:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658263716,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658263723,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658270044,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658270045,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658270049,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658270050,
                "type": ""
            }
        ],
        "screenShotFile": "images\\006a00f8-007b-00f8-0096-00e400200046.png",
        "timestamp": 1686658254054,
        "duration": 60198
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 59160,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658468330,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658468336,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658473985,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658473985,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658473986,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658473987,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fe00fa-00bd-00c8-0058-009a00db00d0.png",
        "timestamp": 1686658458951,
        "duration": 50835
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 64272,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658641572,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658641580,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658646481,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658646482,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658646483,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658646484,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fd0033-0071-0025-0045-0041004b0033.png",
        "timestamp": 1686658632653,
        "duration": 48423
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 39904,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658736933,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658736942,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658741842,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658741843,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658741844,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658741844,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00f00057-002e-00f6-00f9-0059004400eb.png",
        "timestamp": 1686658728716,
        "duration": 31584
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 71360,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:33:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658863164,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658863169,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658869095,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658869096,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658869096,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658869096,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00370073-0082-00de-009c-00f0007d008f.png",
        "timestamp": 1686658853906,
        "duration": 23461
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 66616,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686658949602,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658949608,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658954843,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658954844,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686658954845,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686658954846,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00f70044-00b4-004b-0004-009f00f3000c.png",
        "timestamp": 1686658940626,
        "duration": 40103
    },
    {
        "description": "Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 40424,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //div[@class='category']//mat-checkbox//label)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:71:15\n    at new Promise (<anonymous>)\n    at ErrorDialogs.verifyErrorDialogForDeptSelection (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-17225-ErrorDialogBox.po.ts:66:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:35:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-17225-ErrorDialogBox.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686659060937,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659060943,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659065817,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659065817,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659065819,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659065819,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00e80097-00b2-00e8-00a6-00dc00b600bf.png",
        "timestamp": 1686659052963,
        "duration": 41509
    },
    {
        "description": "Verify Search Elements UI for LS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 49016,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:234:18\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.VerifysearchButtonDisabled (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:230:10)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:104:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Verify Search Elements UI for LS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:79:5)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:93:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686659566044,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659566049,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659570888,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659570888,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659570889,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659570889,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686659587869,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001c007e-008b-0001-0050-00a6002000d9.png",
        "timestamp": 1686659558399,
        "duration": 53285
    },
    {
        "description": "Verify Search Elements UI for LT Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 49016,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:234:18\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.VerifysearchButtonDisabled (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:230:10)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:180:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Verify Search Elements UI for LT Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:155:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\00b2006e-00f1-00e3-0008-003e009d00fe.png",
        "timestamp": 1686659612028,
        "duration": 43102
    },
    {
        "description": "Verify Search Elements UI for LS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 68024,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:234:18\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.VerifysearchButtonDisabled (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:230:10)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:104:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Verify Search Elements UI for LS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:79:5)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:93:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686659837112,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659837117,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659842248,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659842248,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686659842249,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686659842249,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686659865264,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000d0018-00db-0024-00ae-00c400af00bd.png",
        "timestamp": 1686659829434,
        "duration": 44968
    },
    {
        "description": "Verify Search Elements UI for LT Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 68024,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:234:18\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.VerifysearchButtonDisabled (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:230:10)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:180:18)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Verify Search Elements UI for LT Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:155:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\00b300d0-0015-0076-0029-00740055001f.png",
        "timestamp": 1686659874724,
        "duration": 40214
    },
    {
        "description": "Verify Search Elements UI for Tech Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 68024,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[@class='mat-focus-indicator spec-search-btn mat-button mat-button-base mat-primary ng-star-inserted'])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getAttribute] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:234:18\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.VerifysearchButtonDisabled (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:230:10)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:256:16)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Verify Search Elements UI for Tech Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:231:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\003800fd-000b-00aa-0052-005d00120057.png",
        "timestamp": 1686659915183,
        "duration": 39887
    },
    {
        "description": "Verify Search Elements UI for AUM+LUM Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 68024,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: Wait timed out after 30010ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 30010ms\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at Object.findElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:486:25)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\logout-e2e.po.ts:84:25\n    at new Promise (<anonymous>)\n    at LogOut.signOut (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\logout-e2e.po.ts:83:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:322:5)\nFrom: Task: Run it(\"Verify Search Elements UI for AUM+LUM Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:308:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15676-SearchElements.spec.ts:25:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "http://localhost:4200/polyfills.js - Failed to load resource: net::ERR_CACHE_READ_FAILURE",
                "timestamp": 1686659955865,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://localhost:4200/styles.js - Failed to load resource: net::ERR_CACHE_READ_FAILURE",
                "timestamp": 1686659955866,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://localhost:4200/vendor.js - Failed to load resource: net::ERR_CACHE_READ_FAILURE",
                "timestamp": 1686659955866,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://localhost:4200/main.js - Failed to load resource: net::ERR_CACHE_READ_FAILURE",
                "timestamp": 1686659955867,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.google-analytics.com/analytics.js - Failed to load resource: net::ERR_CACHE_READ_FAILURE",
                "timestamp": 1686659955954,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ca0064-0011-0012-0062-00a700950091.png",
        "timestamp": 1686659955357,
        "duration": 61798
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 73856,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: Cannot read property 'Lab Supervisor' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'Lab Supervisor' of undefined\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:29:66)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\007100ae-0071-00f0-00c3-00ec00cd00d4.png",
        "timestamp": 1686729447251,
        "duration": 201
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 64952,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686729579906,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729579910,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729584332,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729584333,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729584333,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729584333,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729621724,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686729627930,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729627935,
                "type": ""
            }
        ],
        "screenShotFile": "images\\003c00d9-0020-00a4-007d-0095003f006f.png",
        "timestamp": 1686729573773,
        "duration": 54072
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 70812,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686729745376,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729745381,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729750330,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729750331,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729750332,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729750332,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686729773964,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729788552,
                "type": ""
            }
        ],
        "screenShotFile": "images\\006700fb-0096-0006-000a-00db00a60075.png",
        "timestamp": 1686729738902,
        "duration": 50846
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 67400,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:33:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686729857315,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729857320,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729861775,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729861776,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686729861776,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686729861777,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00b40058-00e2-0091-0065-00a500dc00f5.png",
        "timestamp": 1686729824734,
        "duration": 75744
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 66244,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730024126,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730024131,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730028551,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730028551,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730028552,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730028552,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730048483,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730055093,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730055101,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00470052-00f5-00b1-00b2-00c400bd003e.png",
        "timestamp": 1686730018003,
        "duration": 47164
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 51544,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730136082,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730136086,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730140587,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730140588,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730140588,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730140589,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730182580,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730187498,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730187506,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00cd001f-00fd-0001-00c9-007400af00f0.png",
        "timestamp": 1686730129570,
        "duration": 68022
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 76008,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730284048,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730284052,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730288423,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730288424,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730288426,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730288427,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730365715,
                "type": ""
            }
        ],
        "screenShotFile": "images\\008900ab-005e-00ac-005c-0087003c002b.png",
        "timestamp": 1686730241441,
        "duration": 125431
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 74064,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730390587,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730390591,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730395202,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730395203,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730395204,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730395204,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686730418728,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730472520,
                "type": ""
            }
        ],
        "screenShotFile": "images\\009f005b-0058-0012-0049-00f700530010.png",
        "timestamp": 1686730384200,
        "duration": 89464
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 56276,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730771266,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730771271,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730775654,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730775654,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730775655,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730775655,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730853076,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004c00e9-00ee-0014-003b-000900790001.png",
        "timestamp": 1686730766586,
        "duration": 87667
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 59500,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686730879637,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730879642,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730883897,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730883897,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686730883898,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730883898,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686730904488,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686730961793,
                "type": ""
            }
        ],
        "screenShotFile": "images\\005f00a6-0037-0084-00c7-00600023002e.png",
        "timestamp": 1686730873931,
        "duration": 88998
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 24588,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686732141534,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732141537,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732145780,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732145781,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732145781,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732145781,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732223525,
                "type": ""
            }
        ],
        "screenShotFile": "images\\005f00f1-0097-0002-0053-007d00920054.png",
        "timestamp": 1686732136209,
        "duration": 88465
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 65552,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686732246680,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732246684,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732250891,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732250892,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732250892,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732250892,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732328719,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ff00ca-007d-0023-0026-00a5008700b6.png",
        "timestamp": 1686732240807,
        "duration": 89020
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 9908,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686732351448,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732351453,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732355775,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732355775,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732355776,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732355776,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686732375806,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732433375,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00cf00a8-0011-00b4-0039-00e500d600ee.png",
        "timestamp": 1686732345441,
        "duration": 89092
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 57936,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686732552993,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732552996,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732556915,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732556916,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686732556916,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732556917,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686732599538,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00710088-00ff-0018-0054-009f00f300c8.png",
        "timestamp": 1686732548356,
        "duration": 52353
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 57564,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, (.//mat-select[@role=\"listbox\"])[2])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, (.//mat-select[@role=\"listbox\"])[2])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686733172948,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733172952,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686733177902,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733177903,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686733177904,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733177904,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000a0097-008a-0030-0090-008e006b001e.png",
        "timestamp": 1686733166820,
        "duration": 74788
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75048,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, (.//mat-select[@role=\"listbox\"])[2])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, (.//mat-select[@role=\"listbox\"])[2])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686733274957,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733274961,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686733279180,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733279181,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686733279182,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686733279182,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00810060-00e2-0002-001e-00fd00f1009b.png",
        "timestamp": 1686733269382,
        "duration": 45588
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 40560,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686734138048,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686734138051,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686734142335,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686734142335,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686734142336,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686734142336,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c300a5-00e9-005c-00f5-009e003e00fa.png",
        "timestamp": 1686734132747,
        "duration": 44120
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 53148,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686742261020,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742261024,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742266029,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742266030,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742266031,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742266032,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c20095-00e5-005a-00e1-00c4007800cb.png",
        "timestamp": 1686742253503,
        "duration": 45832
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 69300,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686742331225,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742331230,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742335921,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742335922,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742335922,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742335923,
                "type": ""
            }
        ],
        "screenShotFile": "images\\003300b4-0084-0033-002c-00fc004800bc.png",
        "timestamp": 1686742323621,
        "duration": 45750
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 48720,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:33:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686742525293,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742525301,
                "type": ""
            }
        ],
        "screenShotFile": "images\\002e00c8-00b7-0053-00b3-003400260008.png",
        "timestamp": 1686742514861,
        "duration": 40705
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 73884,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:33:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686742580850,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742580856,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742585947,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742585948,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686742585948,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686742585948,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00d9009a-002d-0046-0076-000300e6001a.png",
        "timestamp": 1686742574037,
        "duration": 51204
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 25924,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:40:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744154753,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744154758,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744159282,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744159283,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744159283,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744159284,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744204719,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fa00c8-003f-00d6-000c-00da006f00ce.png",
        "timestamp": 1686744148472,
        "duration": 57412
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 76056,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744265230,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744265232,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744269491,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744269492,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744269492,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744269493,
                "type": ""
            }
        ],
        "screenShotFile": "images\\007100d5-0014-00f5-0031-009900be0016.png",
        "timestamp": 1686744259287,
        "duration": 59871
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 53212,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744354504,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744354508,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744358995,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744358995,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744358996,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744358996,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000500d1-0076-007c-002e-008800ea005b.png",
        "timestamp": 1686744348398,
        "duration": 42378
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 17360,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:40:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744513999,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744514003,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744518262,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744518263,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744518263,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744518263,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744583327,
                "type": ""
            }
        ],
        "screenShotFile": "images\\009c0094-0023-00b9-008d-00ef00390056.png",
        "timestamp": 1686744507992,
        "duration": 76483
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 73708,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:166:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744692937,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744692941,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744697002,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744697002,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744697002,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744697003,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00a900f5-001d-0030-0045-00a500680013.png",
        "timestamp": 1686744687855,
        "duration": 61299
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 49528,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:33:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:70:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:166:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744770501,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744770505,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744774813,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744774814,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744774814,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744774815,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00cc00f8-0000-00f9-005a-005d009700b5.png",
        "timestamp": 1686744764606,
        "duration": 60181
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 40244,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686744847188,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744847191,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744851189,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744851189,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686744851190,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744851190,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686744876259,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686744917159,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00190026-00d0-00a2-0046-00bb0002007e.png",
        "timestamp": 1686744841838,
        "duration": 76464
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 61516,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:44:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686747372523,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747372527,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747376706,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747376707,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747376707,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747376707,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747442249,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004700a2-00f6-000e-00f3-003800e500be.png",
        "timestamp": 1686747365493,
        "duration": 77877
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75696,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:44:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686747498653,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747498658,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747503575,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747503576,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747503577,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747503578,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747569132,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fc0078-009b-004c-00df-00c400880067.png",
        "timestamp": 1686747492307,
        "duration": 78016
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75756,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686747812028,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747812033,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747816106,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747816107,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686747816108,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747816108,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686747884485,
                "type": ""
            }
        ],
        "screenShotFile": "images\\003c00d8-0045-00e4-00c4-00f8000a00d0.png",
        "timestamp": 1686747805895,
        "duration": 79750
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 43396,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686751736767,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751736778,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686751741537,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751741538,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686751741539,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751741539,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751810431,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00460098-0086-00c4-0040-004800eb0068.png",
        "timestamp": 1686751730893,
        "duration": 80669
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 72964,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686751967846,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751967857,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686751973094,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751973095,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686751973095,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686751973096,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686751983669,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686752041291,
                "type": ""
            }
        ],
        "screenShotFile": "images\\008600cf-00d4-00bf-0058-00d000ef0054.png",
        "timestamp": 1686751962192,
        "duration": 80223
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 50568,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686752803510,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686752803524,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686752808388,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686752808389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686752808389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686752808390,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686752877442,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fa00f0-00c0-0009-00e8-009000ae0069.png",
        "timestamp": 1686752797554,
        "duration": 81064
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 58344,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686807679196,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686807679201,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686807685339,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686807685339,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686807685339,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686807685340,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686807706214,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686807753146,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00270007-00c0-00e9-00c1-00e7001400e0.png",
        "timestamp": 1686807671880,
        "duration": 82117
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 67196,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686808332247,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808332252,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686808337016,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808337017,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686808337017,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808337018,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686808362500,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808405392,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00a30019-0026-00e6-0087-001c00180093.png",
        "timestamp": 1686808325366,
        "duration": 80974
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 29772,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686808630014,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808630019,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686808634622,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808634622,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686808634622,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808634623,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686808702628,
                "type": ""
            }
        ],
        "screenShotFile": "images\\008c005d-006c-00ed-00f6-0046007d00b3.png",
        "timestamp": 1686808624514,
        "duration": 79242
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 79876,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:37:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686809280160,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809280164,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809284559,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809284559,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809284560,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809284561,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686809299773,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809352569,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000800d5-0092-0002-0062-00f700240040.png",
        "timestamp": 1686809274159,
        "duration": 79566
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 76832,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, .//span[@class='mat-option-text'][contains(text(),'Location and Department')])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, .//span[@class='mat-option-text'][contains(text(),'Location and Department')])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:173:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686809421080,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809421084,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809425782,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809425782,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809425783,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809425783,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686809441852,
                "type": ""
            }
        ],
        "screenShotFile": "images\\007d00e0-0079-0006-0048-006200c70078.png",
        "timestamp": 1686809414988,
        "duration": 71509
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 27644,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, .//span[@class='mat-option-text'][contains(text(),'Location and Department')])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, .//span[@class='mat-option-text'][contains(text(),'Location and Department')])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:173:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:162:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686809622108,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809622112,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809626255,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809626256,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809626256,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809626256,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686809647832,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00cd0096-0017-00ab-00ce-005e00cb0021.png",
        "timestamp": 1686809617468,
        "duration": 63600
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 69708,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686809833383,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809833387,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809837639,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809837639,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686809837639,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809837640,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686809906444,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ee00e0-0028-00a7-00ac-00a100af00e5.png",
        "timestamp": 1686809826535,
        "duration": 81048
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 47436,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686811908871,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686811908879,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686811914263,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686811914263,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686811914264,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686811914264,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686811981451,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0006000b-00e2-00a3-0038-005100250075.png",
        "timestamp": 1686811901810,
        "duration": 80821
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75408,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686812766660,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686812766664,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686812771088,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686812771089,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686812771089,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686812771090,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686812839280,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00a9004c-00fe-001a-005a-005f00990038.png",
        "timestamp": 1686812760937,
        "duration": 79503
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 64972,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:48:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686813137943,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813137947,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813142398,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813142398,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813142399,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813142399,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813210914,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0074006a-008b-0064-0007-006200130082.png",
        "timestamp": 1686813131237,
        "duration": 80780
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 45024,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686813493297,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813493302,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813502085,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813502085,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813502086,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813502086,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686813521979,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813565587,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00310010-00e6-00fd-0008-00ff006100e2.png",
        "timestamp": 1686813486011,
        "duration": 80735
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 74460,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: Cannot read property 'includes' of undefined"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "TypeError: Cannot read property 'includes' of undefined\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:215:31\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686813853250,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813853257,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813858128,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813858129,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686813858130,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686813858130,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686813877823,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00a8009b-006f-009f-0018-00ad0066007a.png",
        "timestamp": 1686813845728,
        "duration": 71126
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 50804,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: Cannot read property 'includes' of undefined"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "TypeError: Cannot read property 'includes' of undefined\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:215:31\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686814459510,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814459514,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814464209,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814464210,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814464210,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814464211,
                "type": ""
            }
        ],
        "screenShotFile": "images\\009300a0-0040-0015-00dc-00ce00a000d0.png",
        "timestamp": 1686814425706,
        "duration": 98570
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 65044,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686814728463,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814728468,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814733002,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814733002,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814733003,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814733003,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814800417,
                "type": ""
            }
        ],
        "screenShotFile": "images\\002900e5-0084-00b4-0048-002300e20008.png",
        "timestamp": 1686814722068,
        "duration": 79504
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 78280,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686814895367,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814895370,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814900186,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814900186,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686814900186,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814900187,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686814915545,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686814967882,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001f0042-0028-0027-002f-00e600fb003f.png",
        "timestamp": 1686814889017,
        "duration": 80024
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 17792,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-label[contains(.,\"Filter\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:72:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:169:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:164:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:36:20)\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686815311814,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815311820,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815316345,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815316346,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815316346,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815316347,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686815347438,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0031002b-00ab-00bf-00ef-00e4004b0014.png",
        "timestamp": 1686815305212,
        "duration": 62728
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 77572,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686815393009,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815393015,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815397237,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815397238,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815397238,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815397239,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815465631,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00b2001e-00de-00b9-00ae-00ef000b0012.png",
        "timestamp": 1686815386724,
        "duration": 80070
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 33408,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686815759243,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815759246,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815763110,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815763110,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686815763111,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815763111,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686815780999,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686815832413,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00290065-00bc-0058-007d-00e2009400cb.png",
        "timestamp": 1686815705515,
        "duration": 128064
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 63232,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686817097849,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817097854,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817102235,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817102235,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817102236,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817102236,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686817123565,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817170570,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c00051-0002-00eb-00f6-007b0061009b.png",
        "timestamp": 1686817091224,
        "duration": 80482
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 77060,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686817263957,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817263961,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817268204,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817268205,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817268206,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817268206,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817336487,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00a70030-00a8-0075-00f9-008300560053.png",
        "timestamp": 1686817258156,
        "duration": 79466
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 67020,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:49:23\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686817487501,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817487506,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817492109,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817492109,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686817492110,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817492110,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686817560213,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ab007c-00c8-00ba-0040-007b00e500ac.png",
        "timestamp": 1686817481114,
        "duration": 80269
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 32380,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686835357397,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835357401,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835361863,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835361863,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835361864,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835361864,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835429907,
                "type": ""
            }
        ],
        "screenShotFile": "images\\002400e9-0055-0073-0075-005000de0039.png",
        "timestamp": 1686835319428,
        "duration": 111632
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 38200,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686835726603,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835726606,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835730683,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835730684,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835730684,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835730685,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835799249,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ca00bd-00f8-0074-00dc-00f5003d00b0.png",
        "timestamp": 1686835692922,
        "duration": 107477
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 61100,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686835863389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835863392,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835867850,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835867851,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835867851,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835867852,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835932773,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00280081-000c-006d-0053-00a100e90038.png",
        "timestamp": 1686835857131,
        "duration": 76802
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 25504,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686835966260,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835966265,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835970987,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835970988,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686835970988,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686835970989,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836010468,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001c005f-0075-0022-0063-00b2004b00e0.png",
        "timestamp": 1686835960037,
        "duration": 51587
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 84828,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836084540,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836084544,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836088644,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836088645,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836088646,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836088646,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836102263,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836108806,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836108810,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004e0024-00d1-00db-00ad-004a0095006b.png",
        "timestamp": 1686836039115,
        "duration": 74671
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 74748,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836140536,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836140541,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836144526,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836144527,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836144528,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836144528,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686836156337,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836184825,
                "type": ""
            }
        ],
        "screenShotFile": "images\\005300c8-0006-00ff-00c8-008200820046.png",
        "timestamp": 1686836134268,
        "duration": 51713
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 81400,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, //button/span[contains(text(),\"Logout\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, //button/span[contains(text(),\"Logout\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\logout-e2e.po.ts:87:15\n    at new Promise (<anonymous>)\n    at LogOut.signOut (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\logout-e2e.po.ts:83:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:53:9)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836270307,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836270310,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836274590,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836274590,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836274590,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836274591,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686836289216,
                "type": ""
            }
        ],
        "screenShotFile": "images\\006c0053-0053-0039-0071-005600c80042.png",
        "timestamp": 1686836264097,
        "duration": 52803
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75576,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836617299,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836617303,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836621636,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836621636,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836621637,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836621637,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836661420,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000e007c-0004-0071-00d4-0021008400fe.png",
        "timestamp": 1686836611666,
        "duration": 50907
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 81656,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836752418,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836752422,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836756889,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836756890,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836756890,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836756890,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836766834,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836781592,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836781596,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fc0073-002c-009d-0023-003800290029.png",
        "timestamp": 1686836746419,
        "duration": 45100
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 75772,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836819947,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836819951,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836824153,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836824153,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836824154,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836824154,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836864134,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0085001b-00f9-00a3-007c-00a1000f001d.png",
        "timestamp": 1686836814264,
        "duration": 51009
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 69860,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686836923064,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836923069,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836927204,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836927204,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686836927205,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836927205,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686836967729,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00d40005-0024-00ac-00df-007500210093.png",
        "timestamp": 1686836917059,
        "duration": 51870
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 83756,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true.",
            "Failed: No element found using locator: By(xpath, //button/span[contains(text(),\"Logout\")])"
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)",
            "NoSuchElementError: No element found using locator: By(xpath, //button/span[contains(text(),\"Logout\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.clickJS (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\utils\\browserUtil.ts:221:17)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\logout-e2e.po.ts:87:15\n    at new Promise (<anonymous>)\n    at LogOut.signOut (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\page-objects\\logout-e2e.po.ts:83:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:53:9)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 1 :Verify Search logic\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:25:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686904928470,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686904928476,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686904933682,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686904933682,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686904933683,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686904933683,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00b3006b-008e-0085-00d0-00b700ae0047.png",
        "timestamp": 1686904920774,
        "duration": 56451
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 55436,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\SPA\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:30:25\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686908349973,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908349978,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908354630,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908354631,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908354632,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908354632,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908394266,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fb00e1-000d-00ed-0098-00c6009e00de.png",
        "timestamp": 1686908343566,
        "duration": 51848
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 70316,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686908470118,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908470121,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908474524,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908474524,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908474525,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908474525,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686908486513,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908513735,
                "type": ""
            }
        ],
        "screenShotFile": "images\\008e00e8-009a-00ea-00d2-001800c00049.png",
        "timestamp": 1686908463469,
        "duration": 51429
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 79916,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686908548720,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908548724,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908553315,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908553315,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908553316,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908553316,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908621089,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004200a9-00f1-00b6-0083-00a700cb00a0.png",
        "timestamp": 1686908542968,
        "duration": 79278
    },
    {
        "description": "Test case 1 :Verify Search logic|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 87500,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1686908669889,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908669893,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908674155,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908674155,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1686908674156,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908674156,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://unity-dev2-api.qcnet.com/main/notification/subscribe - Failed to load resource: the server responded with a status of 502 (Bad Gateway)",
                "timestamp": 1686908689451,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1686908743230,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00670070-0024-003a-00f3-005600ce0045.png",
        "timestamp": 1686908663073,
        "duration": 81290
    },
    {
        "description": "Test case 1 :Verify Search logic for Instruent|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 84380,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1687164128073,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687164128081,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687164134240,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687164134242,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687164134242,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687164134250,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687164201045,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0091007a-003d-00ad-0006-00e600810079.png",
        "timestamp": 1687164119404,
        "duration": 82774
    },
    {
        "description": "Test case 3 :Verify Search logic for Location and Department|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 102952,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.findElements(By(xpath, .//mat-label[contains(.,\"Filter\")]))\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.findElements (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1048:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:159:44\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: <anonymous>\n    at Timeout.pollCondition [as _onTimeout] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:64:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:159:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:157:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:74:20)\nFrom: Task: Run it(\"Test case 3 :Verify Search logic for Location and Department\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:66:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1687350919857,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350919860,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687350925594,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350925595,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687350925597,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350925597,
                "type": ""
            }
        ],
        "timestamp": 1687350910606,
        "duration": 51548
    },
    {
        "description": "Test case 4 :Verify Search logic for Instruent|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 102952,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.findElements(By(xpath, //mat-icon[contains(@ng-reflect-svg-icon,\"reportsNotificationIcon\")]//ancestor::button))\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.findElements (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1048:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:159:44\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous>\n    at pollCondition (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2191:7\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2190:22\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:28:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.clickOnReportsIcon (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:25:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:98:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 4 :Verify Search logic for Instruent\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:94:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "timestamp": 1687350962699,
        "duration": 800
    },
    {
        "description": "Test case 5 :Verify Search logic for Control|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 102952,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.findElements(By(xpath, //mat-icon[contains(@ng-reflect-svg-icon,\"reportsNotificationIcon\")]//ancestor::button))\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.findElements (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1048:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:159:44\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: <anonymous>\n    at pollCondition (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2191:7\n    at new ManagedPromise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2190:22\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:28:15\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.clickOnReportsIcon (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:25:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:126:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"Test case 5 :Verify Search logic for Control\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:122:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "timestamp": 1687350963617,
        "duration": 771
    },
    {
        "description": "Test case 3 :Verify Search logic for Location and Department|Test Suite:Verify Error Dialog box for Selection parameter filters on Report page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 112188,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.91"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=114.0.5735.91)\n  (Driver info: chromedriver=114.0.5735.90 (386bc09e8f4f2e025eddae123f36f6263096ae49-refs/branch-heads/5735@{#1052}),platform=Windows NT 10.0.22621 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.findElements(By(xpath, .//mat-label[contains(.,\"Filter\")]))\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.findElements (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1048:19)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:159:44\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: <anonymous>\n    at Timeout.pollCondition [as _onTimeout] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> [as wait] (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at DynamicReportsPhase2.ClickFliterDD (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:64:13)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:159:12\n    at new Promise (<anonymous>)\n    at DynamicReportsPhase2.FilterSelect (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\dynamic-reports-phase2.po.ts:157:12)\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:74:20)\nFrom: Task: Run it(\"Test case 3 :Verify Search logic for Location and Department\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:66:3)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15677-SearchLogic.spec.ts:18:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1687350991435,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350991440,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687350996531,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350996532,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1687350996532,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1687350996533,
                "type": ""
            }
        ],
        "timestamp": 1687350984628,
        "duration": 29399
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 31344,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689854599995,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689854600000,
                "type": ""
            }
        ],
        "timestamp": 1689854593982,
        "duration": 15238
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 4140,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689854711117,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689854711119,
                "type": ""
            }
        ],
        "timestamp": 1689854707073,
        "duration": 16934
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 32920,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689854777503,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689854777508,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00e300ad-007e-00e6-0072-00dd007f001f.png",
        "timestamp": 1689854772755,
        "duration": 18175
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 1152,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689854820755,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689854820759,
                "type": ""
            }
        ],
        "screenShotFile": "images\\003900f8-0054-0078-00aa-00e7002500d0.png",
        "timestamp": 1689854815086,
        "duration": 19448
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 23328,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689854875037,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689854875041,
                "type": ""
            }
        ],
        "screenShotFile": "images\\006a00da-000d-0004-0055-000a00ce0078.png",
        "timestamp": 1689854867574,
        "duration": 20956
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 3260,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\001800df-004a-008e-00a1-00d900db009a.png",
        "timestamp": 1689854970608,
        "duration": 960
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 14040,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\00140009-00fb-00c0-0023-001c00d10077.png",
        "timestamp": 1689855069466,
        "duration": 1661
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 34460,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689855112975,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855112982,
                "type": ""
            }
        ],
        "timestamp": 1689855105832,
        "duration": 20519
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 25552,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1144:26\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689855170829,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855170834,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855177726,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855177727,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855177727,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855177727,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001a00f7-00b4-00db-000d-000d00c50004.png",
        "timestamp": 1689855164034,
        "duration": 34783
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12156,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\007f00cc-00e4-00c4-00e7-008d004b00e8.png",
        "timestamp": 1689855278135,
        "duration": 1245
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 21112,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"undefined\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "images\\00c7009c-0079-008d-004b-003a00980063.png",
        "timestamp": 1689855335713,
        "duration": 1049
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 34244,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"LargeData\")])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //mat-nav-list//div[contains(text(),\"LargeData\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1144:26\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689855395534,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855395538,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855401791,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855401791,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855401792,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855401792,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c6000a-00e5-004f-00f7-005c00cb0007.png",
        "timestamp": 1689855389459,
        "duration": 25498
    },
    {
        "description": "Verify Search Elements UI for LVS Role|PBI_231950: Verify the Functionality of Account listing screen",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 27480,
        "browser": {
            "name": "chrome",
            "version": "114.0.5735.134"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, .//mat-nav-list//div[contains(text(),\"LargeData\")])",
            "Expected false to be true."
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, .//mat-nav-list//div[contains(text(),\"LargeData\")])\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.executeScript()\n    at Driver.schedule (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.executeScript (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:58:33)\n    at ProtractorBrowser.to.<computed> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:66:16)\n    at BrowserLibrary.scrollToElement (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\utils\\browserUtil.ts:202:17)\n    at DynamicReport.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:32:15)\n    at step (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:33:23)\n    at Object.next (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:14:53)\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\page-objects\\UN-12458_QuickReport.po.ts:8:71\n    at new Promise (<anonymous>)\nFrom: Task: Run it(\"Verify Search Elements UI for LVS Role\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1137:1)\n    at addSpecsToSuite (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\anup_shet\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:28:1)\n    at Module._compile (internal/modules/cjs/loader.js:945:30)\n    at Module.m._compile (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:422:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:962:10)\n    at Object.require.extensions.<computed> [as .ts] (C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\node_modules\\ts-node\\src\\index.ts:425:12)",
            "Error: Failed expectation\n    at C:\\Users\\anup_shet\\Desktop\\Required\\Git Repo\\FEcode\\cdg-unity-next-spa\\spa\\e2e\\dynamic-reports-phase2\\UN-15834-ParameterSelections.spec.ts:1144:26\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://biorad-ext.okta.com/api/v1/sessions/me - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1689855830275,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855830279,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855836477,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855836477,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: Use setTokens() instead if you want to add a set of tokens at same time.\\nIt prevents current tab from emitting unnecessary StorageEvent,\\nwhich may cause false-positive authState change cross tabs.\"",
                "timestamp": 1689855836477,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://localhost:4200/vendor.js 185023:140904 \"[okta-auth-sdk] WARN: updateAuthState is an asynchronous method with no return, please subscribe to the latest authState update with authStateManager.subscribe(handler) method before calling updateAuthState.\"",
                "timestamp": 1689855836478,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c200ae-0077-0058-00e0-003e00460022.png",
        "timestamp": 1689855825876,
        "duration": 26728
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
