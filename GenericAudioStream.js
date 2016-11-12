function GenericAudioStream(station, uuid, folder, className, parent) {
    GenericAudioStream.superclass.constructor.call(this, station, uuid, folder, className, parent);

    this.url = undefined;
    this.login = undefined;
    this.password = undefined;
    this.useAuth = undefined;

    this.json_GenericAudioStream = undefined;
}
extend(GenericAudioStream, AudioStream);
mixin(GenericAudioStream.prototype, {
    getter_GenericAudioStream: function () {
        var self = this;
        pyControllerCall("GenericAudioStream", "getter", self.hostStation.ip, {__servantName__: self.uuid}, function (data, json) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    self[key] = data[key];
                }
            }
            if (self.json_GenericAudioStream != json) {
                self.json_GenericAudioStream = json;
                self.emitCallback('objectChanged', self);
            }
        }, true);
    },

    saveParams_GenericAudioStream: function (url, login, password, useAuth) {
        var self = this;
        pyControllerCall("GenericAudioStream", "saveParams", self.hostStation.ip, {
            __servantName__: self.uuid,
            url: url,
            login: login,
            password: password,
            useAuth: useAuth
        }, function (ok) {
            if (ok) {
                self.url = url;
                self.login = login;
                self.password = password;
                self.useAuth = useAuth;
            }
        }, true);
    }
});