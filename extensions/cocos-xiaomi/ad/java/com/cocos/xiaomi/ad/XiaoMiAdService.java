package com.cocos.xiaomi.ad;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.xiaomi.ad.mediation.MMAdConfig;
import com.xiaomi.ad.mediation.MMAdError;
import com.xiaomi.ad.mediation.fullscreeninterstitial.MMAdFullScreenInterstitial;
import com.xiaomi.ad.mediation.fullscreeninterstitial.MMFullScreenInterstitialAd;
import com.xiaomi.ad.mediation.internal.config.IMediationConfigInitListener;
import com.xiaomi.ad.mediation.mimonew.MIMOAdSdkConfig;
import com.xiaomi.ad.mediation.mimonew.MiMoNewSdk;
import com.xiaomi.ad.mediation.rewardvideoad.MMAdReward;
import com.xiaomi.ad.mediation.rewardvideoad.MMAdRewardVideo;
import com.xiaomi.ad.mediation.rewardvideoad.MMRewardVideoAd;

public class XiaoMiAdService implements SDKWrapper.SDKInterface {
    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "XiaoMi Ad SDK init");
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_INIT, initListener);
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_LOAD_REWARDED_AD, loadRewardedAdListener);
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_LOAD_INTERSTITIAL_AD, loadInterstitialAdListener);
    }

    @Override
    public void onDestroy() {
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.AD_INIT, initListener);
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.AD_LOAD_REWARDED_AD, loadRewardedAdListener);
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.AD_LOAD_INTERSTITIAL_AD, loadInterstitialAdListener);
    }

    private final JsbBridgeWrapper.OnScriptEventListener initListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            MIMOAdSdkConfig config = new MIMOAdSdkConfig.Builder()
                    .setDebug(true)
                    .build();
            MiMoNewSdk.init(SDKWrapper.shared().getActivity(),
                    "2882303761520331204",
                    "天天数独",
                    config,
                    new IMediationConfigInitListener() {
                        @Override
                        public void onSuccess() {
                            Log.i(Constants.TAG, "XiaoMi Ad SDK init success");
                        }

                        @Override
                        public void onFailed(int i) {
                            Log.i(Constants.TAG, "XiaoMi Ad SDK init failed: " + i);
                        }
                    });
        }
    };

    private final JsbBridgeWrapper.OnScriptEventListener loadRewardedAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            MMAdConfig adConfig = new MMAdConfig();
            adConfig.supportDeeplink = true;
            adConfig.imageHeight = 1920;
            adConfig.imageWidth = 1080;

            //期望广告view的size,单位dp（*必填）
            adConfig.viewWidth = 1080;
            adConfig.viewHeight = 1920;
            adConfig.rewardCount = 5;

            adConfig.setRewardVideoActivity(SDKWrapper.shared().getActivity());
            MMAdRewardVideo rewardVideo = new MMAdRewardVideo(SDKWrapper.shared().getActivity(), "2e62a9cab5184a9d9635545ee7e3bdf4");
            rewardVideo.onCreate(); //必须调用，用于统计

            rewardVideo.load(adConfig, new MMAdRewardVideo.RewardVideoAdListener() {
                @Override
                public void onRewardVideoAdLoaded(MMRewardVideoAd mmRewardVideoAd) {
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_READY);
                    if (mmRewardVideoAd != null) {
                        Log.i(Constants.TAG, "广告请求成功");
                        mmRewardVideoAd.setInteractionListener(new MMRewardVideoAd.RewardVideoAdInteractionListener() {
                            @Override
                            public void onAdShown(MMRewardVideoAd mmRewardVideoAd) {
                                Log.i(Constants.TAG, "激励广告展示");
                            }

                            @Override
                            public void onAdClicked(MMRewardVideoAd mmRewardVideoAd) {
                                Log.i(Constants.TAG, "激励广告点击");
                            }

                            @Override
                            public void onAdError(MMRewardVideoAd mmRewardVideoAd, MMAdError mmAdError) {
                                Log.i(Constants.TAG, "激励广告错误: " + mmAdError.toString());
                            }

                            @Override
                            public void onAdVideoComplete(MMRewardVideoAd mmRewardVideoAd) {
                                Log.i(Constants.TAG, "激励广告完成");
                            }

                            @Override
                            public void onAdClosed(MMRewardVideoAd mmRewardVideoAd) {
                                Log.i(Constants.TAG, "激励广告关闭");
                            }

                            @Override
                            public void onAdReward(MMRewardVideoAd mmRewardVideoAd, MMAdReward mmAdReward) {
                                Log.i(Constants.TAG, "激励广告奖励完成: " + mmAdReward.toString());
                                JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_SHOW_REWARD_VERIFY);
                            }

                            @Override
                            public void onAdVideoSkipped(MMRewardVideoAd mmRewardVideoAd) {
                                Log.i(Constants.TAG, "激励广告跳过");
                            }
                        });
                        mmRewardVideoAd.showAd(SDKWrapper.shared().getActivity());
                    } else {
                        Log.e(Constants.TAG, "广告请求成功，但无填充");
                    }
                }

                @Override
                public void onRewardVideoAdLoadError(MMAdError mmAdError) {
                    Log.e(Constants.TAG, "广告加载失败" + mmAdError.toString());
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_FAILED, mmAdError.toString());
                }
            });
        }
    };

    private final JsbBridgeWrapper.OnScriptEventListener loadInterstitialAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            MMAdConfig adConfig = new MMAdConfig();
            adConfig.supportDeeplink = true;
            adConfig.imageWidth = 1080;
            adConfig.imageHeight = 1920;
            adConfig.viewWidth = 1080;
            adConfig.viewHeight = 1920;
            adConfig.interstitialOrientation = MMAdConfig.Orientation.ORIENTATION_VERTICAL;
            adConfig.setInsertActivity(SDKWrapper.shared().getActivity());
            MMAdFullScreenInterstitial interstitial = new MMAdFullScreenInterstitial(SDKWrapper.shared().getActivity(), "f0ef510a374af30dd32e3812f3120c88");
            interstitial.onCreate(); //必须调用
            interstitial.load(adConfig, new MMAdFullScreenInterstitial.FullScreenInterstitialAdListener() {
                @Override
                public void onFullScreenInterstitialAdLoaded(MMFullScreenInterstitialAd mmFullScreenInterstitialAd) {
                    if (mmFullScreenInterstitialAd != null) {
                        mmFullScreenInterstitialAd.showAd(SDKWrapper.shared().getActivity());
                    } else {
                        Log.e(Constants.TAG, "加载广告失败，无广告填充");
                    }
                }

                @Override
                public void onFullScreenInterstitialAdLoadError(MMAdError mmAdError) {
                    Log.e(Constants.TAG, "加载广告失败, " + mmAdError.toString());
                }
            });
        }
    };
}
