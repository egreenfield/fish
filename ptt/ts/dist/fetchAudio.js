"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TTS = /** @class */ (function () {
    function TTS(session) {
        this.session = session;
        this.polly = new session.sdk.Polly({});
    }
    TTS.prototype.fetchAudio = function (options, callback) {
        console.log("saving message to", options.outputFile);
        return this.polly.synthesizeSpeech({ OutputFormat: "mp3", Text: options.message, VoiceId: "Brian" }, function (err, data) {
            console.log("response is ", err, data);
            callback(err);
        });
    };
    return TTS;
}());
exports.TTS = TTS;
