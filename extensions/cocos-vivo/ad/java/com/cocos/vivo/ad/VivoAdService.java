package com.cocos.vivo.ad;

import static com.cocos.vivo.ad.Constants.TAG;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.BuildConfig;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.vivo.mobilead.manager.VInitCallback;
import com.vivo.mobilead.manager.VivoAdManager;
import com.vivo.mobilead.model.VAdConfig;
import com.vivo.mobilead.unified.base.AdParams;
import com.vivo.mobilead.unified.base.VivoAdError;
import com.vivo.mobilead.unified.interstitial.UnifiedVivoInterstitialAd;
import com.vivo.mobilead.unified.interstitial.UnifiedVivoInterstitialAdListener;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAd;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAdListener;

import org.json.JSONObject;

public class VivoAdService implements SDKWrapper.SDKInterface {
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
            Log.i(TAG, "Vivo ad init");
            try {
                VAdConfig config = new VAdConfig.Builder()
                        .setDebug(BuildConfig.DEBUG)
                        .setMediaId("b0b485ce794a42088f892ba8ba024aa0")
                        .build();
                VivoAdManager.getInstance().init(SDKWrapper.shared().getActivity().getApplication(), config, new VInitCallback() {
                    @Override
                    public void suceess() {
                        Log.i(TAG, "Vivo ad init success.");
                    }

                    @Override
                    public void failed(VivoAdError vivoAdError) {
                        Log.i(TAG, "Vivo ad init failed: " + vivoAdError);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Vivo ad init exception: " + e);
            }
        }
    };

    private static UnifiedVivoRewardVideoAd rewardedVideoAd;
    private static final UnifiedVivoRewardVideoAdListener rewardedVideoAdListener = new UnifiedVivoRewardVideoAdListener() {
        private boolean verified = false;

        @Override
        public void onAdReady() {
            Log.i(TAG, "Rewarded Ad onAdReady");
            Log.i(TAG, "Rewarded Ad price: " + rewardedVideoAd.getPrice());
            JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_READY);
            rewardedVideoAd.sendWinNotification(rewardedVideoAd.getPrice());
            rewardedVideoAd.showAd(SDKWrapper.shared().getActivity());
        }

        @Override
        public void onAdFailed(VivoAdError vivoAdError) {
            Log.i(TAG, "Rewarded Ad onAdFailed: " + vivoAdError);
            JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_LOAD_REWARDED_FAILED, vivoAdError.toString());
        }

        @Override
        public void onAdClick() {
            Log.i(TAG, "Rewarded Ad onAdClick");
        }

        @Override
        public void onAdShow() {
            Log.i(TAG, "Rewarded Ad onAdShow");
        }

        @Override
        public void onAdClose() {
            Log.i(TAG, "Rewarded Ad onAdClose");
            try {
                JSONObject data = new JSONObject();
                data.put("verified", verified);
                JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_REWARDED_AD_CLOSE, data.toString());
            } catch (Exception e) {
                Log.e(TAG, "Rewarded Ad close error: " + e);
            }
        }

        @Override
        public void onRewardVerify() {
            Log.i(TAG, "Rewarded Ad onRewardVerify");
            verified = true;
            JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.AD_SHOW_REWARD_VERIFY);
        }
    };

    private final JsbBridgeWrapper.OnScriptEventListener loadRewardedAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(TAG, "Vivo ad load reward ad");
            try {
                AdParams params = new AdParams.Builder("3f0f0fdf3fa34506a2fb32fa49697ad5")
                        .build();
                rewardedVideoAd = new UnifiedVivoRewardVideoAd(SDKWrapper.shared().getActivity(), params, rewardedVideoAdListener);
                rewardedVideoAd.loadAd();
            } catch (Exception e) {
                Log.e(TAG, "Vivo ad load rewarded ad exception: " + e);
            }
        }
    };

    private UnifiedVivoInterstitialAd interstitialAd;

    private final JsbBridgeWrapper.OnScriptEventListener loadInterstitialAdListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(TAG, "Vivo ad load interstitial ad");
            String posId = "bea46ccfdb9d4ff4b321a24e2a9f627e";
            AdParams.Builder builder = new AdParams.Builder(posId);
            interstitialAd = new UnifiedVivoInterstitialAd(SDKWrapper.shared().getActivity(), builder.build(), new UnifiedVivoInterstitialAdListener() {
                @Override
                public void onAdReady() {
                    Log.i(TAG, "Vivo ad load interstitial ad ready");
                    interstitialAd.sendWinNotification(0);
                    interstitialAd.showVideoAd(SDKWrapper.shared().getActivity());
                }

                @Override
                public void onAdFailed(VivoAdError vivoAdError) {
                    Log.i(TAG, "Vivo ad load interstitial ad failed: " + vivoAdError);
                }

                @Override
                public void onAdClick() {
                    Log.i(TAG, "Vivo ad load interstitial ad click");
                }

                @Override
                public void onAdShow() {
                    Log.i(TAG, "Vivo ad load interstitial ad show");
                }

                @Override
                public void onAdClose() {
                    Log.i(TAG, "Vivo ad load interstitial ad close");
                }
            });
            interstitialAd.loadVideoAd();
        }
    };
}
