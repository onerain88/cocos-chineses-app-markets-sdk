"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetHandlers = exports.configs = exports.unload = exports.load = void 0;
const global_1 = require("./global");
const load = function () {
    console.debug(`${global_1.PACKAGE_NAME} load`);
};
exports.load = load;
const unload = function () {
    console.debug(`${global_1.PACKAGE_NAME} unload`);
};
exports.unload = unload;
exports.configs = {
    '*': {
        hooks: './hooks',
        doc: 'editor/publish/custom-build-plugin.html',
        options: {
            enableAdMob: {
                label: `i18n:${global_1.PACKAGE_NAME}.enableAdMob.title`,
                description: `i18n:${global_1.PACKAGE_NAME}.enableAdMob.tip`,
                default: `true`,
                render: {
                    ui: 'ui-checkbox',
                },
            },
        },
        verifyRuleMap: {},
    },
};
exports.assetHandlers = './asset-handlers';
