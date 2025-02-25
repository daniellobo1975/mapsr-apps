"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsHelper = void 0;
var UtilsHelper = /** @class */ (function () {
    function UtilsHelper() {
    }
    Object.defineProperty(UtilsHelper, "GenerateUniqueHash", {
        get: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        enumerable: false,
        configurable: true
    });
    return UtilsHelper;
}());
exports.UtilsHelper = UtilsHelper;
//# sourceMappingURL=utilHeper.js.map