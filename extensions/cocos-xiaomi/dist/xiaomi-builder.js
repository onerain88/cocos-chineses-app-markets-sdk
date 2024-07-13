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
        // 1. 修改 libcocosxiaomi 中 AndroidManifest.xml 的配置
        console.log(options.packages);
        const { appId, appKey } = options.packages[global_1.PACKAGE_NAME];
        console.log('appId', appId, 'appKey', appKey);
        const manifestPath = `${__dirname}/../common/libcocosxiaomi/src/main/AndroidManifest.xml`;
        const META_DATA = 'meta-data';
        const parser = new fast_xml_parser_1.XMLParser(exports.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs_1.default.readFileSync(manifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        const metadatas = manifest['application'][META_DATA];
        metadatas.forEach(metadata => {
            if (metadata['@_android:name'] === 'miGameAppId') {
                metadata['@_android:value'] = appId;
            }
            else if (metadata['@_android:name'] === 'miGameAppKey') {
                metadata['@_android:value'] = appKey;
            }
        });
        const builder = new fast_xml_parser_1.XMLBuilder(exports.BUILDER_OPTIONS);
        fs_1.default.writeFileSync(manifestPath, builder.build(androidManifest));
        // 2. 拷贝 libcocosxiaomi
        fs_extra_1.default.copySync(`${__dirname}/../common/libcocosxiaomi/`, `${result.dest}/proj/libcocosxiaomi/`);
        utils_1.Utils.addServices(result, 'com.cocos.xiaomi.XiaoMiService');
        // 3. 添加模块
        const settingsPath = `${result.dest}/proj/settings.gradle`;
        const projSettings = fs_1.default.readFileSync(settingsPath, { encoding: 'binary' });
        const includeLibXiaoMi = "include ':libcocosxiaomi'";
        let pos = projSettings.indexOf(includeLibXiaoMi);
        if (pos < 0) {
            fs_1.default.writeFileSync(settingsPath, projSettings + "\n" + includeLibXiaoMi + "\n");
        }
        // 4. 添加子模块依赖
        const appBuildGradlePath = `${constants_1.Constants.NativePath}/app/build.gradle`;
        const appBuildGradle = fs_1.default.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const dependentXiaoMiModule = `dependencies {
    implementation project(':libcocosxiaomi')
}`;
        pos = appBuildGradle.indexOf(dependentXiaoMiModule);
        if (pos < 0) {
            fs_1.default.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + dependentXiaoMiModule + "\n");
        }
        // 5. 添加依赖仓库
        const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
        const projectBuildGradle = fs_1.default.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
        const applyXiaoMiRepo = 'apply from: RES_PATH + "/proj/libcocosxiaomi/build-repo.gradle"';
        pos = projectBuildGradle.indexOf(applyXiaoMiRepo);
        if (pos < 0) {
            fs_1.default.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyXiaoMiRepo + "\n");
        }
    }
}
exports.XiaoMiBuilder = XiaoMiBuilder;
