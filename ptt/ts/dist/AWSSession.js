"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var AWSSession = /** @class */ (function () {
    function AWSSession(profile) {
        if (profile === void 0) { profile = "personal"; }
        var credentials = new AWS.SharedIniFileCredentials({ profile: profile });
        AWS.config.update({ credentials: credentials });
        this.sdk = AWS;
    }
    return AWSSession;
}());
exports.AWSSession = AWSSession;
