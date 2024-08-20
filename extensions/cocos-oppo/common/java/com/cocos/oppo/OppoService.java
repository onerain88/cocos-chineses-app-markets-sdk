package com.cocos.oppo;

import android.content.Context;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.nearme.game.sdk.callback.GameExitCallback;

public class OppoService implements SDKWrapper.SDKInterface {
  @Override
  public void init(Context context) {
    // 注册桥接事件
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
      GameCenterSDK.init("3c3571487b074b2cbf4cb3242a515bb2", SDKWrapper.shared().getActivity());
      GameCenterSDK.getInstance().doLogin(SDKWrapper.shared().getActivity(), new ApiCallback() {
        @Override
        public void onSuccess(String resultMsg) {

        }

        @Override
        public void onFailure(String resultMsg, int resultCode) {

        }
      });
    }
  };

  private final JsbBridgeWrapper.OnScriptEventListener exitGameListener = new JsbBridgeWrapper.OnScriptEventListener() {
    @Override
    public void onScriptEvent(String arg) {
      GameCenterSDK.getInstance().onExit(SDKWrapper.shared().getActivity(), new GameExitCallback() {
        @Override
        public void exitGame() {
          android.os.Process.killProcess(android.os.Process.myPid());
        }
      });
    }
  };
}
