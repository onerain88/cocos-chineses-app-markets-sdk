-dontwarn android.os.SystemProperties
-dontwarn com.bykv.vk.openvk.preload.geckox.model.CheckRequestBodyModel$TargetChannel
-dontwarn com.bykv.vk.openvk.preload.geckox.statistic.IStatisticMonitor
-dontwarn com.bytedance.component.sdk.annotation.AnyThread
-dontwarn com.bytedance.component.sdk.annotation.AttrRes
-dontwarn com.bytedance.component.sdk.annotation.CallSuper
-dontwarn com.bytedance.component.sdk.annotation.ColorInt
-dontwarn com.bytedance.component.sdk.annotation.DungeonFlag
-dontwarn com.bytedance.component.sdk.annotation.FloatRange
-dontwarn com.bytedance.component.sdk.annotation.IntRange
-dontwarn com.bytedance.component.sdk.annotation.Keep
-dontwarn com.bytedance.component.sdk.annotation.MainThread
-dontwarn com.bytedance.component.sdk.annotation.RawRes
-dontwarn com.bytedance.component.sdk.annotation.RequiresApi
-dontwarn com.bytedance.component.sdk.annotation.RestrictTo$Scope
-dontwarn com.bytedance.component.sdk.annotation.RestrictTo
-dontwarn com.bytedance.component.sdk.annotation.UiThread
-dontwarn com.bytedance.component.sdk.annotation.WorkerThread
-dontwarn com.bytedance.framwork.core.sdkmonitor.SDKMonitor$IGetExtendParams
-dontwarn com.bytedance.framwork.core.sdkmonitor.SDKMonitor
-dontwarn com.bytedance.framwork.core.sdkmonitor.SDKMonitorUtils
-dontwarn com.bytedance.pangle.PluginClassLoader
-dontwarn com.bytedance.pangle.Zeus
-dontwarn com.bytedance.pangle.annotations.ForbidWrapParam
-dontwarn com.bytedance.pangle.plugin.Plugin
-dontwarn com.bytedance.sdk.component.lynx.LynxClientAdapter
-dontwarn com.bytedance.sdk.component.lynx.utils.LynxObjectUtils
-dontwarn com.hihonor.ads.identifier.AdvertisingIdClient$Info
-dontwarn com.hihonor.ads.identifier.AdvertisingIdClient
-dontwarn com.lynx.jsbridge.JSModule
-dontwarn com.lynx.jsbridge.LynxContextModule
-dontwarn com.lynx.jsbridge.LynxMethod
-dontwarn com.lynx.react.bridge.Callback
-dontwarn com.lynx.react.bridge.JavaOnlyArray
-dontwarn com.lynx.react.bridge.JavaOnlyMap
-dontwarn com.lynx.react.bridge.ReadableMap
-dontwarn com.lynx.react.bridge.ReadableMapKeySetIterator
-dontwarn com.lynx.react.bridge.WritableMap
-dontwarn com.lynx.tasm.LynxView
-dontwarn com.lynx.tasm.LynxViewBuilder
-dontwarn com.lynx.tasm.LynxViewClient
-dontwarn com.lynx.tasm.base.AbsLogDelegate
-dontwarn com.lynx.tasm.base.LLog
-dontwarn com.lynx.tasm.behavior.LynxProp
-dontwarn com.lynx.tasm.behavior.ui.utils.BackgroundDrawable
-dontwarn com.lynx.tasm.behavior.ui.utils.LynxBackground
-dontwarn com.lynx.tasm.utils.UIThreadUtils
-dontwarn com.tencent.mm.opensdk.modelbase.BaseReq
-dontwarn com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram$Req
-dontwarn com.tencent.mm.opensdk.openapi.IWXAPI
-dontwarn com.tencent.mm.opensdk.openapi.WXAPIFactory
-dontwarn com.vivo.network.okhttp3.Call
-dontwarn com.vivo.network.okhttp3.Headers
-dontwarn com.vivo.network.okhttp3.MediaType
-dontwarn com.vivo.network.okhttp3.OkHttpClient$Builder
-dontwarn com.vivo.network.okhttp3.OkHttpClient
-dontwarn com.vivo.network.okhttp3.Request$Builder
-dontwarn com.vivo.network.okhttp3.Request
-dontwarn com.vivo.network.okhttp3.RequestBody
-dontwarn com.vivo.network.okhttp3.Response
-dontwarn com.vivo.network.okhttp3.ResponseBody
-dontwarn com.vivo.network.okhttp3.vivo.monitor.DataReceivedCallback

-keepattributes SourceFile,LineNumberTable
-dontwarn com.squareup.okhttp.**
-dontwarn okhttp3.**
-keep class com.vivo.*.** { *; }
-dontwarn com.bytedance.article.common.nativecrash.NativeCrashInit
-keep class com.bytedance.sdk.openadsdk.** {*;}
-keep public interface com.bytedance.sdk.openadsdk.downloadnew.** {*;}
-keep class com.pgl.sys.ces.* {*;}
-keep class com.qq.e.** {
 public protected *;
}
-keep class android.support.v4.**{
 public *;
}
-keep class android.support.v7.widget.** {*;}
-dontwarn com.vivo.secboxsdk.**
-keep class com.vivo.secboxsdk.SecBoxCipherException { *; }
-keep class com.vivo.secboxsdk.jni.SecBoxNative { *; }
-keep class com.vivo.secboxsdk.BuildConfig { *; }
-keep class com.vivo.advv.**{*;}
-keep class com.kwad.sdk.** { *;}
-keep class com.ksad.download.** { *;}
-keep class com.kwai.filedownloader.** { *;}
# sdk
-keep class com.bun.miitmdid.** { *; }
-keep interface com.bun.supplier.** { *; }
# asus
-keep class com.asus.msa.SupplementaryDID.** { *; }
-keep class com.asus.msa.sdid.** { *; }
# freeme
-keep class com.android.creator.** { *; }
-keep class com.android.msasdk.** { *; }
# huawei
-keep class com.huawei.hms.ads.** { *; }
-keep interface com.huawei.hms.ads.** {*; }
# lenovo
-keep class com.zui.deviceidservice.** { *; }
-keep class com.zui.opendeviceidlibrary.** { *; }
# meizu
-keep class com.meizu.flyme.openidsdk.** { *; }
# nubia
-keep class com.bun.miitmdid.provider.nubia.NubiaIdentityImpl { *; }
# oppo
-keep class com.heytap.openid.** { *; }
# samsung
-keep class com.samsung.android.deviceidservice.** { *; }
# vivo
-keep class com.vivo.identifier.** { *; }
# xiaomi
-keep class com.bun.miitmdid.provider.xiaomi.IdentifierManager { *; }
# zte
-keep class com.bun.lib.** { *; }
# coolpad
-keep class com.coolpad.deviceidsupport.** { *; }
# ---------掌酷 SDK--------------
-keep class com.wrapper.ZkViewSDK {
 public <fields>;
 public <methods>;
}
-keep class com.wrapper.ZkViewSDK$ActionCallBack {
 public <fields>;
 public <methods>;
}
# 保留枚举类不被混淆
-keepclassmembers enum * {
 public static **[] values();
 public static ** valueOf(java.lang.String);
}
-keep class com.wrapper.ZkViewSDK$KEY {
 public <fields>;
 public <methods>;
}
-keep class com.wrapper.ZkViewSDK$Event {
 public <fields>;
 public <methods>;
}
-keeppackagenames com.zk.**
# ---------掌酷 SDK--------------