import fs from 'fs'
import fse from 'fs-extra'
import { ITaskOptions, IBuildResult } from '../@types';
import { X2jOptions, XMLBuilder, XmlBuilderOptions, XMLParser } from 'fast-xml-parser';
import { PACKAGE_NAME } from './global';
import { Utils } from './utils';
import { Constants } from './constants';

export const PARSE_OPTIONS: X2jOptions = {
  ignoreAttributes: false,
  isArray: (tagName: string, jPath: string, isLeafNode: boolean, isAttribute: boolean) => {
    return tagName === "provider" || tagName === "activity" || tagName === "service" || tagName === "receiver" ||
      tagName === "meta-data" || tagName === "uses-permission";
  }
}

export const BUILDER_OPTIONS: XmlBuilderOptions = {
  ignoreAttributes: false,
  suppressBooleanAttributes: false,
  suppressEmptyNode: true,
  format: true,
}

export class XiaoMiBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    // 1. 修改 libcocosxiaomi 中 AndroidManifest.xml 的配置
    console.log(options.packages)
    const { appId, appKey } = options.packages[PACKAGE_NAME];
    console.log('appId', appId, 'appKey', appKey);

    const manifestPath = `${__dirname}/../common/libcocosxiaomi/src/main/AndroidManifest.xml`;
    const META_DATA = 'meta-data';

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));
    const manifest = androidManifest['manifest'];

    const metadatas = manifest['application'][META_DATA] as Object[];
    metadatas.forEach(metadata => {
      if (metadata['@_android:name'] === 'miGameAppId') {
        metadata['@_android:value'] = appId;
      } else if (metadata['@_android:name'] === 'miGameAppKey') {
        metadata['@_android:value'] = appKey;
      }
    });

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(manifestPath, builder.build(androidManifest));

    // 2. 拷贝 libcocosxiaomi
    fse.copySync(`${__dirname}/../common/libcocosxiaomi/`, `${result.dest}/proj/libcocosxiaomi/`);

    Utils.addServices(result, 'com.cocos.xiaomi.XiaoMiService');

    // 3. 添加模块
    const settingsPath = `${result.dest}/proj/settings.gradle`;
    const projSettings = fs.readFileSync(settingsPath, { encoding: 'binary' });
    const includeLibXiaoMi = "include ':libcocosxiaomi'";

    let pos = projSettings.indexOf(includeLibXiaoMi);
    if (pos < 0) {
      fs.writeFileSync(settingsPath, projSettings + "\n" + includeLibXiaoMi + "\n");
    }

    // 4. 添加子模块依赖
    const appBuildGradlePath = `${Constants.NativePath}/app/build.gradle`;
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
    const dependentXiaoMiModule = `dependencies {
    implementation project(':libcocosxiaomi')
}`;
    pos = appBuildGradle.indexOf(dependentXiaoMiModule);
    if (pos < 0) {
      fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + dependentXiaoMiModule + "\n");
    }

    // 5. 添加依赖仓库
    const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
    const projectBuildGradle = fs.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
    const applyXiaoMiRepo = 'apply from: RES_PATH + "/proj/libcocosxiaomi/build-repo.gradle"';
    pos = projectBuildGradle.indexOf(applyXiaoMiRepo);
    if (pos < 0) {
      fs.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyXiaoMiRepo + "\n");
    }
  }
}