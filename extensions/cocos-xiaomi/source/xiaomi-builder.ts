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
    XiaoMiBuilder.copyModule(result);
    XiaoMiBuilder.copyAndroidManifest(options, result);
    XiaoMiBuilder.copyBuild(result);
    XiaoMiBuilder.copyProguard(result);
    XiaoMiBuilder.applyModuleBuild();
    XiaoMiBuilder.applyProjectBuild(result);
    Utils.addServices(result, 'com.cocos.xiaomi.XiaoMiService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosxiaomi/`);
  }

  private static copyAndroidManifest(options: ITaskOptions, result: IBuildResult) {
    // 1. 克隆 app/AndroidManifest.xml 到 proj 下
    const appManifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;
    const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
    fse.copySync(appManifestPath, projManifestPath);

    const { appId, appKey } = options.packages[PACKAGE_NAME];
    console.log('appId', appId, 'appKey', appKey);

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));
    const manifest = androidManifest['manifest'];

    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameAppId" 
        android:value="${appId}"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameAppKey" 
        android:value="${appKey}"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="miGameEnhance" 
        android:value="true"/>
        `);
    Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.xiaomi.gamecenter.sdk.MiOauthProvider" 
        android:authorities="\${applicationId}.mi_provider" 
        android:enabled="true" 
        android:exported="false"/>
        `);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(projManifestPath, builder.build(androidManifest));
  }

  private static copyBuild(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosxiaomi/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
  }

  private static copyProguard(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosxiaomi/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`)
  }

  private static applyModuleBuild() {
    // 设置 build.gradle
    const appBuildGradlePath = `${Constants.NativePath}/app/build.gradle`;
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
    const applyModuleBuild = `apply from: RES_PATH + "/proj/build-ccams.gradle"`;
    const pos = appBuildGradle.indexOf(applyModuleBuild);
    if (pos < 0) {
      fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
    }
  }

  private static applyProjectBuild(result: IBuildResult) {
    const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
    const projectBuildGradle = fs.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
    const applyXiaoMiRepo = 'apply from: RES_PATH + "/proj/libcocosxiaomi/build-repo.gradle"';
    const pos = projectBuildGradle.indexOf(applyXiaoMiRepo);
    if (pos < 0) {
      fs.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyXiaoMiRepo + "\n");
    }
  }
}