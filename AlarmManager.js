function AlarmManager() {
    this.id = uuidGen();
    this.userSeverityList = [];

    this.initialize();
}
mixin(AlarmManager.prototype, {
    initialize: function () {
        G_site.loadingHelper.append('AlarmManager_severities');
        this.severities(G_authInfo.uuid, function () {
            G_site.loadingHelper.remove('AlarmManager_severities');
        });
    },

    newMethod: function () {
        //todo something
        console.log('method 1');
        console.log('info');
    },

    newMethod3: function () {
        //todo something
    },

    newMethod4: function () {
        //todo something
    },

    newMethod5: function () {
        //todo something
    },

    severities: function (userUuid, callback, data) {
        var self = this;

        pyControllerCall("AlarmManager", "severities", G_engineAddress, {
            siteUuid: G_site.uuid,
            userUuid: userUuid
        }, function (data) {
            var severityList = {};
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    var severity = data[i];
                    severityList[severity.value] = new Severity(severity.value, severity.isAlarm, severity.color_r, severity.color_g, severity.color_b);
                }
            }
            for (var value = 1; value <= 100; ++value) {
                if (severityList[value] == undefined) {
                    severityList[value] = new Severity(value, false, 0, 0, 0);
                }
            }
            self.userSeverityList[userUuid] = severityList;

            if (typeof callback === 'function') {
                callback(data);
            }
        }, true);
    },

    setSeverities: function (userUuid, severityList, callback) // установка/отправка на сервер
    {
        var self = this;
        for (var value in severityList) {
            if (severityList.hasOwnProperty(value)) {
                if (value < 1 || value > 100) {
                    delete severityList[value];
                }
            }
        }

        pyControllerCall("AlarmManager", "setSeverities", G_site.master.ip, {
            siteUuid: G_site.uuid,
            userUuid: userUuid,
            severityList: severityList,
            currentStationAddress: G_engineAddress
        }, {
            s: function () {
                for (var value in severityList) {
                    if (severityList.hasOwnProperty(value)) {
                        self.userSeverityList[userUuid][value] = severityList[value];
                    }
                }
                if (typeof callback === 'function') {
                    callback(true);
                }
            },
            e: function () {
                if (typeof callback === 'function') {
                    callback(false);
                }
            }
        }, true);
    },

    partialSetSeveritiesAlarm: function (severitiesValuesArray, userUuid, isAlarm, callback) // удобное изменение только переданных isAlarm severity с дальнейшей отправкой на сервер
    {
        var self = this;
        var severityList = self.userSeverityList[userUuid];
        for (var i in severitiesValuesArray) {
            if (severitiesValuesArray.hasOwnProperty(i)) {
                var value = severitiesValuesArray[i];
                if (value < 1 || value > 100) continue;
                severityList[value].isAlarm = isAlarm;
            }
        }
        self.setSeverities(userUuid, severityList, function (ok) {
            callback(ok);
        });
    }
});

function Severity(value, isAlarm) {
    this.value = value;
    this.isAlarm = isAlarm;
}