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
    OppoBuilder.includeProguard(result);
    OppoBuilder.copyAndroidManifest(options);
    OppoBuilder.applyModuleBuild();
    Utils.addServices(result, 'com.cocos.oppo.OppoService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosoppo/`);
  }

  private static includeProguard(result: IBuildResult) {
    // 使用 -include 语法
    const proguardPath = `${Constants.NativePath}/app/proguard-rules.pro`;
    const proguard = fs.readFileSync(proguardPath, { encoding: 'binary' });
    const includeOppoProguard = `-include "${result.dest}/proj/libcocosoppo/proguard-rules.pro"`;
    const pos = proguard.indexOf(includeOppoProguard);
    if (pos < 0) {
      fs.writeFileSync(proguardPath, proguard + "\n" + includeOppoProguard + "\n");
    }
  }

  private static copyAndroidManifest(options: ITaskOptions) {
    const { appKey, debugMode, isOfflineGame } = options.packages[PACKAGE_NAME];
    console.log(`oppo params: ${appKey}, ${debugMode}, ${isOfflineGame}`);

    const manifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    Utils.addMetaData(manifest, `
      <meta-data 
        android:name="app_key" 
        android:value="${appKey}"/>
        `);
    Utils.addMetaData(manifest, `
      <meta-data 
        android:name="debug_mode" 
        android:value="${debugMode}"/>
        `);
    Utils.addMetaData(manifest, `
      <meta-data 
        android:name="is_offline_game" 
        android:value="${isOfflineGame}"/>
        `);
    Utils.addComponent('uses-library', manifest, `
      <uses-library android:name="org.apache.http.legacy" android:required="false" />
      `);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(manifestPath, builder.build(androidManifest));
  }

  private static applyModuleBuild() {
    // 设置 build.gradle
    const appBuildGradlePath = `${Constants.NativePath}/app/build.gradle`;
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
    const applyModuleBuild = `apply from: RES_PATH + "/proj/libcocosoppo/build-app.gradle"`;
    const pos = appBuildGradle.indexOf(applyModuleBuild);
    if (pos < 0) {
      fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
    }
  }
}