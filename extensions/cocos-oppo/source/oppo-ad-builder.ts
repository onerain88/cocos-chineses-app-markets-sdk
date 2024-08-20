import * as fs from 'fs';
import * as fse from 'fs-extra';
import { IBuildResult, ITaskOptions } from '../@types';
import { PACKAGE_NAME } from './global';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Constants } from './constants';
import { BUILDER_OPTIONS, PARSE_OPTIONS, Utils } from './utils';

export class OppoAdBuilder {
  public static afterBuild(options: ITaskOptions, result: IBuildResult) {
    OppoAdBuilder.copyModule(result);
    OppoAdBuilder.appendProguard(result);
    OppoAdBuilder.appendBuild(result);
    Utils.addServices(result, 'com.cocos.oppo.ad.OppoAdService');
    OppoAdBuilder.appendGradleProperties(result);
  }

  private static copyModule(result: IBuildResult) {
    fse.copySync(`${__dirname}/../ad/`, `${result.dest}/proj/libcocosoppo/`);
  }

  private static appendProguard(result: IBuildResult) {
    fse.appendFileSync(`${result.dest}/proj/proguard-rules.pro`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosoppo/proguard-rules.pro`, { encoding: 'binary' })}`);
  }

  private static appendBuild(result: IBuildResult) {
    fse.appendFileSync(`${result.dest}/proj/build-ccams.gradle`, `\n${fs.readFileSync(`${result.dest}/proj/libcocosoppo/build.gradle`, { encoding: 'binary' })}`)
  }

  private static appendGradleProperties(result: IBuildResult) {
    const gradlePropertiesPath = `${result.dest}/proj/gradle.properties`;
    const gradleProperties = fs.readFileSync(gradlePropertiesPath, { encoding: 'binary' });
    const enableJetifier = `android.enableJetifier=true`;
    const pos = gradleProperties.indexOf(enableJetifier);
    if (pos < 0) {
      fs.writeFileSync(gradlePropertiesPath, gradleProperties + "\n" + enableJetifier + "\n");
    }
  }
}