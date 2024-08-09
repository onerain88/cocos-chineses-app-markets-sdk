"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaWeiBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const fast_xml_parser_1 = require("fast-xml-parser");
class HuaWeiBuilder {
    static afterBuild(options, result) {
        HuaWeiBuilder.copyModule(result);
        HuaWeiBuilder.copyAndroidManifest(options, result);
        HuaWeiBuilder.copyProguard(result);
        HuaWeiBuilder.copyBuild(result);
        HuaWeiBuilder.applyModuleBuild();
        HuaWeiBuilder.copyAgconnectServices(result);
        utils_1.Utils.addServices(result, 'com.cocos.huawei.HuaWeiService');
    }
    static copyAndroidManifest(options, result) {
        // 1. 克隆 app/AndroidManifest.xml 到 proj 下
        const appManifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
        fs_extra_1.default.copySync(appManifestPath, projManifestPath);
        // 2. 修改 proj/AndroidManifest.xml
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs_1.default.readFileSync(projManifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
        const application = manifest['application'];
        application['@_android:usesCleartextTraffic'] = 'true';
        application['@_tools:replace'] = 'android:allowBackup';
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs_1.default.writeFileSync(projManifestPath, builder.build(androidManifest));
    }
    static copyModule(result) {
        fs_extra_1.default.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocoshuawei/`);
    }
    static copyBuild(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libcocoshuawei/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
    }
    static copyProguard(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libcocoshuawei/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`);
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
    static copyAgconnectServices(result) {
        fs_extra_1.default.copySync(`${__dirname}/../common/agconnect-services.json`, `${result.dest}/assets/agconnect-services.json`);
    }
}
exports.HuaWeiBuilder = HuaWeiBuilder;
