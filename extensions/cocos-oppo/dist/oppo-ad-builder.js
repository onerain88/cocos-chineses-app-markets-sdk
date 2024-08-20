"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OppoAdBuilder = void 0;
const fs = __importStar(require("fs"));
const fse = __importStar(require("fs-extra"));
const utils_1 = require("./utils");
class OppoAdBuilder {
    static afterBuild(options, result) {
        OppoAdBuilder.copyModule(result);
        OppoAdBuilder.appendProguard(result);
        OppoAdBuilder.appendBuild(result);
        utils_1.Utils.addServices(result, 'com.cocos.oppo.ad.OppoAdService');
        OppoAdBuilder.appendGradleProperties(result);
    }
    static copyModule(result) {
        fse.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocosoppo/`);
    }
    static appendProguard(result) {
        fse.appendFileSync(`${result.dest}/proj/proguard-rules.pro`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosoppo/proguard-rules.pro`, { encoding: 'binary' })}`);
    }
    static appendBuild(result) {
        fse.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosoppo/build.gradle`, { encoding: 'binary' })}`);
    }
    static appendGradleProperties(result) {
        const gradlePropertiesPath = `${result.dest}/proj/gradle.properties`;
        const gradleProperties = fs.readFileSync(gradlePropertiesPath, { encoding: 'binary' });
        const enableJetifier = `android.enableJetifier=true`;
        const pos = gradleProperties.indexOf(enableJetifier);
        if (pos < 0) {
            fs.writeFileSync(gradlePropertiesPath, gradleProperties + "\n" + enableJetifier + "\n");
        }
    }
}
exports.OppoAdBuilder = OppoAdBuilder;
