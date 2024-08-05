package com.cocos.huawei.ad;

import android.content.Context;
import android.util.Log;

import com.cocos.huawei.Constants;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.huawei.hms.ads.AdParam;
import com.huawei.hms.ads.HwAds;
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
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_INIT_EVENT, initListener);
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.AD_LOAD_REWARDED_AD_EVENT, loadRewardedAdListener);
    }

    @Override
    public void onDestroy() {
        JsbBridgeWrapper.getInstance().removeAllListeners();
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
            rewardAd = new RewardAd(SDKWrapper.shared().getActivity(), "testx9dtjwj8hp");
            AdParam.Builder builder = new AdParam.Builder();
            rewardAd.loadAd(builder.build(), new RewardAdLoadListener() {
                @Override
                public void onRewardedLoaded() {
                    Log.i(Constants.TAG, "Loaded rewarded ad");
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
                }
            });
        }
    };
}
