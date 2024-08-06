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
exports.Utils = void 0;
// import { X2jOptions, XmlBuilderOptions, XMLParser } from 'fast-xml-parser';
const fse = __importStar(require("fs-extra"));
const fs = __importStar(require("fs"));
// export const PARSE_OPTIONS: X2jOptions = {
//   ignoreAttributes: false,
//   isArray: (tagName: string, jPath: string, isLeafNode: boolean, isAttribute: boolean) => {
//     return tagName === "provider" || tagName === "activity" || tagName === "service" || tagName === "receiver" ||
//       tagName === "meta-data" || tagName === "uses-permission";
//   }
// }
// export const BUILDER_OPTIONS: XmlBuilderOptions = {
//   ignoreAttributes: false,
//   suppressBooleanAttributes: false,
//   suppressEmptyNode: true,
//   format: true,
// }
class Utils {
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
            Utils.appendContent(filePath, `${line}\n`);
        }
    }
    static addServices(result, className) {
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
        if (!serviceJson['serviceClasses'].includes(className)) {
            serviceJson['serviceClasses'].push(className);
        }
        fs.writeFileSync(serviceJsonPath, JSON.stringify(serviceJson, null, 2));
    }
    // public static addComponent(componentName: string, manifest: Object, compStr: string) {
    //   const parser = new XMLParser({
    //     ignoreAttributes: false
    //   });
    //   const component = parser.parse(compStr)[componentName];
    //   const components = manifest['application'][componentName] as Object[];
    //   if (!components) {
    //     manifest['application'][componentName] = [component];
    //   } else {
    //     if (!components.find(c => c['@_android:name'] === component['@_android:name'])) {
    //       components.push(component);
    //     }
    //   }
    // }
    static addUsesPermission(manifest, permission) {
        const usesPermissions = manifest['uses-permission'];
        let containsPermission = false;
        for (let i = 0; i < usesPermissions.length; i++) {
            const permissionNode = usesPermissions[i];
            if (permissionNode['@_android:name'] === permission) {
                containsPermission = true;
                break;
            }
        }
        if (!containsPermission) {
            usesPermissions.push({ '@_android:name': permission });
        }
    }
    // public static addMetaData(manifest: Object, metaDataStr: string) {
    //   const META_DATA = 'meta-data';
    //   const parser = new XMLParser({
    //     ignoreAttributes: false
    //   });
    //   const metadata = parser.parse(metaDataStr)[META_DATA];
    //   const metadatas = manifest['application'][META_DATA] as Object[];
    //   if (!metadatas) {
    //     manifest['application'][META_DATA] = [metadata];
    //   } else {
    //     if (!metadatas.find(c => c['@_android:name'] === metadata['@_android:name'])) {
    //       metadatas.push(metadata);
    //     }
    //   }
    // }
    static appendDependencies(appGradlePath, dependenciesGradlePath) {
        let appGradle = fs.readFileSync(appGradlePath, { encoding: 'binary' });
        let depGradle = fs.readFileSync(dependenciesGradlePath, { encoding: 'binary' });
        const pos = appGradle.indexOf(depGradle);
        if (pos < 0) {
            fs.writeFileSync(appGradlePath, appGradle + depGradle);
        }
    }
}
exports.Utils = Utils;
