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
        VivoBuilder.copyJava();
        VivoBuilder.copyLibs();
        VivoBuilder.copyAndroidManifest(options);
        VivoBuilder.copyProguard();
        utils_1.Utils.addServices(result, 'com.cocos.vivo.VivoService');
    }
    static copyJava() {
        fse.copySync(`${__dirname}/../union/java/`, `${constants_1.Constants.NativePath}/app/src/`);
    }
    static copyLibs() {
        fse.copySync(`${__dirname}/../union/libs/`, `${constants_1.Constants.NativePath}/app/libs/`);
    }
    static copyAndroidManifest(options) {
        const { appId, appType } = options.packages[global_1.PACKAGE_NAME];
        const manifestPath = `${constants_1.Constants.NativePath}/app/AndroidManifest.xml`;
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        utils_1.Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.vivo.unionsdk.VivoUnionProvider" 
        android:authorities="\${applicationId}.VivoUnionProvider" 
        android:enabled="true" 
        android:exported="true"/>
        `);
        utils_1.Utils.addMetaData(manifest, `
      <meta-data 
        android:name="vivoUnionAppId" 
        android:value="${appId}"/>
        `);
        utils_1.Utils.addMetaData(manifest, `
      <meta-data 
        android:name="vivoUnionAppType" 
        android:value="${appType}"/>`);
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs.writeFileSync(manifestPath, builder.build(androidManifest));
    }
    static copyProguard() {
        const vivoProguardPath = `${__dirname}/../union/proguard-rules.pro`;
        const proguardPath = `${constants_1.Constants.NativePath}/app/proguard-rules.pro`;
        const firstFileLines = utils_1.Utils.readFileLines(vivoProguardPath);
        const secondFileLines = utils_1.Utils.readFileLines(proguardPath);
        for (const line of firstFileLines) {
            utils_1.Utils.checkAndAppendLineIfNotExists(line, secondFileLines, proguardPath);
        }
    }
}
exports.VivoBuilder = VivoBuilder;
