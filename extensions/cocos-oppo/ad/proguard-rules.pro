-dontwarn
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose
-dontshrink
-ignorewarnings
#-dump mob_ad_demo_release_files.txt
#-printusage mob_ad_demo_release_usage.txt
#-printmapping mob_ad_demo_release_mapping.txt
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*
#保留内部类，保留注解【非常重要】
-keepattributes InnerClasses
#
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class * extends android.os.AsyncTask

-keepclasseswithmembernames class * {
    native <methods>;
}

-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

-keepclassmembers class * extends android.app.Activity {
	public void *(android.view.View);
}

-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

-keepclassmembers class * implements java.io.Serializable {
	static final long serialVersionUID;
	static final java.io.ObjectStreamField[] serialPersistentFields;
	private void writeObject(java.io.ObjectOutputStream);
	private void readObject(java.io.ObjectInputStream);
	java.lang.Object writeReplace();
	java.lang.Object readResolve();
}

#广告proguard配置开始
-keep class com.bytedance.sdk.openadsdk.** { *; }
-keep public interface com.bytedance.sdk.openadsdk.downloadnew.** {*;}
-keep class com.pgl.sys.ces.* {*;}

-keep class com.nearme.instant.router.** { *;}
-keep class com.oppo.oaps.ad.** { *;}
-keep class com.opos.** { *;}
-keep class com.heytap.msp.mobad.api.**{*;}
-keep class com.heytap.openid.** {*;}
-keep class com.qq.e.** {
      public protected *;
}
-keep class android.support.v4.**{
      public *;
}
-keep class android.support.v7.**{
      public *;
}
-keep class okio.**{ *; }
#广告proguard配置结束