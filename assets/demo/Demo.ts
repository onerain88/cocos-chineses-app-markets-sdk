import { _decorator, Component, director, EventKeyboard, input, Input, KeyCode, Label, log, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

// 通用
const INIT = 'ccams_init';
const EXIT_GAME = 'ccams_exit_game';

// 广告
const AD_INIT = 'ccams_ad_init';
// 激励视频
const AD_LOAD_REWARD_AD = 'ccams_ad_load_rewarded_ad';
const AD_LOAD_REWARD_AD_READY = 'ccams_ad_load_reward_ad_ready';
const AD_LOAD_REWARD_AD_FAILED = 'ccams_ad_load_reward_ad_failed';
const AD_LOAD_REWARDED_AD_VERIFY = 'ccams_ad_load_reward_ad_verify';
// 插屏
const AD_LOAD_INTERSTITIAL_AD = 'ccams_ad_load_interstitial_ad';

@ccclass('Demo')
export class Demo extends Component {
  @property(Label)
  public infoLabel: Label = null;

  private loadRewardedAdReady: native.OnNativeEventListener = () => {
    log(`demo: vivo_ad_loadRewardedAd 加载完成`);
    this.infoLabel.string = 'vivo_ad_loadRewardedAd 加载完成'
  };

  private loadRewardedAdVerify: native.OnNativeEventListener = () => {
    log(`demo: vivo_ad_loadRewardedAd 确认完成`);
    this.infoLabel.string = 'vivo_ad_loadRewardedAd 确认完成'
  }

  private loadRewardedAdFailed: native.OnNativeEventListener = (err) => {
    log(`demo: vivo_ad_loadRewardedAd 加载失败: ${err}`);
    this.infoLabel.string = `demo: vivo_ad_loadRewardedAd 加载失败: ${err}`
  }


  protected onLoad(): void {
    director.addPersistRootNode(this.node);
    log('注册键盘事件');
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    // 初始化
    native.jsbBridgeWrapper.dispatchEventToNative(INIT);

    // 初始化 Vivo 广告 SDK
    const vivoAdInitData = {
      mediaId: '188bd66d899a46fa9521354dd5a43115'
    }
    native.jsbBridgeWrapper.dispatchEventToNative(AD_INIT, JSON.stringify(vivoAdInitData));

    log('Demo 初始化');
    native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARD_AD_READY, this.loadRewardedAdReady);
    native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARDED_AD_VERIFY, this.loadRewardedAdVerify);
    native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARD_AD_FAILED, this.loadRewardedAdFailed);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARD_AD_READY, this.loadRewardedAdReady);
    native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARDED_AD_VERIFY, this.loadRewardedAdVerify);
    native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARD_AD_FAILED, this.loadRewardedAdFailed);
  }

  private onKeyDown(event: EventKeyboard) {
    log('键盘事件', event.keyCode);
    if (event.keyCode === KeyCode.BACKSPACE) {
      // 退出
      native.jsbBridgeWrapper.dispatchEventToNative(EXIT_GAME);
    }
  }

  private onLoadRewardedAdButtonClicked() {
    const loadRewardedAdData = {
      posId: 'b042370b5b0e40479423438643f6c408'
    }

    native.jsbBridgeWrapper.dispatchEventToNative(AD_LOAD_REWARD_AD, JSON.stringify(loadRewardedAdData));
  }

  private onLoadInterstitialAdButtonClicked() {
    native.jsbBridgeWrapper.dispatchEventToNative(AD_LOAD_INTERSTITIAL_AD);
  }
}

