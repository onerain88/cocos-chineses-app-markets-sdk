import * as fs from 'fs';
import * as fse from 'fs-extra';

import { XMLBuilder, XMLParser } from "fast-xml-parser";

import { IBuildResult, ITaskOptions } from "../@types";
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';


export class VivoAdBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    VivoAdBuilder.copyModule(result);
    VivoAdBuilder.copyManifest(options, result);
    Utils.addServices(result, 'com.cocos.vivo.ad.VivoAdService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocosvivo/`);
    // 追加内容
    fse.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosvivo/build.gradle`, { encoding: 'binary' })}`)
    fse.appendFileSync(`${result.dest}/proj/proguard-rules-ccams.pro`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosvivo/proguard-rules.pro`, { encoding: 'binary' })}`);
  }

  public static copyManifest(options: ITaskOptions, result: IBuildResult) {
    const manifestPath = `${result.dest}/proj/AndroidManifest.xml`;

    const parser = new XMLParser(PARSE_OPTIONS);
    const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));

    const manifest = androidManifest['manifest'];
    manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
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
}