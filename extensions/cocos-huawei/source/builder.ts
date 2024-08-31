import { BuildPlugin } from '../@types';
import { PACKAGE_NAME } from './global';

export const load: BuildPlugin.load = function () {
  console.debug(`${PACKAGE_NAME} load`);
};
export const unload: BuildPlugin.load = function () {
  console.debug(`${PACKAGE_NAME} unload`);
};

export const configs: BuildPlugin.Configs = {
  '*': {
    hooks: './hooks',
    doc: 'editor/publish/custom-build-plugin.html',
    options: {
      enable: {
        label: `i18n:${PACKAGE_NAME}.options.enable`,
        default: `true`,
        render: {
          ui: 'ui-text',
        },
      },
    },
    verifyRuleMap: {

    },
  },
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
