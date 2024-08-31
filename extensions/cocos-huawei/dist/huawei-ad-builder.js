"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaWeiAdBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("./utils");
class HuaWeiAdBuilder {
    static afterBuild(options, result) {
        HuaWeiAdBuilder.copyModule(result);
        HuaWeiAdBuilder.appendProguard(result);
        HuaWeiAdBuilder.appendBuild(result);
        utils_1.Utils.addServices(result, 'com.cocos.huawei.ad.HuaWeiAdService');
    }
    static copyModule(result) {
        fs_extra_1.default.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocoshuawei/`);
    }
    static appendBuild(result) {
        fs_extra_1.default.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs_1.default.readFileSync(`${result.dest}/proj/libcocoshuawei/build.gradle`, { encoding: 'binary' })}`);
    }
    static appendProguard(result) {
        fs_extra_1.default.appendFileSync(`${result.dest}/proj/proguard-rules.pro`, `\n${fs_1.default.readFileSync(`${result.dest}/proj/libcocoshuawei/proguard-rules.pro`, { encoding: 'binary' })}`);
    }
}
exports.HuaWeiAdBuilder = HuaWeiAdBuilder;
