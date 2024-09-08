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
            enable: {
                label: `i18n:${global_1.PACKAGE_NAME}.options.enable`,
                default: `true`,
                render: {
                    ui: 'ui-text',
                },
            },
        },
        verifyRuleMap: {},
    },
};
exports.assetHandlers = './asset-handlers';
