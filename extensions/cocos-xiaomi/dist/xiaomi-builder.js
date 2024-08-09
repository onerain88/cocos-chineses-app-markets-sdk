"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiBuilder = exports.BUILDER_OPTIONS = exports.PARSE_OPTIONS = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_xml_parser_1 = require("fast-xml-parser");
const global_1 = require("./global");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
exports.PARSE_OPTIONS = {
    ignoreAttributes: false,
    isArray: (tagName, jPath, isLeafNode, isAttribute) => {
        return tagName === "provider" || tagName === "activity" || tagName === "service" || tagName === "receiver" ||
            tagName === "meta-data" || tagName === "uses-permission";
    }
};
exports.BUILDER_OPTIONS = {
    ignoreAttributes: false,
    suppressBooleanAttributes: false,
    suppressEmptyNode: true,
    format: true,
};
class XiaoMiBuilder {
    static afterBuild(options, result) {
        XiaoMiBuilder.copyModule(result);
        XiaoMiBuilder.copyAndroidManifest(options, result);
        XiaoMiBuilder.copyBuild(result);
        XiaoMiBuilder.copyProguard(result);
        XiaoMiBuilder.applyModuleBuild();
        XiaoMiBuilder.applyProjectBuild(result);
        utils_1.Utils.addServices(result, 'com.cocos.xiaomi.XiaoMiService');
    }
    static copyModule(result) {
        fs_extra_1.default.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosxiaomi/`);
    }
    static copyAndroidManifest(options, result) {
        // 1. 克隆 app/AndroidManifest.xml 到 proj 下
        const appManifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
        fs_extra_1.default.copySync(appManifestPath, projManifestPath);
        const { appId, appKey } = options.packages[global_1.PACKAGE_NAME];
        console.log('appId', appId, 'appKey', appKey);
        const parser = new fast_xml_parser_1.XMLParser(exports.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs_1.default.readFileSync(projManifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameAppId" 
        android:value="${appId}"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameAppKey" 
        android:value="${appKey}"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameEnhance" 
        android:value="true"/>
        `);
        utils_1.Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.xiaomi.gamecenter.sdk.MiOauthProvider" 
        android:authorities="\${applicationId}.mi_provider" 
        android:enabled="true" 
        android:exported="false"/>
        `);
        const builder = new fast_xml_parser_1.XMLBuilder(exports.BUILDER_OPTIONS);
        fs_1.default.writeFileSync(projManifestPath, builder.build(androidManifest));
    }
    static copyBuild(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libcocosxiaomi/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
    }
    static copyProguard(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libcocosxiaomi/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`);
    }
    static applyModuleBuild() {
        // 设置 build.gradle
        const appBuildGradlePath = `${constants_1.Constants.NativePath}/app/build.gradle`;
        const appBuildGradle = fs_1.default.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const applyModuleBuild = `apply from: RES_PATH + "/proj/build-ccams.gradle"`;
        const pos = appBuildGradle.indexOf(applyModuleBuild);
        if (pos < 0) {
            fs_1.default.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
        }
    }
    static applyProjectBuild(result) {
        const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
        const projectBuildGradle = fs_1.default.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
        const applyXiaoMiRepo = 'apply from: RES_PATH + "/proj/libcocosxiaomi/build-repo.gradle"';
        const pos = projectBuildGradle.indexOf(applyXiaoMiRepo);
        if (pos < 0) {
            fs_1.default.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyXiaoMiRepo + "\n");
        }
    }
}
exports.XiaoMiBuilder = XiaoMiBuilder;
