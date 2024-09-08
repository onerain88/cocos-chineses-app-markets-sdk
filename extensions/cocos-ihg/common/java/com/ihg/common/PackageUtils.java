package com.ihg.common;

import com.cocos.service.SDKWrapper;

public class PackageUtils {
    public static String getPackageName() {
        return SDKWrapper.shared().getActivity().getPackageName();
    }
}
