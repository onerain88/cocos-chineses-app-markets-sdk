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
            appId: {
                label: `i18n:${global_1.PACKAGE_NAME}.options.appId`,
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: `i18n:${global_1.PACKAGE_NAME}.options.appIdPlaceholder`,
                    },
                },
                verifyRules: ['required'],
            },
            appKey: {
                label: `i18n:${global_1.PACKAGE_NAME}.options.appKey`,
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: `i18n:${global_1.PACKAGE_NAME}.options.appKeyPlaceholder`,
                    },
                },
                verifyRules: ['required'],
            },
        },
        verifyRuleMap: {},
    },
};
exports.assetHandlers = './asset-handlers';
