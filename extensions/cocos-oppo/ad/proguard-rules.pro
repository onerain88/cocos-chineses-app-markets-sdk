-keep class com.opos.** { *;}
-keep class com.heytap.msp.mobad.** { *;}
-keep class com.heytap.openid.** {*;}

-keep class okio.**{ *; }

-keeppackagenames com.heytap.nearx.tapplugin

-keep class * extends android.app.Application
-keep class * extends android.content.ContentProvider

-keep class com.bytedance.sdk.openadsdk.core.**{*;}
-keep class com.bytedance.sdk.openadsdk.multipro.**{*;}