import * as fs from 'fs';
import * as fse from 'fs-extra';
import { IBuildResult, ITaskOptions } from '../@types';
import { PACKAGE_NAME } from './global';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Constants } from './constants';
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';

export class OppoBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    OppoBuilder.copyModule(result);
    OppoBuilder.copyAndroidManifest(options, result);
    OppoBuilder.copyProguard(result);
    OppoBuilder.copyBuild(result);
    OppoBuilder.applyModuleBuild();
    Utils.addServices(result, 'com.cocos.oppo.OppoService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosoppo/`);
  }

  private static copyAndroidManifest(options: ITaskOptions, result: IBuildResult) {
    // 1. 克隆 app/AndroidManifest.xml 到 proj 下
    const appManifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;
    const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
    fse.copySync(appManifestPath, projManifestPath);

    // 2. 修改 proj/AndroidManifest.xml
    const { appKey, debugMode, isOfflineGame } = options.packages[PACKAGE_NAME];

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';

    const application = manifest['application'];
    application['@_tools:replace'] = 'android:allowBackup';

    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="app_key" 
        android:value="${appKey}"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="debug_mode" 
        android:value="${debugMode}"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="is_offline_game" 
        android:value="${isOfflineGame}"/>
        `);
    Utils.addComponent('uses-library', manifest, `
      <uses-library android:name="org.apache.http.legacy" android:required="false" />
      `);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(projManifestPath, builder.build(androidManifest));
  }

  private static copyBuild(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosoppo/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
  }

  private static copyProguard(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosoppo/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`)
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
}