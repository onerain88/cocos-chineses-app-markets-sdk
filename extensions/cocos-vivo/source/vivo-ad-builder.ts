import * as fs from 'fs';
import * as fse from 'fs-extra';

import { XMLBuilder, XMLParser } from "fast-xml-parser";

import { IBuildResult, ITaskOptions } from "../@types";
import { Constants } from "./constants";
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';


export class VivoAdBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    VivoAdBuilder.copyDependencies();
    VivoAdBuilder.copyLibs();
    VivoAdBuilder.copyManifest(options);
    VivoAdBuilder.copyProguard();
  }

  public static copyDependencies() {
    Utils.appendDependencies(`${Constants.NativePath}/app/build.gradle`, `${__dirname}/../ad/build.gradle`);
  }

  public static copyLibs() {
    fse.copySync(`${__dirname}/../ad/libs/`, `${Constants.NativePath}/app/libs/`);
  }

  public static copyManifest(options: ITaskOptions) {
    const manifestPath = `${Constants.NativePath}/app/AndroidManifest.xml`;

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    // 属性
    const application = manifest['application'];
    application['@_tools:replace'] = 'android:allowBackup';
    application['@_android:hardwareAccelerated'] = 'true';
    // 权限
    Utils.addUsesPermission(manifest, 'android.permission.INTERNET');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_NETWORK_STATE');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_WIFI_STATE');
    Utils.addUsesPermission(manifest, 'android.permission.READ_PHONE_STATE');
    Utils.addUsesPermission(manifest, 'android.permission.REQUEST_INSTALL_PACKAGES');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_COARSE_LOCATION');
    Utils.addUsesPermission(manifest, 'android.permission.ACCESS_FINE_LOCATION');
    Utils.addUsesPermission(manifest, 'android.permission.WAKE_LOCK');
    // 组件
    Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.bytedance.sdk.openadsdk.multipro.TTMultiProvider" 
        android:authorities="\${applicationId}.TTMultiProvider" 
        android:exported="false"
      />
      `);
    Utils.addComponent('provider', manifest, `
      <provider
        android:name="com.bytedance.sdk.openadsdk.TTFileProvider"
        android:authorities="\${applicationId}.TTFileProvider"
        android:exported="false"
        android:grantUriPermissions="true">
          <meta-data
            android:name="android.support.FILE_PROVIDER_PATHS"
            android:resource="@xml/file_paths" />
      </provider>
      `);
    Utils.addComponent('provider', manifest, `
      <provider
        android:name="android.support.v4.content.FileProvider"
        android:authorities="\${applicationId}.fileprovider"
        android:exported="false"
        android:grantUriPermissions="true">
          <meta-data
            android:name="android.support.FILE_PROVIDER_PATHS"
            android:resource="@xml/gdt_file_path" />
      </provider>
      `);

    const builder = new XMLBuilder(BUILDER_OPTIONS);
    fs.writeFileSync(manifestPath, builder.build(androidManifest));
  }

  public static copyProguard() {
    const vivoProguardPath = `${__dirname}/../ad/proguard-rules.pro`;
    const proguardPath = `${Constants.NativePath}/app/proguard-rules.pro`;

    const firstFileLines = Utils.readFileLines(vivoProguardPath);
    const secondFileLines = Utils.readFileLines(proguardPath);

    for (const line of firstFileLines) {
      Utils.checkAndAppendLineIfNotExists(line, secondFileLines, proguardPath);
    }
  }
}