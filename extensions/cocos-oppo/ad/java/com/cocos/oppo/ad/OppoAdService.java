package com.cocos.oppo.ad;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.BuildConfig;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.heytap.msp.mobad.api.InitParams;
import com.heytap.msp.mobad.api.MobAdManager;
import com.heytap.msp.mobad.api.ad.InterstitialVideoAd;
import com.heytap.msp.mobad.api.ad.RewardVideoAd;
import com.heytap.msp.mobad.api.listener.IInterstitialVideoAdListener;
import com.heytap.msp.mobad.api.listener.IRewardVideoAdListener;
import com.heytap.msp.mobad.api.params.RewardVideoAdParams;

import org.json.JSONObject;

public class OppoAdService implements SDKWrapper.SDKInterface {
    private final static String APP_ID = "31807821";
    private final static String REWARD_AD_POS_ID = "1668945";
    private final static String INTERSTITIAL_AD_POS_ID = "1668947";

    @Override
    public void init(Context context) {
        // 注册桥接函数
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
            Log.i(Constants.TAG, "Oppo ad init");
            InitParams initParams = new InitParams.Builder()
                    .setDebug(BuildConfig.DEBUG)
                    .build();
            MobAdManager.getInstance().init(SDKWrapper.shared().getActivity(), APP_ID, initParams);
        }
    };

    private RewardVideoAd rewardVideoAd;

    private final JsbBridgeWrapper.OnScriptEventListener loadRewardedAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "Oppo ad load reward ad");
            rewardVideoAd = new RewardVideoAd(SDKWrapper.shared().getActivity(), REWARD_AD_POS_ID, new IRewardVideoAdListener() {
                private boolean verified = false;

                @Override
                public void onAdSuccess() {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad success");
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_READY);
                    rewardVideoAd.showAd();
                }

                @Override
                public void onAdFailed(String s) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad failed: " + s);
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_FAILED, s);
                }

                @Override
                public void onAdFailed(int i, String s) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad failed: " + i + ", " + s);
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_FAILED, i + ", " + s);
                }

                @Override
                public void onAdClick(long l) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad click: " + l);
                }

                @Override
                public void onVideoPlayStart() {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad play start");
                }

                @Override
                public void onVideoPlayComplete() {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad play complete");
                }

                @Override
                public void onVideoPlayError(String s) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad play error");
                }

                @Override
                public void onVideoPlayClose(long l) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad play close");
                    try {
                        JSONObject data = new JSONObject();
                        data.put("verified", verified);
                        JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_REWARDED_AD_CLOSE, data.toString());
                    } catch (Exception e) {
                        Log.e(Constants.TAG, "Rewarded Ad close error: " + e);
                    }
                }

                @Override
                public void onLandingPageOpen() {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad landing page open");
                }

                @Override
                public void onLandingPageClose() {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad landing page close");
                }

                @Override
                public void onReward(Object... objects) {
                    Log.i(Constants.TAG, "Oppo ad load rewarded Ad reward");
                    verified = true;
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_SHOW_REWARD_VERIFY);
                }
            });
            rewardVideoAd.loadAd();
        }
    };

    private InterstitialVideoAd interstitialVideoAd;

    private final JsbBridgeWrapper.OnScriptEventListener loadInterstitialAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "Oppo ad load interstitial ad");
            interstitialVideoAd = new InterstitialVideoAd(SDKWrapper.shared().getActivity(), INTERSTITIAL_AD_POS_ID, new IInterstitialVideoAdListener() {
                @Override
                public void onVideoPlayComplete() {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad play complete");
                }

                @Override
                public void onAdReady() {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad ready");
                    interstitialVideoAd.showAd();
                }

                @Override
                public void onAdClose() {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad close");
                }

                @Override
                public void onAdShow() {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad show");
                }

                @Override
                public void onAdFailed(String s) {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad failed: " + s);
                }

                @Override
                public void onAdFailed(int i, String s) {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad failed: " + i + ", " + s);
                }

                @Override
                public void onAdClick() {
                    Log.i(Constants.TAG, "Oppo ad load interstitial ad click");
                }
            });
            interstitialVideoAd.loadAd();
        }
    };
}
