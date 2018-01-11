"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var TTS = /** @class */ (function () {
    function TTS(session) {
        this.session = session;
        this.polly = new session.sdk.Polly({
            region: "us-west-2"
        });
    }
    TTS.prototype.fetchAudio = function (options) {
        console.log("saving message to", options.output);
        return this.polly.synthesizeSpeech({ OutputFormat: "mp3", Text: options.message, VoiceId: "Brian" }).promise().then(function (data) {
            return new Promise(function (resolve, reject) {
                fs_1.writeFile(options.output, data.AudioStream, {}, function (err) {
                    if (err)
                        return reject(err);
                    console.log("output file written");
                    resolve();
                });
            });
        });
    };
    return TTS;
}());
exports.TTS = TTS;
