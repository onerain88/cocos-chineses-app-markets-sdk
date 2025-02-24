import * as fs from 'fs';
import * as fse from 'fs-extra';
import { IBuildResult, ITaskOptions } from '../@types';
import { PACKAGE_NAME } from './global';
import { Constants } from './constants';
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class VivoBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    VivoBuilder.copyModule(result);
    VivoBuilder.copyAndroidManifest(options, result);
    VivoBuilder.copyProguard(result);
    VivoBuilder.copyBuild(result);
    VivoBuilder.applyModuleBuild();
    Utils.addServices(result, 'com.cocos.vivo.VivoService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libcocosvivo/`);
  }

  private static copyAndroidManifest(options: ITaskOptions, result: IBuildResult) {
    // 1. 克隆 app/AndroidManifest.xml 到 proj 下
    const appManifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;
    const projManifestPath = `${result.dest}/proj/AndroidManifest.xml`;
    fse.copySync(appManifestPath, projManifestPath);

    // 2. 修改 proj/AndroidManifest.xml
    const { appId, appType } = options.packages[PACKAGE_NAME];

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(projManifestPath, { encoding: 'binary' }));
    const manifest = androidManifest['manifest'];
    Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.vivo.unionsdk.VivoUnionProvider" 
        android:authorities="\${applicationId}.VivoUnionProvider" 
        android:enabled="true" 
        android:exported="true"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="vivoUnionAppId" 
        android:value="${appId}"/>
        `);
    Utils.addComponent('meta-data', manifest, `
      <meta-data 
        android:name="vivoUnionAppType" 
        android:value="${appType}"/>`);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(projManifestPath, builder.build(androidManifest));

    // 3. 指向 proj/AndroidManifest.xml
    // 已在预制 libcocosvivo/build.gradle 中指定
  }

  private static copyBuild(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosvivo/build.gradle`, `${result.dest}/proj/build-ccams.gradle`);
  }

  private static copyProguard(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libcocosvivo/proguard-rules.pro`, `${result.dest}/proj/proguard-rules.pro`)
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