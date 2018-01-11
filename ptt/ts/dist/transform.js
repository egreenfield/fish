#!/usr/local/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ffmpeg = require("fluent-ffmpeg");
var Transformer = /** @class */ (function () {
    function Transformer() {
    }
    Transformer.prototype.transform = function (options) {
        console.log("processing...");
        var command = ffmpeg(options.sourceFile);
        command
            .audioFilters('volume=3')
            .audioFilters('atempo=2')
            .saveToFile(options.destFile);
        console.log("done.");
    };
    return Transformer;
}());
exports.Transformer = Transformer;
