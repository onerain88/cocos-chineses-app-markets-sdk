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
        OppoBuilder.copyAndroidManifest(options, result);
        OppoBuilder.copyProguard(result);
        OppoBuilder.copyBuild(result);
        OppoBuilder.applyModuleBuild();
        utils_1.Utils.addServices(result, 'com.cocos.oppo.OppoService');
    }
    static copyModule(result) {
        fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosoppo/`);
    }
    static copyAndroidManifest(options, result) {
        // 1. 克隆 app/AndroidManifest.xml 到 proj 下
        const appManifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
        fse.copySync(appManifestPath, projManifestPath);
        // 2. 修改 proj/AndroidManifest.xml
        const { appKey, debugMode, isOfflineGame } = options.packages[global_1.PACKAGE_NAME];
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
        const application = manifest['application'];
        application['@_tools:replace'] = 'android:allowBackup';
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="app_key" 
        android:value="${appKey}"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="debug_mode" 
        android:value="${debugMode}"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="is_offline_game" 
        android:value="${isOfflineGame}"/>
        `);
        utils_1.Utils.addComponent('uses-library', manifest, `
      <uses-library android:name="org.apache.http.legacy" android:required="false" />
      `);
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs.writeFileSync(projManifestPath, builder.build(androidManifest));
    }
    static copyBuild(result) {
        fse.copySync(`${result.dest}/proj/libcocosoppo/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
    }
    static copyProguard(result) {
        fse.copySync(`${result.dest}/proj/libcocosoppo/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`);
    }
    static applyModuleBuild() {
        // 设置 build.gradle
        const appBuildGradlePath = `${constants_1.Constants.NativePath}/app/build.gradle`;
        const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const applyModuleBuild = `apply from: RES_PATH + "/proj/build-ccams.gradle"`;
        const pos = appBuildGradle.indexOf(applyModuleBuild);
        if (pos < 0) {
            fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
        }
    }
}
exports.OppoBuilder = OppoBuilder;
