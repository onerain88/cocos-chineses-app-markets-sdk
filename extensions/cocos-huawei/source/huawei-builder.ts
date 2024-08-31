import fs from 'fs';
import fse from 'fs-extra';
import { ITaskOptions, IBuildResult } from "../@types";
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';
import { Constants } from './constants';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class HuaWeiBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    HuaWeiBuilder.copyModule(result);
    HuaWeiBuilder.copyAndroidManifest(options, result);
    HuaWeiBuilder.copyProguard(result);
    HuaWeiBuilder.copyBuild(result);
    HuaWeiBuilder.applyModuleBuild();
    HuaWeiBuilder.copyAgconnectServices(result);
    Utils.addServices(result, 'com.cocos.huawei.HuaWeiService');
  }

  private static copyAndroidManifest(options: ITaskOptions, result: IBuildResult) {
    // 1. 克隆 app/AndroidManifest.xml 到 proj 下
    const appManifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;
    const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
    fse.copySync(appManifestPath, projManifestPath);

    // 2. 修改 proj/AndroidManifest.xml
    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
    const application = manifest['application'];
    application['@_android:usesCleartextTraffic'] = 'true';
    application['@_tools:replace'] = 'android:allowBackup';

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(projManifestPath, builder.build(androidManifest));
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocoshuawei/`);
  }

  private static copyBuild(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocoshuawei/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
  }

  private static copyProguard(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocoshuawei/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`)
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

  private static copyAgconnectServices(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/agconnect-services.json`, `${result.dest}/assets/agconnect-services.json`);
  }
}