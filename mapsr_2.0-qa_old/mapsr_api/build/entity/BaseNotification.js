"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNotification = void 0;
var BaseNotification = /** @class */ (function () {
    function BaseNotification() {
        this.notifications = new Array();
    }
    BaseNotification.prototype.AddNotification = function (message) {
        this.notifications.push({ message: message });
    };
    BaseNotification.prototype.isTrue = function (value, message) {
        if (value)
            this.notifications.push({ message: message });
    };
    BaseNotification.prototype.isRequired = function (value, message) {
        if (!value || value.length <= 0)
            this.notifications.push({ message: message });
    };
    BaseNotification.prototype.hasMinLen = function (value, min, message) {
        if (!value || value.length < min)
            this.notifications.push({ message: message });
    };
    BaseNotification.prototype.hasMaxLen = function (value, max, message) {
        if (!value || value.length > max)
            this.notifications.push({ message: message });
    };
    BaseNotification.prototype.isFixedLen = function (value, len, message) {
        if (value.length != len)
            this.notifications.push({ message: message });
    };
    BaseNotification.prototype.isEmail = function (value, message) {
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value))
            this.notifications.push({ message: message });
    };
    Object.defineProperty(BaseNotification.prototype, "allNotifications", {
        get: function () {
            return this.notifications;
        },
        enumerable: false,
        configurable: true
    });
    BaseNotification.prototype.valid = function () {
        return this.notifications.length == 0;
    };
    return BaseNotification;
}());
exports.BaseNotification = BaseNotification;
//# sourceMappingURL=BaseNotification.js.map