package com.truckinfo;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.view.Display;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Timer;
import java.util.TimerTask;

public class TestModule extends ReactContextBaseJavaModule implements SensorEventListener {
    // private static final String MODULE_NAME = "TestModule";
    private SensorManager sensorManager;
    private final float[] accelerometerReading = new float[3];
    private float accuracyAcc = 0f;
    private final float[] magnetometerReading = new float[3];
    private float accuracyMag = 0f;

    private final float[] rotationMatrix = new float[9];
    private final float[] orientationAngles = new float[3];
    private float[] orientationAngles2 = new float[3];
    private float ALPHA = 0.5f;

    private int interval = 400;
    private Timer timer;
    private int rotation;
    private  static  ReactApplicationContext reactContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter mEmitter = null;

    @ReactMethod
    public void setUpdateInterval(int newInterval) {
        this.interval = newInterval;
    }

    @ReactMethod
    public void setUpdateAlpha(float newAlpha) {
        this.ALPHA = newAlpha;
    }
    TestModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;

        this.sensorManager = (SensorManager)reactContext.getSystemService(reactContext.SENSOR_SERVICE);
    }

    @ReactMethod
    public void show() {
        Toast.makeText(reactContext, "Hello World!", Toast.LENGTH_LONG).show();
    }
    @ReactMethod
    public void startUpdates() {
        // Get updates from the accelerometer and magnetometer at a constant rate.
        // To make batch operations more efficient and reduce power consumption,
        // provide support for delaying updates to the application.
        //
        // In this example, the sensor reporting delay is small enough such that
        // the application receives an update before the system checks the sensor
        // readings again.
        Sensor accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        if (accelerometer != null) {
            sensorManager.registerListener(this, accelerometer,
                    SensorManager.SENSOR_DELAY_GAME, SensorManager.SENSOR_DELAY_UI);
        } else {
            System.out.println("accelerometer not support!");
        }
        Sensor magneticField = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        if (magneticField != null) {
            sensorManager.registerListener(this, magneticField,
                    SensorManager.SENSOR_DELAY_GAME, SensorManager.SENSOR_DELAY_UI);
        } else {
            System.out.println("magneticField not support!");
        }

        timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        // getDeviceOrientation();
                        // getActualDeviceOrientation();
                        updateOrientationAngles();
                        showInfo();
                    }
                });
            }
        };
        timer.schedule(task, 0, this.interval);

        WindowManager windowManager = ((WindowManager)reactContext.getSystemService(reactContext.WINDOW_SERVICE));
        Display display = windowManager.getDefaultDisplay();
        rotation = display.getRotation();

    }

    @ReactMethod
    public void stopUpdates() {
        // Don't receive any more updates from either sensor.
        sensorManager.unregisterListener(this);
        timer.cancel();
    }

    public void sendEvent(String eventName, WritableMap params) {
        // WritableMap params = Arguments.createMap();
        // params.putString("message", message);
        if (mEmitter == null) {
            mEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        if (mEmitter != null) {
            mEmitter.emit(eventName, params);
        }
    }

    private int count = 0;
    @ReactMethod
    public void heading() {
        new Timer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                count++;
                System.out.println(count);
                //sendEvent("count", String.valueOf(count));
            }
        }, 0, 1000);
    }

    @NonNull
    @Override
    public String getName() {
        return "TestModule";
    }

    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            System.arraycopy(applyLowPassFilter(event.values.clone(), accelerometerReading), 0, accelerometerReading,
                    0, accelerometerReading.length);
            accuracyAcc = event.accuracy;

        } else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            System.arraycopy(applyLowPassFilter(event.values.clone(), magnetometerReading), 0, magnetometerReading,
                    0, magnetometerReading.length);
            accuracyMag = event.accuracy;
        }
    }

    // Compute the three orientation angles based on the most recent readings from
    // the device's accelerometer and magnetometer.
    public void updateOrientationAngles() {
        // Update rotation matrix, which is needed to update orientation angles.
        SensorManager.getRotationMatrix(rotationMatrix, null,
                accelerometerReading, magnetometerReading);

        // "rotationMatrix" now has up-to-date information.

        SensorManager.getOrientation(rotationMatrix, orientationAngles);

        // "orientationAngles" now has up-to-date information.

    }

    public void showInfo() {
        WritableMap params = Arguments.createMap();

        float[] values = new float[3];
        values[0] = (float) Math.toDegrees(orientationAngles[0]);
        values[1] = (float) Math.toDegrees(orientationAngles[1]);
        values[2] = (float) Math.toDegrees(orientationAngles[2]);
        WritableArray valuesArray = Arguments.fromArray(values);
        WritableArray nativeArray = Arguments.fromArray(orientationAngles);
        params.putArray("rads", nativeArray);
        params.putArray("degs", valuesArray);
        params.putDouble("accuracyAcc", accuracyAcc);
        params.putDouble("accuracyMag", accuracyMag);

        // float[] values2 = new float[3];
        // values2[0] = (float) Math.toDegrees(orientationAngles2[0]);
        // values2[1] = (float) Math.toDegrees(orientationAngles2[1]);
        // values2[2] = (float) Math.toDegrees(orientationAngles2[2]);
        // WritableArray values2Array = Arguments.fromArray(values2);
        // WritableArray nativeWindowRotateArray = Arguments.fromArray(orientationAngles2);
        // params.putArray("rad_orient2", nativeWindowRotateArray);
        // params.putArray("deg_orient2", values2Array);

        //System.out.println(params);
        sendEvent("data", params);
    }

    // public void getActualDeviceOrientation() {
    //     float[] inR = new float[9];
    //     float[] outR = new float[9];

    //     SensorManager.getRotationMatrix(inR, null, accelerometerReading, magnetometerReading);
    //     int x_axis = SensorManager.AXIS_X;
    //     int y_axis = SensorManager.AXIS_Y;
    //     switch (rotation) {
    //         case (Surface.ROTATION_0): break;
    //         case (Surface.ROTATION_90):
    //             x_axis = SensorManager.AXIS_Y;
    //             y_axis = SensorManager.AXIS_MINUS_X;
    //             break;
    //         case (Surface.ROTATION_180):
    //             y_axis = SensorManager.AXIS_MINUS_Y;
    //             break;
    //         case (Surface.ROTATION_270):
    //             x_axis = SensorManager.AXIS_MINUS_Y;
    //             y_axis = SensorManager.AXIS_X;
    //             break;
    //         default: break;
    //     }
    //     SensorManager.remapCoordinateSystem(inR, x_axis, y_axis, outR);
    //     SensorManager.getOrientation(outR, orientationAngles2);
    //     return;
    // }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }

    //lower alpha should equal smoother movement
    private float[] applyLowPassFilter(float[] input, float[] output) {
        if ( output == null ) return input;

        for ( int i=0; i<input.length; i++ ) {
            output[i] = output[i] + ALPHA * (input[i] - output[i]);
        }
        return output;
    }
}
