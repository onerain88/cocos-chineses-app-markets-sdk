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
            appType: {
                label: `i18n:${global_1.PACKAGE_NAME}.options.appType`,
                description: `i18n:${global_1.PACKAGE_NAME}.options.appTypePlaceholder`,
                default: '0',
                render: {
                    ui: 'ui-select',
                    items: [
                        {
                            label: `单机 0`,
                            value: '0',
                        },
                        {
                            label: `网游 1`,
                            value: '1',
                        },
                    ],
                },
            },
        },
        verifyRuleMap: {},
    },
};
exports.assetHandlers = './asset-handlers';
