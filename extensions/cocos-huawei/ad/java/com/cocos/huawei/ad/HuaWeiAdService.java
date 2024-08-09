package com.cocos.huawei.ad;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.huawei.hms.ads.AdListener;
import com.huawei.hms.ads.AdParam;
import com.huawei.hms.ads.BiddingParam;
import com.huawei.hms.ads.HwAds;
import com.huawei.hms.ads.InterstitialAd;
import com.huawei.hms.ads.reward.Reward;
import com.huawei.hms.ads.reward.RewardAd;
import com.huawei.hms.ads.reward.RewardAdLoadListener;
import com.huawei.hms.ads.reward.RewardAdStatusListener;

public class HuaWeiAdService implements SDKWrapper.SDKInterface {
    private RewardAd rewardAd = null;

    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "HuaWeiAdService init");
        // 注册桥接接口
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
            HwAds.init(SDKWrapper.shared().getActivity());
        }
    };

    private final JsbBridgeWrapper.OnScriptEventListener loadRewardedAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            // TODO 设置广告 Id
            Log.i(Constants.TAG, "Load rewarded ad");
            rewardAd = new RewardAd(SDKWrapper.shared().getActivity(), "testx9dtjwj8hp");
            AdParam.Builder builder = new AdParam.Builder();
            rewardAd.loadAd(builder.build(), new RewardAdLoadListener() {
                @Override
                public void onRewardedLoaded() {
                    Log.i(Constants.TAG, "Loaded rewarded ad");
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_READY);
                    rewardAd.show(SDKWrapper.shared().getActivity(), new RewardAdStatusListener() {
                        @Override
                        public void onRewarded(Reward reward) {
                            Log.i(Constants.TAG, "Rewarded Ad onRewardVerify");
                            JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_SHOW_REWARD_VERIFY);
                        }
                    });
                }

                @Override
                public void onRewardAdFailedToLoad(int i) {
                    Log.i(Constants.TAG, "Load rewarded ad failed: " + i);
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_FAILED, "Load rewarded ad failed: " + i);
                }
            });
        }
    };

    private InterstitialAd interstitialAd;

    private final JsbBridgeWrapper.OnScriptEventListener loadInterstitialAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "Load interstitial ad");
            interstitialAd = new InterstitialAd(SDKWrapper.shared().getActivity());
            interstitialAd.setAdId("testb4znbuh3n2");
            AdParam.Builder builder = new AdParam.Builder();
            builder.setTMax(500);
            interstitialAd.setAdListener(new AdListener() {
                @Override
                public void onAdLoaded() {
                    Log.i(Constants.TAG, "Loaded interstitial ad");
                    // 广告加载成功时调用
                    interstitialAd.show(SDKWrapper.shared().getActivity());
                }

                @Override
                public void onAdFailed(int errorCode) {
                    // 广告加载失败时调用
                    Log.i(Constants.TAG, "Load interstitial ad failed: " + errorCode);
                }

                @Override
                public void onAdClosed() {
                    // 广告关闭时调用
                    Log.i(Constants.TAG, "Load interstitial ad closed");
                }

                @Override
                public void onAdClicked() {
                    // 广告点击时调用
                    Log.i(Constants.TAG, "Load interstitial ad clicked");
                }

                @Override
                public void onAdLeave() {
                    // 广告离开时调用
                    Log.i(Constants.TAG, "Load interstitial ad leave");
                }

                @Override
                public void onAdOpened() {
                    // 广告打开时调用
                    Log.i(Constants.TAG, "Load interstitial ad opened");
                }
            });
            interstitialAd.loadAd(builder.build());
        }
    };
}
