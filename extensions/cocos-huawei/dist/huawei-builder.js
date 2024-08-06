"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaWeiBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
class HuaWeiBuilder {
    static afterBuild(options, result) {
        // 1. 拷贝 libcocoshuawei
        fs_extra_1.default.copySync(`${__dirname}/../core/libcocoshuawei/`, `${result.dest}/proj/libcocoshuawei/`);
        utils_1.Utils.addServices(result, 'com.cocos.huawei.HuaWeiService');
        utils_1.Utils.addServices(result, 'com.cocos.huawei.ad.HuaWeiAdService');
        // 2. 添加模块
        const settingsPath = `${result.dest}/proj/settings.gradle`;
        const projSettings = fs_1.default.readFileSync(settingsPath, { encoding: 'binary' });
        const includeLibHuaWei = "include ':libcocoshuawei'";
        let pos = projSettings.indexOf(includeLibHuaWei);
        if (pos < 0) {
            fs_1.default.writeFileSync(settingsPath, projSettings + "\n" + includeLibHuaWei + "\n");
        }
        // 3. 添加子模块依赖
        const appBuildGradlePath = `${constants_1.Constants.NativePath}/app/build.gradle`;
        const appBuildGradle = fs_1.default.readFileSync(appBuildGradlePath, { encoding: 'binary' });
        const dependentHuaWeiModule = `dependencies {
    implementation project(':libcocoshuawei')
}`;
        pos = appBuildGradle.indexOf(dependentHuaWeiModule);
        if (pos < 0) {
            fs_1.default.writeFileSync(appBuildGradlePath, appBuildGradle + "\n" + dependentHuaWeiModule + "\n");
        }
        // 4. 添加依赖仓库
        const projectBuildGradlePath = `${result.dest}/proj/build.gradle`;
        let projectBuildGradle = fs_1.default.readFileSync(projectBuildGradlePath, { encoding: 'binary' });
        const applyHuaWeiRepo = 'apply from: RES_PATH + "/proj/libcocoshuawei/build-repo.gradle"';
        pos = projectBuildGradle.indexOf(applyHuaWeiRepo);
        if (pos < 0) {
            fs_1.default.writeFileSync(projectBuildGradlePath, projectBuildGradle + "\n" + applyHuaWeiRepo + "\n");
        }
        // 5. 拷贝 agconnect-services.json
        fs_extra_1.default.copySync(`${__dirname}/../core/agconnect-services.json`, `${result.dest}/assets/agconnect-services.json`);
    }
}
exports.HuaWeiBuilder = HuaWeiBuilder;
