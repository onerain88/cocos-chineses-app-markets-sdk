import { _decorator, Component, director, EventKeyboard, input, Input, KeyCode, Label, log, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

// 通用
const INIT = 'ccams_init';
const EXIT_GAME = 'ccams_exit_game';
const LOGIN_SUCCESS = 'ccams_login_success';

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

  private loginSuccessListener: native.OnNativeEventListener = () => {
    log(`demo: 初始化/登录成功`);
    this.infoLabel.string = '初始化/登录成功'
  }

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

    log('Demo 初始化');
    this.infoLabel.string = '平台 SDK 初始化中 ...';
    if (sys.isNative) {
      log('注册键盘事件');
      input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
      // 初始化
      native.jsbBridgeWrapper.dispatchEventToNative(INIT);

      // 初始化 Vivo 广告 SDK
      native.jsbBridgeWrapper.dispatchEventToNative(AD_INIT);

      native.jsbBridgeWrapper.addNativeEventListener(LOGIN_SUCCESS, this.loginSuccessListener);

      native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARD_AD_READY, this.loadRewardedAdReady);
      native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARDED_AD_VERIFY, this.loadRewardedAdVerify);
      native.jsbBridgeWrapper.addNativeEventListener(AD_LOAD_REWARD_AD_FAILED, this.loadRewardedAdFailed);
    } else if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {

    }
  }

  protected onDestroy(): void {
    if (sys.isNative) {
      input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

      native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARD_AD_READY, this.loadRewardedAdReady);
      native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARDED_AD_VERIFY, this.loadRewardedAdVerify);
      native.jsbBridgeWrapper.removeNativeEventListener(AD_LOAD_REWARD_AD_FAILED, this.loadRewardedAdFailed);
    }
  }

  private onKeyDown(event: EventKeyboard) {
    log('键盘事件', event.keyCode);
    if (event.keyCode === KeyCode.BACKSPACE) {
      // 退出
      native.jsbBridgeWrapper.dispatchEventToNative(EXIT_GAME);
    }
  }

  private async onLoadRewardedAdButtonClicked() {
    if (sys.isNative) {
      native.jsbBridgeWrapper.dispatchEventToNative(AD_LOAD_REWARD_AD);
    } else {
      if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        const rewardAd = tt.createRewardedVideoAd({
          adUnitId: '3cgcfm3ich83oj2ot5',
        });
        rewardAd.onClose(result => {
          if (result.isEnded) {
            // 播放完成
            rewardAd.destroy();
          }
        })
        try {
          await rewardAd.load();
          log('广告加载完成');
          await rewardAd.show();
          log('广告开始播放');
          // 正常播放
        } catch (e) {
          // 播放异常
          log(`广告异常: ${e}`);
        }
      }
    }
  }

  private async onLoadInterstitialAdButtonClicked() {
    if (sys.isNative) {
      native.jsbBridgeWrapper.dispatchEventToNative(AD_LOAD_INTERSTITIAL_AD);
    } else {
      if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        const ad = tt.createInterstitialAd({
          adUnitId: "h7ag1cfh819ajv0940",
        });
        try {
          await ad.load();
          log('广告加载完成');
          await ad.show();
          log('广告展示完成');
        } catch (e) {
          log(`广告异常: ${e}`);
        }
      }
    }
  }
}

