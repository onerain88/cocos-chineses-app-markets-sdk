import fs from 'fs';
import fse from 'fs-extra';
import { ITaskOptions, IBuildResult } from "../@types";
import { Utils } from './utils';
import { Constants } from './constants';

export class HuaWeiBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    // 1. 拷贝 libcocoshuawei
    fse.copySync(`${__dirname}/../core/libcocoshuawei/`, `${result.dest}/proj/libcocoshuawei/`);

    Utils.addServices(result, 'com.cocos.huawei.HuaWeiService');
    Utils.addServices(result, 'com.cocos.huawei.ad.HuaWeiAdService');

    // 2. 添加模块
    const settingsPath = `${result.dest}/proj/settings.gradle`;
    const projSettings = fs.readFileSync(settingsPath, { encoding: 'binary' });
    const includeLibHuaWei = "include ':libcocoshuawei'";

    let pos = projSettings.indexOf(includeLibHuaWei);
    if (pos < 0) {
      fs.writeFileSync(settingsPath, projSettings + "\n" + includeLibHuaWei + "\n");
    }

    // 3. 添加子模块依赖
    const appBuildGradlePath = `${Constants.NativePath}/app/build.gradle`;
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
    const dependentHuaWeiModule = `dependencies {
    implementation project(':libcocoshuawei')
}`;
    pos = appBuildGradle.indexOf(dependentHuaWeiModule);
    if (pos < 0) {
      fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + dependentHuaWeiModule + "\n");
    }

    // 4. 添加依赖仓库
    const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
    let projectBuildGradle = fs.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
    const applyHuaWeiRepo = 'apply from: RES_PATH + "/proj/libcocoshuawei/build-repo.gradle"';
    pos = projectBuildGradle.indexOf(applyHuaWeiRepo);
    if (pos < 0) {
      fs.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyHuaWeiRepo + "\n");
    }

    // 5. 拷贝 agconnect-services.json
    fse.copySync(`${__dirname}/../core/agconnect-services.json`, `${result.dest}/assets/agconnect-services.json`);

  }
}