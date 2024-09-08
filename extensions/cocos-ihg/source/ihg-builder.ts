import fs from 'fs';
import fse from 'fs-extra';
import { ITaskOptions, IBuildResult } from "../@types";

export class IHGBuilder {
  public static readonly NativePath = `${Editor.Project.path}/native/engine/android`

  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    IHGBuilder.copyModule(result);
    IHGBuilder.copyBuild(result);
    IHGBuilder.copyProguard(result);
    IHGBuilder.applyModuleBuild();
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libihgcommon/`);
  }

  private static copyBuild(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libihgcommon/build.gradle`, `${result.dest}/proj/build-ihg.gradle`);
  }

  private static copyProguard(result: IBuildResult) {
    fse.copySync(`${result.dest}/proj/libihgcommon/proguard-rules.pro`, `${result.dest}/proj/proguard-rules-ihg.pro`);
  }

  private static applyModuleBuild() {
    // 设置 build.gradle
    const appBuildGradlePath = `${IHGBuilder.NativePath}/app/build.gradle`;
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, { encoding: 'binary' });
    const applyModuleBuild = `apply from: RES_PATH + "/proj/build-ihg.gradle"`;
    const pos = appBuildGradle.indexOf(applyModuleBuild);
    if (pos < 0) {
      fs.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
    }
  }
}