export interface UnifiedVivoRewardVideoAdListener {
  onAdReady(): void;
  onAdFailed(err: Error): void;
  onAdShow(): void;
  onAdClose(): void;
  onAdClick(): void;
  onRewardVerify(): void;
}