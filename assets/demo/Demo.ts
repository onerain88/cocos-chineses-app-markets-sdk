import { _decorator, Component, director, EventKeyboard, input, Input, KeyCode, log, native, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Demo')
export class Demo extends Component {
  private loadRewardedAdReady: native.OnNativeEventListener = () => {
    log(`demo: vivo_ad_loadRewardedAd 加载完成`);
    log(`_test: ${this._test}`);
    this._test = 1;
  };

  private loadRewardedAdVerify: native.OnNativeEventListener = () => {
    log(`demo: vivo_ad_loadRewardedAd 确认完成`);
    log(`_test: ${this._test}`);
    this._test = 2;
  }

  private loadRewardedAdFailed: native.OnNativeEventListener = (err) => {
    log(`demo: vivo_ad_loadRewardedAd 加载失败: ${err}`);
    log(`_test: ${this._test}`);
    this._test = 3;
  }

  private _test: number = 0;

  protected onLoad(): void {
    director.addPersistRootNode(this.node);
    log('注册键盘事件');
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    // 初始化
    native.jsbBridgeWrapper.dispatchEventToNative('vivo_init');
    // 初始化 Vivo 广告 SDK
    const vivoAdInitData = {
      mediaId: '188bd66d899a46fa9521354dd5a43115'
    }

    native.jsbBridgeWrapper.dispatchEventToNative('vivo_ad_init', JSON.stringify(vivoAdInitData));
    native.jsbBridgeWrapper.dispatchEventToNative('sdk_init');
    native.jsbBridgeWrapper.dispatchEventToNative('sdk_ad_init_event');

    log('Demo 初始化');
    native.jsbBridgeWrapper.addNativeEventListener('vivo_ad_load_reward_ad_ready', this.loadRewardedAdReady);
    native.jsbBridgeWrapper.addNativeEventListener('vivo_ad_load_reward_ad_verify', this.loadRewardedAdVerify);
    native.jsbBridgeWrapper.addNativeEventListener('vivo_ad_load_reward_ad_failed', this.loadRewardedAdFailed);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    native.jsbBridgeWrapper.removeNativeEventListener('vivo_ad_load_reward_ad_ready', this.loadRewardedAdReady);
    native.jsbBridgeWrapper.removeNativeEventListener('vivo_ad_load_reward_ad_verify', this.loadRewardedAdVerify);
    native.jsbBridgeWrapper.removeNativeEventListener('vivo_ad_load_reward_ad_failed', this.loadRewardedAdFailed);
  }

  private onKeyDown(event: EventKeyboard) {
    log('键盘事件', event.keyCode);
    if (event.keyCode === KeyCode.BACKSPACE) {
      // 退出
      // native.jsbBridgeWrapper.dispatchEventToNative('vivo_on_back_pressed');
      native.jsbBridgeWrapper.dispatchEventToNative('sdk_exit_game');

    }
  }

  private onLoadRewardedAdButtonClicked() {
    const loadRewardedAdData = {
      posId: 'b042370b5b0e40479423438643f6c408'
    }

    // native.jsbBridgeWrapper.dispatchEventToNative('vivo_ad_loadRewardedAd', JSON.stringify(loadRewardedAdData));
    native.jsbBridgeWrapper.dispatchEventToNative('sdk_ad_load_rewarded_ad_event');
  }
}

