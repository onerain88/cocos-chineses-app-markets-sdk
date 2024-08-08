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
  private CocosActivity cocosActivity = null;

  @Override
  public void init(Context context) {
    Log.i(Constants.TAG, "VivoService init");
    cocosActivity = (CocosActivity) context;
    JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.INIT, new JsbBridgeWrapper.OnScriptEventListener() {
      @Override
      public void onScriptEvent(String arg) {
        Log.i(Constants.TAG, "Vivo SDK init");
        VivoUnionSDK.onPrivacyAgreed(cocosActivity);
        VivoUnionSDK.setDynamicShortcuts(cocosActivity, true, new DynamicShortcutsCallback() {
          @Override
          public void onDynamicShortcutsStatus(int status) {
            // status = 1表示操作成功；其他错误值含义见文档
            Log.d(Constants.TAG, "setDynamicShortcuts status: " + status);
          }
        });
      }
    });
    JsbBridgeWrapper.getInstance().addScriptEventListener(Constants.EXIT_GAME,
        new JsbBridgeWrapper.OnScriptEventListener() {
          @Override
          public void onScriptEvent(String arg) {
            Log.i(Constants.TAG, "Vivo SDK exit game");
            VivoUnionSDK.exit(cocosActivity, new VivoExitCallback() {
              @Override
              public void onExitCancel() {

              }

              @Override
              public void onExitConfirm() {
                android.os.Process.killProcess(android.os.Process.myPid());
              }
            });
          }
        });
  }
}
