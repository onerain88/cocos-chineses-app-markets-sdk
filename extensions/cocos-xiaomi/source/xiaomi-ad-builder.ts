import * as fs from 'fs';
import * as fse from 'fs-extra';

import { IBuildResult, ITaskOptions } from "../@types";
import { Constants } from "./constants";
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from "./utils";
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class XiaoMiAdBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    XiaoMiAdBuilder.copyDependencies();
    XiaoMiAdBuilder.copyJava();
    XiaoMiAdBuilder.copyLibs();
    XiaoMiAdBuilder.copyManifest(options);
    XiaoMiAdBuilder.copyRes(result);
    Utils.addServices(result, 'com.cocos.xiaomi.ad.XiaoMiAdService');

    const gradlePropertiesPath = `${result.dest}/proj/gradle.properties`;
    const gradleProperties = fs.readFileSync(gradlePropertiesPath, { encoding: 'binary' });
    const enableJetifier = "android.enableJetifier=true";

    let pos = gradleProperties.indexOf(enableJetifier);
    if (pos < 0) {
      fs.writeFileSync(gradlePropertiesPath, gradleProperties + "\n" + enableJetifier + "\n");
    }
  }

  public static copyDependencies() {
    Utils.appendDependencies(`${Constants.NativePath}/app/build.gradle`, `${__dirname}/../ad/build.gradle`);
  }

  public static copyJava() {
    fse.copySync(`${__dirname}/../ad/java/`, `${Constants.NativePath}/app/src/`);
  }

  public static copyLibs() {
    fse.copySync(`${__dirname}/../ad/libs/`, `${Constants.NativePath}/app/libs/`);
  }

  public static copyManifest(options: ITaskOptions) {
    const manifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
    // 属性
    const application = manifest['application'];
    application['@_tools:replace'] = 'android:allowBackup';

    // 权限
    Utils.addUsesPermission(manifest, 'android.permission.INTERNET');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_NETWORK_STATE');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_WIFI_STATE');

    // 组件
    Utils.addComponent('provider', manifest, `
      <provider
        android:name="androidx.core.content.FileProvider"
        android:authorities="\${applicationId}.fileprovider"
        android:exported="false"
        android:grantUriPermissions="true">
        <meta-data
          android:name="android.support.FILE_PROVIDER_PATHS"
          android:resource="@xml/mimo_file_paths" />
      </provider>
      `);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(manifestPath, builder.build(androidManifest));
  }

  public static copyRes(result: IBuildResult) {
    const srcResPath = `${__dirname}/../ad/res/`;
    const destResPath = `${result.dest}/proj/res/`;

    fse.copySync(srcResPath, destResPath, { overwrite: true });
  }
}