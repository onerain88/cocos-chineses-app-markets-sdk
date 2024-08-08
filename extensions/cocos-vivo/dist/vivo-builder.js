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
exports.VivoBuilder = void 0;
const fs = __importStar(require("fs"));
const fse = __importStar(require("fs-extra"));
const global_1 = require("./global");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const fast_xml_parser_1 = require("fast-xml-parser");
class VivoBuilder {
    static afterBuild(options, result) {
        VivoBuilder.copyModule(result);
        VivoBuilder.newAndroidManifest(options, result);
        VivoBuilder.includeProguard(result);
        VivoBuilder.applyModuleBuild();
        utils_1.Utils.addServices(result, 'com.cocos.vivo.VivoService');
    }
    static copyModule(result) {
        fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosvivo/`);
        fse.copySync(`${result.dest}/proj/libcocosvivo/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
        fse.copySync(`${result.dest}/proj/libcocosvivo/proguard-rules.pro`, `${result.dest}/proj/proguard-rules-ccams.pro`);
    }
    static newAndroidManifest(options, result) {
        // 1. 克隆 app/AndroidManifest.xml 到 proj 下
        const appManifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
        fse.copySync(appManifestPath, projManifestPath);
        // 2. 修改 proj/AndroidManifest.xml
        const { appId, appType } = options.packages[global_1.PACKAGE_NAME];
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        utils_1.Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.vivo.unionsdk.VivoUnionProvider" 
        android:authorities="\${applicationId}.VivoUnionProvider" 
        android:enabled="true" 
        android:exported="true"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="vivoUnionAppId" 
        android:value="${appId}"/>
        `);
        utils_1.Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="vivoUnionAppType" 
        android:value="${appType}"/>`);
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs.writeFileSync(projManifestPath, builder.build(androidManifest));
        // 3. 指向 proj/AndroidManifest.xml
        // 已在预制 libcocosvivo/build.gradle 中指定
    }
    static includeProguard(result) {
        // 拷贝 proguard-rules.pro
        fse.copySync(`${result.dest}/proj/libcocosvivo/proguard-rules.pro`, `${result.dest}/proj/proguard-rules-ccams.pro`);
        // 使用 -include 语法
        const proguardPath = `${constants_1.Constants.NativePath}/app/proguard-rules.pro`;
        const proguard = fs.readFileSync(proguardPath, { encoding: 'binary' });
        const includeOppoProguard = `-include "${result.dest}/proj/proguard-rules-ccams.pro"`;
        const pos = proguard.indexOf(includeOppoProguard);
        if (pos < 0) {
            fs.writeFileSync(proguardPath, proguard + "\n" + includeOppoProguard + "\n");
        }
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
exports.VivoBuilder = VivoBuilder;
