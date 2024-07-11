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
      appId: {
        label: `i18n:${PACKAGE_NAME}.options.appId`,
        render: {
          ui: 'ui-input',
          attributes: {
            placeholder: `i18n:${PACKAGE_NAME}.options.appIdPlaceholder`,
          },
        },
        verifyRules: ['required'],
      },
      appKey: {
        label: `i18n:${PACKAGE_NAME}.options.appKey`,
        render: {
          ui: 'ui-input',
          attributes: {
            placeholder: `i18n:${PACKAGE_NAME}.options.appKeyPlaceholder`,
          },
        },
        verifyRules: ['required'],
      },
    },
    verifyRuleMap: {

    },
  },
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
