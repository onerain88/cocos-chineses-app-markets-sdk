package com.cocos.xiaomi.ad;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.xiaomi.ad.mediation.MMAdConfig;
import com.xiaomi.ad.mediation.MMAdError;
import com.xiaomi.ad.mediation.internal.config.IMediationConfigInitListener;
import com.xiaomi.ad.mediation.mimonew.MIMOAdSdkConfig;
import com.xiaomi.ad.mediation.mimonew.MiMoNewSdk;
import com.xiaomi.ad.mediation.rewardvideoad.MMAdRewardVideo;
import com.xiaomi.ad.mediation.rewardvideoad.MMRewardVideoAd;

public class XiaoMiAdService implements SDKWrapper.SDKInterface {
    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "XiaoMi Ad SDK init");
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_INIT_EVENT, initListener);
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_LOAD_REWARDED_AD_EVENT, loadRewardedAdListener);
    }

    @Override
    public void onDestroy() {
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.AD_INIT_EVENT, initListener);
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.AD_LOAD_REWARDED_AD_EVENT, loadRewardedAdListener);
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
                    if (mmRewardVideoAd != null) {
//                        rewardVideoAd = mmRewardVideoAd;
                        Log.i(Constants.TAG, "广告请求成功");
                        mmRewardVideoAd.showAd(SDKWrapper.shared().getActivity());
                    } else {
                        Log.e(Constants.TAG, "广告请求成功，但无填充");
                    }
                }

                @Override
                public void onRewardVideoAdLoadError(MMAdError mmAdError) {
                    Log.e(Constants.TAG, "广告加载失败" + mmAdError.toString());
                }
            });
        }
    };
}
