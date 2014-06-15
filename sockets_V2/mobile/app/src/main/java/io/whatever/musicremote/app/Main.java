package io.whatever.musicremote.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.opengl.Visibility;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.FloatMath;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import io.whatever.musicremote.music.PubSubRemote;
import io.whatever.musicremote.views.ColorBackground;


public class Main extends Activity implements View.OnClickListener, SensorEventListener {

    Button btnBindDevice;

    ImageView btnBack;
    ImageView btnPlay;
    ImageView btnNext;

    LinearLayout bindDeviceMessage;
    LinearLayout remotePanel;

    ColorBackground background;
    ColorBackground btnBlue;
    ColorBackground btnMagenta;
    ColorBackground btnYellow;

    PubSubRemote remote = null;

    boolean remoteIsBound = false;

    SensorManager sensorMgr;
    private long shakeTimestamp;
    private int shakeCount;

    private static final float SHAKE_THRESHOLD_GRAVITY = 2.7F;
    private static final int SHAKE_SLOP_TIME_MS = 500;
    private static final int SHAKE_COUNT_RESET_TIME_MS = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        btnBindDevice = (Button) findViewById(R.id.btnBindDevice);
        bindDeviceMessage = (LinearLayout) findViewById(R.id.bindPhoneMessage);
        remotePanel = (LinearLayout) findViewById(R.id.remotePanel);
        background = (ColorBackground) findViewById(R.id.colorBackground);

        btnBack = (ImageView) findViewById(R.id.btnBack);
        btnPlay = (ImageView) findViewById(R.id.btnPlay);
        btnNext = (ImageView) findViewById(R.id.btnNext);
        btnBack.setOnClickListener(this);
        btnPlay.setOnClickListener(this);
        btnNext.setOnClickListener(this);

        btnBlue = (ColorBackground) findViewById(R.id.btnColorBlue);
        btnBlue.setColor("#1bc2ff");

        btnMagenta = (ColorBackground) findViewById(R.id.btnColorMagenta);
        btnMagenta.setColor("#ff00ff");

        btnYellow = (ColorBackground) findViewById(R.id.btnColorYellow);
        btnMagenta.setColor("#ffb500");

        btnBlue.setOnClickListener(this);
        btnMagenta.setOnClickListener(this);
        btnYellow.setOnClickListener(this);

        btnBindDevice.setOnClickListener(this);

        sensorMgr = (SensorManager) getSystemService(SENSOR_SERVICE);
        sensorMgr.registerListener(this, sensorMgr.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_GAME);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnBindDevice:
                IntentIntegrator integrator = new IntentIntegrator(this);
                integrator.initiateScan();
                break;
            case R.id.btnBack:
            case R.id.btnPlay:
            case R.id.btnNext:
                sendRemoteAction(v.getId());
                break;
        }
    }

    void sendRemoteAction(int action) {
        if (remote == null) {
            return;
        }

        switch (action) {
            case R.id.btnBack:
                remote.sendBack();
                break;
            case R.id.btnPlay:
                remote.sendPlayPause();
                break;
            case R.id.btnNext:
                remote.sendSkip();
                break;
            case R.id.btnColorBlue:
                background.setBackgroundColor(Color.parseColor("1bc2ff"));
                break;
            case R.id.btnColorMagenta:
                background.setBackgroundColor(Color.parseColor("ff00ff"));
                break;
            case R.id.btnColorYellow:
                background.setBackgroundColor(Color.parseColor("ffb500"));
                break;
        }
    }


    void bindPlayerWithUrl(String requestUrl) {
        remote = new PubSubRemote(requestUrl);
        remoteIsBound = true;

        bindDeviceMessage.setVisibility(View.GONE);
        remotePanel.setVisibility(View.VISIBLE);

        background.setColor("#c0c0c0");
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch(requestCode) {
            case IntentIntegrator.REQUEST_CODE: {
                if (resultCode != RESULT_CANCELED) {
                    IntentResult scanResult =
                            IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
                    if (scanResult != null) {
                        // Here the qr contents are fetched
                        String upc = scanResult.getContents();
                        bindPlayerWithUrl(upc);
                    }
                }
                break;
            }
        }
    }

    public void onShake(int shakeCount) {
        Log.d("Main", String.format("Has shaked %d times", shakeCount));
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        float gX = x / SensorManager.GRAVITY_EARTH;
        float gY = y / SensorManager.GRAVITY_EARTH;
        float gZ = z / SensorManager.GRAVITY_EARTH;

        // gForce will be close to 1 when there is no movement.
        float gForce = FloatMath.sqrt(gX * gX + gY * gY + gZ * gZ);

        if (gForce > SHAKE_THRESHOLD_GRAVITY) {
            final long now = System.currentTimeMillis();

            // ignore shake events too close to each other (500ms)
            if (shakeTimestamp + SHAKE_SLOP_TIME_MS > now) {
                return;
            }

            // reset the shake count after 3 seconds of no shakes
            if (shakeTimestamp + SHAKE_COUNT_RESET_TIME_MS < now) {
                shakeCount = 0;
            }

            shakeTimestamp = now;
            shakeCount++;

            this.onShake(shakeCount);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}
