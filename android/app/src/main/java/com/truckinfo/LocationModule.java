package com.truckinfo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.SensorManager;
import android.net.ConnectivityManager;
import android.net.LinkProperties;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LocationModule extends ReactContextBaseJavaModule {
    private String TAG = "LocationModule";
    private  static ReactApplicationContext reactContext;
    private LocationReceiver locationReceiver = new LocationReceiver();

    ConnectivityManager connectivityManager;


    ConnectivityManager.NetworkCallback networkCallback = new ConnectivityManager.NetworkCallback() {
        @Override
        public void onAvailable(Network network) {
            Log.e(TAG, "Сеть по умолчанию теперь: " + network);
        }

        @Override
        public void onLost(Network network) {
            Log.e(TAG, "Приложение больше не имеет сети по умолчанию. Последняя сеть по умолчанию была " + network);
        }

        @Override
        public void onCapabilitiesChanged(Network network, NetworkCapabilities networkCapabilities) {
            Log.e(TAG, "Возможности сети по умолчанию изменились: " + networkCapabilities);
        }

        @Override
        public void onLinkPropertiesChanged(Network network, LinkProperties linkProperties) {
            Log.e(TAG, "Сеть по умолчанию изменила свойства ссылки: " + linkProperties);
        }
    };

    LocationModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;

        this.connectivityManager = (ConnectivityManager)reactContext.getSystemService(reactContext.CONNECTIVITY_SERVICE);

    }


    @ReactMethod
    public void startLocationReceiver() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            this.connectivityManager.registerDefaultNetworkCallback(networkCallback);
        }
    }
    @ReactMethod
    public void stopLocationReceiver() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            this.connectivityManager.unregisterNetworkCallback(networkCallback);
        }
    }




    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }
}
