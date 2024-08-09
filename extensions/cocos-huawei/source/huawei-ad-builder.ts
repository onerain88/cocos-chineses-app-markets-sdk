import fs from 'fs';
import fse from 'fs-extra';
import { ITaskOptions, IBuildResult } from "../@types";
import { Utils } from './utils';
import { Constants } from './constants';

export class HuaWeiAdBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    HuaWeiAdBuilder.copyModule(result);
    HuaWeiAdBuilder.appendProguard(result);
    HuaWeiAdBuilder.appendBuild(result);
    Utils.addServices(result, 'com.cocos.huawei.ad.HuaWeiAdService');
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocoshuawei/`);
  }

  private static appendBuild(result: IBuildResult) {
    fse.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs.readFileSync(`${result.dest}/proj/libcocoshuawei/build.gradle`, { encoding: 'binary' })}`)
  }

  private static appendProguard(result: IBuildResult) {
    fse.appendFileSync(`${result.dest}/proj/proguard-rules.pro`, `\n${fs.readFileSync(`${result.dest}/proj/libcocoshuawei/proguard-rules.pro`, { encoding: 'binary' })}`);
  }
}