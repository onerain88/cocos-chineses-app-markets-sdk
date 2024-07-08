import { _decorator, Component, director, EventKeyboard, input, Input, KeyCode, log, native, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Demo')
export class Demo extends Component {
  protected onLoad(): void {
    director.addPersistRootNode(this.node);
    log('注册键盘事件');
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    // 初始化
    native.jsbBridgeWrapper.dispatchEventToNative('vivo_init');
  }

  protected onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  private onKeyDown(event: EventKeyboard) {
    log('键盘事件', event.keyCode);
    if (event.keyCode === KeyCode.BACKSPACE) {
      // 退出
      native.jsbBridgeWrapper.dispatchEventToNative('vivo_on_back_pressed');
    }
  }
}

