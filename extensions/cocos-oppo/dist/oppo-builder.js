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
exports.OppoBuilder = void 0;
const fs = __importStar(require("fs"));
const fse = __importStar(require("fs-extra"));
const global_1 = require("./global");
const fast_xml_parser_1 = require("fast-xml-parser");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class OppoBuilder {
    static afterBuild(options, result) {
        OppoBuilder.copyModule(result);
        OppoBuilder.includeProguard(result);
        OppoBuilder.copyAndroidManifest(options);
        OppoBuilder.applyModuleBuild();
        utils_1.Utils.addServices(result, 'com.cocos.oppo.OppoService');
    }
    static copyModule(result) {
        fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosoppo/`);
    }
    static includeProguard(result) {
        // 使用 -include 语法
        const proguardPath = `${constants_1.Constants.NativePath}/app/proguard-rules.pro`;
        const proguard = fs.readFileSync(proguardPath, { encoding: 'binary' });
        const includeOppoProguard = `-include "${result.dest}/proj/libcocosoppo/proguard-rules.pro"`;
        const pos = proguard.indexOf(includeOppoProguard);
        if (pos < 0) {
            fs.writeFileSync(proguardPath, proguard + "\n" + includeOppoProguard + "\n");
        }
    }
    static copyAndroidManifest(options) {
        const { appKey, debugMode, isOfflineGame } = options.packages[global_1.PACKAGE_NAME];
        console.log(`oppo params: ${appKey}, ${debugMode}, ${isOfflineGame}`);
        const manifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        utils_1.Utils.addMetaData(manifest, `
      <meta-data 
        android:name="app_key" 
        android:value="${appKey}"/>
        `);
        utils_1.Utils.addMetaData(manifest, `
      <meta-data 
        android:name="debug_mode" 
        android:value="${debugMode}"/>
        `);
        utils_1.Utils.addMetaData(manifest, `
      <meta-data 
        android:name="is_offline_game" 
        android:value="${isOfflineGame}"/>
        `);
        utils_1.Utils.addComponent('uses-library', manifest, `
      <uses-library android:name="org.apache.http.legacy" android:required="false" />
      `);
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs.writeFileSync(manifestPath, builder.build(androidManifest));
    }
    static applyModuleBuild() {
        // 设置 build.gradle
        const appBuildGradlePath = `${constants_1.Constants.NativePath}/app/build.gradle`;
        const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const applyModuleBuild = `apply from: RES_PATH + "/proj/libcocosoppo/build-app.gradle"`;
        const pos = appBuildGradle.indexOf(applyModuleBuild);
        if (pos < 0) {
            fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
        }
    }
}
exports.OppoBuilder = OppoBuilder;
