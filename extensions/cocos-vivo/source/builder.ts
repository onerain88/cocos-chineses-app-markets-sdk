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
      appType: {
        label: `i18n:${PACKAGE_NAME}.options.appType`,
        description: `i18n:${PACKAGE_NAME}.options.appTypePlaceholder`,
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
    verifyRuleMap: {

    },
  },
};


export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
