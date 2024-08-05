package com.cocos.huawei;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.huawei.hmf.tasks.OnFailureListener;
import com.huawei.hmf.tasks.OnSuccessListener;
import com.huawei.hmf.tasks.Task;
import com.huawei.hms.api.HuaweiMobileServicesUtil;
import com.huawei.hms.common.ApiException;
import com.huawei.hms.jos.AntiAddictionCallback;
import com.huawei.hms.jos.AppParams;
import com.huawei.hms.jos.JosApps;
import com.huawei.hms.jos.JosAppsClient;
import com.huawei.hms.jos.JosStatusCodes;
import com.huawei.hms.jos.games.Games;
import com.huawei.hms.jos.games.GamesStatusCodes;
import com.huawei.hms.support.account.request.AccountAuthParams;
import com.huawei.hms.utils.ResourceLoaderUtil;

public class HuaWeiService implements SDKWrapper.SDKInterface {
    private boolean hasInited = false;

    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "HuaWeiService init");
        // 注册桥接接口
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.INIT_EVENT, initListener);
    }

    @Override
    public void onPause() {
        if (hasInited) {
            Games.getBuoyClient(SDKWrapper.shared().getActivity()).hideFloatWindow();
        }
    }

    @Override
    public void onResume() {
        if (hasInited) {
            Games.getBuoyClient(SDKWrapper.shared().getActivity()).showFloatWindow();
        }
    }

    @Override
    public void onDestroy() {
        JsbBridgeWrapper.getInstance().removeAllListeners();
    }

    private final JsbBridgeWrapper.OnScriptEventListener initListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "HuaWei SDK init");
            HuaweiMobileServicesUtil.setApplication(SDKWrapper.shared().getActivity().getApplication());
            AccountAuthParams params = AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME;
            JosAppsClient appsClient = JosApps.getJosAppsClient(SDKWrapper.shared().getActivity());
            Task<Void> initTask;
            ResourceLoaderUtil.setmContext(SDKWrapper.shared().getActivity());
            AppParams appParams = new AppParams(params, new AntiAddictionCallback() {
                @Override
                public void onExit() {
                    // 防沉迷限制游戏
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            });
            initTask = appsClient.init(appParams);
            initTask.addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void unused) {
                    Log.i(Constants.TAG, "HuaWei SDK init success.");
                    hasInited = true;
                    Games.getBuoyClient(SDKWrapper.shared().getActivity()).showFloatWindow();
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(Exception e) {
                    Log.i(Constants.TAG, "HuaWei SDK init failure: " + e);
                    if (e instanceof ApiException) {
                        ApiException apiEx = (ApiException) e;
                        int statusCode = apiEx.getStatusCode();
                        if (statusCode == JosStatusCodes.JOS_PRIVACY_PROTOCOL_REJECTED) {
                            Log.i(Constants.TAG, "Reject protocol");
                        } else if (statusCode == GamesStatusCodes.GAME_STATE_NETWORK_ERROR) {
                            Log.i(Constants.TAG, "Network error");
                        }
                    }
                }
            });
        }
    };
}
