package com.cocos.vivo;

import android.content.Context;
import android.util.Log;

import com.cocos.lib.CocosActivity;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.vivo.unionsdk.open.DynamicShortcutsCallback;
import com.vivo.unionsdk.open.VivoExitCallback;
import com.vivo.unionsdk.open.VivoUnionSDK;

public class VivoService implements SDKWrapper.SDKInterface {

  @Override
  public void init(Context context) {
    Log.i(Constants.TAG, "VivoService init");
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
      Log.i(Constants.TAG, "Vivo SDK init");
      VivoUnionSDK.onPrivacyAgreed(SDKWrapper.shared().getActivity());
      VivoUnionSDK.setDynamicShortcuts(SDKWrapper.shared().getActivity(), true, new DynamicShortcutsCallback() {
        @Override
        public void onDynamicShortcutsStatus(int status) {
          // status = 1表示操作成功；其他错误值含义见文档
          Log.d(Constants.TAG, "setDynamicShortcuts status: " + status);
        }
      });
      // 注意：Vivo 在初始化后会自动登录账号，所以没有必要再登录 Vivo 账号
      JsbBridgeWrapper.getInstance().dispatchEventToScript(Constants.LOGIN_SUCCESS);
    }
  };

  private final JsbBridgeWrapper.OnScriptEventListener exitGameListener = new JsbBridgeWrapper.OnScriptEventListener() {
    @Override
    public void onScriptEvent(String arg) {
      Log.i(Constants.TAG, "Vivo SDK exit game");
      VivoUnionSDK.exit(SDKWrapper.shared().getActivity(), new VivoExitCallback() {
        @Override
        public void onExitCancel() {

        }

        @Override
        public void onExitConfirm() {
          android.os.Process.killProcess(android.os.Process.myPid());
        }
      });
    }
  };
}
