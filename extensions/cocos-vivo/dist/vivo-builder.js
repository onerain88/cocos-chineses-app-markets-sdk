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
class VivoBuilder {
    static copyJava() {
        fse.copySync(`${__dirname}/../android/java/`, `${VivoBuilder.NativePath}/app/src/`);
    }
    static copyLibs() {
        fse.copySync(`${__dirname}/../android/libs/`, `${VivoBuilder.NativePath}/app/libs/`);
    }
    static copyAndroidManifest(options) {
        const { appId, appType } = options.packages[global_1.PACKAGE_NAME];
        const manifestPath = `${VivoBuilder.NativePath}/app/AndroidManifest.xml`;
        const manifest = fs.readFileSync(manifestPath, { encoding: 'binary' });
        const parser = new DOMParser();
        const doc = parser.parseFromString(manifest, 'text/xml');
        // provider
        const applicationNode = doc.getElementsByTagName("manifest")[0]
            .getElementsByTagName("application")[0];
        const providerNodes = applicationNode.getElementsByTagName("provider");
        let vivoProviderExist = false;
        for (let i = 0; i < providerNodes.length; i++) {
            const providerNode = providerNodes[i];
            const attr = providerNode.getAttribute("android:name");
            if (attr === 'com.vivo.unionsdk.VivoUnionProvider') {
                vivoProviderExist = true;
                providerNode.setAttribute("android:name", "com.vivo.unionsdk.VivoUnionProvider");
                providerNode.setAttribute("android:authorities", "${applicationId}.VivoUnionProvider");
                providerNode.setAttribute("android:enabled", "true");
                providerNode.setAttribute("android:exported", "true");
                break;
            }
        }
        if (!vivoProviderExist) {
            const providerNode = doc.createElement("provider");
            providerNode.setAttribute("android:name", "com.vivo.unionsdk.VivoUnionProvider");
            providerNode.setAttribute("android:authorities", "${applicationId}.VivoUnionProvider");
            providerNode.setAttribute("android:enabled", "true");
            providerNode.setAttribute("android:exported", "true");
            if (providerNodes.length > 0) {
                providerNodes[0].parentNode.appendChild(providerNode);
            }
            else {
                applicationNode.appendChild(providerNode);
            }
        }
        // meta
        const metaNodes = applicationNode.getElementsByTagName("meta-data");
        let appIdExist = false;
        let appTypeExist = false;
        for (let i = 0; i < metaNodes.length; i++) {
            const metaNode = metaNodes[i];
            const attr = metaNode.getAttribute("android:name");
            if (attr === 'vivoUnionAppId') {
                appIdExist = true;
                metaNode.setAttribute("android:value", appId);
            }
            else if (attr === 'vivoUnionAppType') {
                appTypeExist = true;
                metaNode.setAttribute("android:value", `${appType}`);
            }
        }
        if (!appIdExist) {
            const metaNode = doc.createElement("meta-data");
            metaNode.setAttribute("android:name", "vivoUnionAppId");
            metaNode.setAttribute("android:value", appId);
            metaNodes[0].parentNode.appendChild(metaNode);
        }
        if (!appTypeExist) {
            const metaNode = doc.createElement("meta-data");
            metaNode.setAttribute("android:name", "vivoUnionAppType");
            metaNode.setAttribute("android:value", `${appType}`);
            metaNodes[0].parentNode.appendChild(metaNode);
        }
        const serializer = new XMLSerializer();
        fs.writeFileSync(manifestPath, serializer.serializeToString(doc));
    }
    static copyProguard() {
        const vivoProguardPath = `${__dirname}/../android/proguard-rules.pro`;
        const proguardPath = `${VivoBuilder.NativePath}/app/proguard-rules.pro`;
        const firstFileLines = VivoBuilder.readFileLines(vivoProguardPath);
        const secondFileLines = VivoBuilder.readFileLines(proguardPath);
        for (const line of firstFileLines) {
            VivoBuilder.checkAndAppendLineIfNotExists(line, secondFileLines, proguardPath);
        }
    }
    // 同步地读取文件的所有行并返回内容数组
    static readFileLines(filePath) {
        const content = fse.readFileSync(filePath, 'utf8');
        return content.trim().split('\n');
    }
    // 在文件末尾追加内容，确保从新行开始
    static appendContent(filePath, contentToAdd) {
        const data = fse.readFileSync(filePath, 'utf8');
        if (!data.endsWith('\n')) {
            // 如果文件的最后一行不以换行符结束，先追加换行符
            fse.appendFileSync(filePath, '\n');
        }
        // 追加新内容
        fse.appendFileSync(filePath, contentToAdd);
    }
    // 检查行是否存在于数组中，并在不存在时追加到文件
    static checkAndAppendLineIfNotExists(line, lines, filePath) {
        if (!lines.includes(line)) {
            VivoBuilder.appendContent(filePath, `${line}\n`);
            console.log(`Line appended: ${line}`);
        }
    }
    static copyServices(result) {
        const serviceJsonPath = `${result.dest}/assets/service.json`;
        const fileExists = fse.pathExistsSync(serviceJsonPath);
        if (!fileExists) {
            fse.ensureFileSync(serviceJsonPath);
            fs.writeFileSync(serviceJsonPath, JSON.stringify({}, null, 2));
        }
        const serviceJson = JSON.parse(fs.readFileSync(serviceJsonPath, { encoding: 'binary' }));
        if (!serviceJson['serviceClasses']) {
            serviceJson['serviceClasses'] = [];
        }
        if (!serviceJson['serviceClasses'].includes('com.cocos.vivo.VivoService')) {
            serviceJson['serviceClasses'].push('com.cocos.vivo.VivoService');
        }
        fs.writeFileSync(serviceJsonPath, JSON.stringify(serviceJson, null, 2));
    }
}
exports.VivoBuilder = VivoBuilder;
VivoBuilder.NativePath = `${Editor.Project.path}/native/engine/android`;
