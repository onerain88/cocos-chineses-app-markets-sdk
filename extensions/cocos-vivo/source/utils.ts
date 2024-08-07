import { X2jOptions, XmlBuilderOptions, XMLParser } from 'fast-xml-parser';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import { IBuildResult, ITaskOptions } from '../@types';

export const PARSE_OPTIONS: X2jOptions = {
  ignoreAttributes: false,
  isArray: (tagName: string, jPath: string, isLeafNode: boolean, isAttribute: boolean) => {
    return tagName === "provider" || tagName === "activity" || tagName === "service" || tagName === "receiver" ||
      tagName === "meta-data" || tagName === "uses-permission" || tagName === "meta-data" || tagName === "uses-library";
  }
}

export const BUILDER_OPTIONS: XmlBuilderOptions = {
  ignoreAttributes: false,
  suppressBooleanAttributes: false,
  suppressEmptyNode: true,
  format: true,
}

export class Utils {
  // 同步地读取文件的所有行并返回内容数组
  public static readFileLines(filePath: string): string[] {
    const content = fse.readFileSync(filePath, 'utf8');
    return content.trim().split('\n');
  }

  // 在文件末尾追加内容，确保从新行开始
  public static appendContent(filePath: string, contentToAdd: string): void {
    const data = fse.readFileSync(filePath, 'utf8');
    if (!data.endsWith('\n')) {
      // 如果文件的最后一行不以换行符结束，先追加换行符
      fse.appendFileSync(filePath, '\n');
    }
    // 追加新内容
    fse.appendFileSync(filePath, contentToAdd);
  }

  // 检查行是否存在于数组中，并在不存在时追加到文件
  public static checkAndAppendLineIfNotExists(line: string, lines: string[], filePath: string): void {
    if (!lines.includes(line)) {
      Utils.appendContent(filePath, `${line}\n`);
    }
  }

  public static addServices(result: IBuildResult, className: string) {
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

  public static addComponent(componentName: string, manifest: Object, compStr: string) {
    const parser = new XMLParser({
      ignoreAttributes: false
    });
    const component = parser.parse(compStr)[componentName];

    const components = manifest['application'][componentName] as Object[];
    if (!components) {
      manifest['application'][componentName] = [component];
    } else {
      if (!components.find(c => c['@_android:name'] === component['@_android:name'])) {
        components.push(component);
      }
    }
  }

  public static addUsesPermission(manifest: Object, permission: string) {
    const usesPermissions = manifest['uses-permission'] as Object[];
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

  public static addMetaData(manifest: Object, metaDataStr: string) {
    const META_DATA = 'meta-data';
    const parser = new XMLParser({
      ignoreAttributes: false
    });
    const metadata = parser.parse(metaDataStr)[META_DATA];
    const metadatas = manifest['application'][META_DATA] as Object[];
    if (!metadatas) {
      manifest['application'][META_DATA] = [metadata];
    } else {
      if (!metadatas.find(c => c['@_android:name'] === metadata['@_android:name'])) {
        metadatas.push(metadata);
      }
    }
  }

  public static appendDependencies(appGradlePath: string, dependenciesGradlePath: string) {
    let appGradle = fs.readFileSync(appGradlePath, { encoding: 'binary' });
    let depGradle = fs.readFileSync(dependenciesGradlePath, { encoding: 'binary' });

    const pos = appGradle.indexOf(depGradle);
    if (pos < 0) {
      fs.writeFileSync(appGradlePath, appGradle + depGradle);
    }
  }
}