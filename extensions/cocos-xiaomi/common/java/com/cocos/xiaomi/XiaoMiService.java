package com.cocos.xiaomi;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.xiaomi.gamecenter.sdk.MiCommplatform;
import com.xiaomi.gamecenter.sdk.MiErrorCode;
import com.xiaomi.gamecenter.sdk.OnExitListner;
import com.xiaomi.gamecenter.sdk.OnLoginProcessListener;
import com.xiaomi.gamecenter.sdk.entry.MiAccountInfo;

public class XiaoMiService implements SDKWrapper.SDKInterface {
    @Override
    public void init(Context context) {
        Log.i(Constants.TAG, "XiaoMiService init");
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.INIT, initListener);
        JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.EXIT_GAME, exitGameListener);
    }

    @Override
    public void onDestroy() {
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.INIT, initListener);
        JsbBridgeWrapper.getInstance().removeScriptEventListener(Constants.EXIT_GAME, exitGameListener);
    }

    private final JsbBridgeWrapper.OnScriptEventListener initListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "XiaoMi SDK init");
            MiCommplatform.getInstance().onUserAgreed(SDKWrapper.shared().getActivity());
            MiCommplatform.getInstance().miLogin(SDKWrapper.shared().getActivity(), new OnLoginProcessListener() {
                @Override
                public void finishLoginProcess(int i, MiAccountInfo miAccountInfo) {
                    Log.i(Constants.TAG, "XiaoMi SDK login: " + i + miAccountInfo.toString());
                }
            });
        }
    };

    private final JsbBridgeWrapper.OnScriptEventListener exitGameListener = new JsbBridgeWrapper.OnScriptEventListener() {
        @Override
        public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "XiaoMi SDK exit");
            MiCommplatform.getInstance().miAppExit(SDKWrapper.shared().getActivity(), new OnExitListner() {
                @Override
                public void onExit(int i) {
                    Log.i(Constants.TAG, "Exit code: " + i);
                    if (i == MiErrorCode.MI_XIAOMI_EXIT) {
                        android.os.Process.killProcess( android.os.Process.myPid() );
                    }
                }
            });
        }
    };
}
