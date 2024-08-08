"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VivoAdBuilder = void 0;
const fs = __importStar(require("fs"));
const fse = __importStar(require("fs-extra"));
const fast_xml_parser_1 = require("fast-xml-parser");
const utils_1 = require("./utils");
class VivoAdBuilder {
    static afterBuild(options, result) {
        VivoAdBuilder.copyModule(result);
        VivoAdBuilder.copyManifest(options, result);
        utils_1.Utils.addServices(result, 'com.cocos.vivo.ad.VivoAdService');
    }
    static copyModule(result) {
        fse.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocosvivo/`);
        // 追加内容
        fse.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosvivo/build.gradle`, { encoding: 'binary' })}`);
        fse.appendFileSync(`${result.dest}/proj/proguard-rules-ccams.pro`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosvivo/proguard-rules.pro`, { encoding: 'binary' })}`);
    }
    static copyManifest(options, result) {
        const manifestPath = `${result.dest}/proj/AndroidManifest.xml`;
        const parser = new fast_xml_parser_1.XMLParser(utils_1.PARSE_OPTIONS);
        const androidManifest = parser.parse(fs.readFileSync(manifestPath, { encoding: 'binary' }));
        const manifest = androidManifest['manifest'];
        manifest['@_xmlns:tools'] = 'http://schemas.android.com/tools';
        // 属性
        const application = manifest['application'];
        application['@_tools:replace'] = 'android:allowBackup';
        application['@_android:hardwareAccelerated'] = 'true';
        // 权限
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.INTERNET');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.ACCESS_NETWORK_STATE');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.ACCESS_WIFI_STATE');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.READ_PHONE_STATE');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.REQUEST_INSTALL_PACKAGES');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.ACCESS_COARSE_LOCATION');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.ACCESS_FINE_LOCATION');
        utils_1.Utils.addUsesPermission(manifest, 'android.permission.WAKE_LOCK');
        // 组件
        utils_1.Utils.addComponent('provider', manifest, `
      <provider 
        android:name="com.bytedance.sdk.openadsdk.multipro.TTMultiProvider" 
        android:authorities="\${applicationId}.TTMultiProvider" 
        android:exported="false"
      />
      `);
        utils_1.Utils.addComponent('provider', manifest, `
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
        utils_1.Utils.addComponent('provider', manifest, `
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
        const builder = new fast_xml_parser_1.XMLBuilder(utils_1.BUILDER_OPTIONS);
        fs.writeFileSync(manifestPath, builder.build(androidManifest));
    }
}
exports.VivoAdBuilder = VivoAdBuilder;
