import * as fs from 'fs';
import * as fse from 'fs-extra';
import { IBuildResult, ITaskOptions } from '../@types';
import { PACKAGE_NAME } from './global';
import { Constants } from './constants';
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class VivoBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    VivoBuilder.copyJava();
    VivoBuilder.copyLibs();
    VivoBuilder.copyAndroidManifest(options);
    VivoBuilder.copyProguard();
    Utils.addServices(result, 'com.cocos.vivo.VivoService');
  }

  public static copyJava() {
    fse.copySync(`${__dirname}/../union/java/`, `${Constants.NativePath}/app/src/`);
  }

  public static copyLibs() {
    fse.copySync(`${__dirname}/../union/libs/`, `${Constants.NativePath}/app/libs/`);
  }

  public static copyAndroidManifest(options: ITaskOptions) {
    const { appId, appType } = options.packages[PACKAGE_NAME];

    const manifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.vivo.unionsdk.VivoUnionProvider" 
        android:authorities="\${applicationId}.VivoUnionProvider" 
        android:enabled="true" 
        android:exported="true"/>
        `);
    Utils.addMetaData(manifest, `
      <meta-data 
        android:name="vivoUnionAppId" 
        android:value="${appId}"/>
        `);
    Utils.addMetaData(manifest, `
      <meta-data 
        android:name="vivoUnionAppType" 
        android:value="${appType}"/>`);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(manifestPath, builder.build(androidManifest));
  }

  public static copyProguard() {
    const vivoProguardPath = `${__dirname}/../union/proguard-rules.pro`;
    const proguardPath = `${Constants.NativePath}/app/proguard-rules.pro`;

    const firstFileLines = Utils.readFileLines(vivoProguardPath);
    const secondFileLines = Utils.readFileLines(proguardPath);

    for (const line of firstFileLines) {
      Utils.checkAndAppendLineIfNotExists(line, secondFileLines, proguardPath);
    }
  }
}