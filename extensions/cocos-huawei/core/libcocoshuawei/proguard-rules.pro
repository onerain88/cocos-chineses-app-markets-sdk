# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
-ignorewarnings 
-keepattributes *Annotation* 
-keepattributes Exceptions 
-keepattributes InnerClasses 
-keepattributes Signature 
-keepattributes SourceFile,LineNumberTable 
-keep class com.huawei.hianalytics.**{*;} 
-keep class com.huawei.updatesdk.**{*;} 
-keep class com.huawei.hms.**{*;} 
-keep interface com.huawei.hms.analytics.type.HAEventType{*;}
-keep interface com.huawei.hms.analytics.type.HAParamType{*;}
-keep class com.huawei.hms.analytics.HiAnalyticsInstance{*;}
-keep class com.huawei.hms.analytics.HiAnalytics{*;}

-dontwarn android.os.SystemProperties
-dontwarn android.telephony.HwTelephonyManager
-dontwarn com.bumptech.glide.Glide
-dontwarn com.bumptech.glide.RequestBuilder
-dontwarn com.bumptech.glide.RequestManager
-dontwarn com.bumptech.glide.load.DataSource
-dontwarn com.bumptech.glide.load.Transformation
-dontwarn com.bumptech.glide.load.engine.GlideException
-dontwarn com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool
-dontwarn com.bumptech.glide.load.resource.bitmap.BitmapTransformation
-dontwarn com.bumptech.glide.load.resource.bitmap.CenterCrop
-dontwarn com.bumptech.glide.load.resource.bitmap.RoundedCorners
-dontwarn com.bumptech.glide.load.resource.bitmap.TransformationUtils
-dontwarn com.bumptech.glide.request.BaseRequestOptions
-dontwarn com.bumptech.glide.request.RequestListener
-dontwarn com.bumptech.glide.request.target.Target
-dontwarn com.bumptech.glide.request.target.ViewTarget
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
-dontwarn com.google.gson.Gson
-dontwarn com.google.gson.GsonBuilder
-dontwarn com.google.gson.JsonDeserializationContext
-dontwarn com.google.gson.JsonDeserializer
-dontwarn com.google.gson.JsonElement
-dontwarn com.google.gson.JsonParseException
-dontwarn com.google.gson.annotations.SerializedName
-dontwarn com.google.gson.reflect.TypeToken
-dontwarn com.huawei.android.app.ActivityManagerEx
-dontwarn com.huawei.android.app.HwMultiWindowEx
-dontwarn com.huawei.android.app.PackageManagerEx
-dontwarn com.huawei.android.content.pm.ApplicationInfoEx
-dontwarn com.huawei.android.os.BuildEx$VERSION
-dontwarn com.huawei.appgallery.log.LogAdaptor
-dontwarn com.huawei.hianalytics.process.HiAnalyticsConfig$Builder
-dontwarn com.huawei.hianalytics.process.HiAnalyticsConfig
-dontwarn com.huawei.hianalytics.process.HiAnalyticsInstance$Builder
-dontwarn com.huawei.hianalytics.process.HiAnalyticsInstance
-dontwarn com.huawei.hianalytics.process.HiAnalyticsManager
-dontwarn com.huawei.hianalytics.util.HiAnalyticTools
-dontwarn com.huawei.hmf.annotation.ApiDefine
-dontwarn com.huawei.hmf.annotation.Singleton
-dontwarn com.huawei.libcore.io.ExternalStorageFile
-dontwarn com.huawei.libcore.io.ExternalStorageFileInputStream
-dontwarn com.huawei.libcore.io.ExternalStorageFileOutputStream
-dontwarn com.huawei.libcore.io.ExternalStorageRandomAccessFile
-dontwarn com.huawei.ohos.localability.BundleAdapter
-dontwarn com.huawei.ohos.localability.base.BundleInfo
-dontwarn com.huawei.ohos.localability.base.DeviceInfo
-dontwarn com.huawei.system.BuildEx
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
-dontwarn com.xiaomi.gamecenter.sdk.robust.ChangeQuickRedirect
-dontwarn com.xiaomi.gamecenter.sdk.robust.MiPatchCallback
-dontwarn com.xiaomi.gamecenter.sdk.robust.MiPatchInfoProvider
-dontwarn com.xiaomi.gamecenter.sdk.robust.MiPatchManager
-dontwarn com.xiaomi.gamecenter.sdk.robust.PatchProxy
-dontwarn com.xiaomi.gamecenter.sdk.robust.PatchProxyResult
-dontwarn com.xiaomi.onetrack.Configuration$Builder
-dontwarn com.xiaomi.onetrack.Configuration
-dontwarn com.xiaomi.onetrack.OneTrack$Mode
-dontwarn com.xiaomi.onetrack.OneTrack
-dontwarn javax.lang.model.element.Modifier
-dontwarn org.bouncycastle.crypto.BlockCipher
-dontwarn org.bouncycastle.crypto.engines.AESEngine
-dontwarn org.bouncycastle.crypto.prng.SP800SecureRandom
-dontwarn org.bouncycastle.crypto.prng.SP800SecureRandomBuilder