"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IHGBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class IHGBuilder {
    static afterBuild(options, result) {
        IHGBuilder.copyModule(result);
        IHGBuilder.copyBuild(result);
        IHGBuilder.copyProguard(result);
        IHGBuilder.applyModuleBuild();
    }
    static copyModule(result) {
        fs_extra_1.default.copySync(`${__dirname}/../common/`, `${result.dest}/proj/libihgcommon/`);
    }
    static copyBuild(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libihgcommon/build.gradle`, `${result.dest}/proj/build-ihg.gradle`);
    }
    static copyProguard(result) {
        fs_extra_1.default.copySync(`${result.dest}/proj/libihgcommon/proguard-rules.pro`, `${result.dest}/proj/proguard-rules-ihg.pro`);
    }
    static applyModuleBuild() {
        // 设置 build.gradle
        const appBuildGradlePath = `${IHGBuilder.NativePath}/app/build.gradle`;
        const appBuildGradle = fs_1.default.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const applyModuleBuild = `apply from: RES_PATH + "/proj/build-ihg.gradle"`;
        const pos = appBuildGradle.indexOf(applyModuleBuild);
        if (pos < 0) {
            fs_1.default.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + applyModuleBuild + "\n");
        }
    }
}
exports.IHGBuilder = IHGBuilder;
IHGBuilder.NativePath = `${Editor.Project.path}/native/engine/android`;
