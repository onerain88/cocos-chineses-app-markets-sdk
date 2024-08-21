package com.cocos.huawei;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
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
import com.huawei.hms.support.account.AccountAuthManager;
import com.huawei.hms.support.account.request.AccountAuthParams;
import com.huawei.hms.support.account.request.AccountAuthParamsHelper;
import com.huawei.hms.support.account.result.AccountAuthResult;
import com.huawei.hms.support.account.result.AuthAccount;
import com.huawei.hms.support.account.service.AccountAuthService;
import com.huawei.hms.utils.ResourceLoaderUtil;

import org.json.JSONException;

public class HuaWeiService implements SDKWrapper.SDKInterface {
    private static final int SIGN_IN_INTENT = 100;

    private boolean hasInited = false;

    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "HuaWeiService init");
        // 注册桥接接口
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.INIT, initListener);
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

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SIGN_IN_INTENT) {
            if (null == data) {
                Log.i(Constants.TAG, "signIn intent is null");
                return;
            }
            String jsonSignInResult = data.getStringExtra("HUAWEIID_SIGNIN_RESULT");
            if (TextUtils.isEmpty(jsonSignInResult)) {
                Log.i(Constants.TAG, "SignIn result is empty");
                return;
            }
            try {
                AccountAuthResult signInResult = new AccountAuthResult().fromJson(jsonSignInResult);
                if (0 == signInResult.getStatus().getStatusCode()) {
                    Log.i(Constants.TAG, "Sign in success.");
                    Log.i(Constants.TAG, "Sign in result: " + signInResult.toJson());
                    // 获取AuthorizationCode

                } else {
                    Log.i(Constants.TAG, "Sign in failed: " + signInResult.getStatus().getStatusCode());
                }
            } catch (JSONException e) {
                Log.e(Constants.TAG, "Failed to convert json from signInResult: " + e);
            }
        }
    }

    /**
     * 创建授权参数
     * @return
     */
    private static AccountAuthParams getAccountAuthParams() {
        return new AccountAuthParamsHelper(AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME)
                .setAuthorizationCode()
                .createParams();
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
            // 防沉迷回调
            AppParams appParams = new AppParams(params, new AntiAddictionCallback() {
                @Override
                public void onExit() {
                    // 防沉迷限制游戏
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            });
            // 初始化
            initTask = appsClient.init(appParams);
            initTask.addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void unused) {
                    Log.i(Constants.TAG, "HuaWei SDK init success.");
                    hasInited = true;
                    // 启动浮窗
                    Games.getBuoyClient(SDKWrapper.shared().getActivity()).showFloatWindow();
                    // 华为登录
                    Task<AuthAccount> authAccountTask = AccountAuthManager.getService(SDKWrapper.shared().getActivity(),
                            getAccountAuthParams())
                            .silentSignIn();
                    authAccountTask.addOnSuccessListener(new OnSuccessListener<AuthAccount>() {
                        @Override
                        public void onSuccess(AuthAccount authAccount) {
                            Log.i(Constants.TAG, "登录成功: " + authAccount);
                        }
                    });
                    authAccountTask.addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(Exception e) {
                            Log.i(Constants.TAG, "登录失败: " + e);
                            Intent intent = AccountAuthManager.getService(SDKWrapper.shared().getActivity(),
                                    getAccountAuthParams())
                                    .getSignInIntent();
                            SDKWrapper.shared().getActivity().startActivityForResult(intent, SIGN_IN_INTENT);
                        }
                    });
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
