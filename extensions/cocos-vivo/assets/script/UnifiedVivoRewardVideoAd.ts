import { UnifiedVivoRewardVideoAdListener } from "./UnifiedVivoRewardVideoAdListener";

export class UnifiedVivoRewardVideoAd {
  private _listener: UnifiedVivoRewardVideoAdListener = null;

  public load(listener: UnifiedVivoRewardVideoAdListener) {
    this._listener = listener;
  }
}