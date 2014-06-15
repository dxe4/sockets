package io.whatever.musicremote.app;

import android.app.Activity;
import android.content.Intent;
import android.opengl.Visibility;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import io.whatever.musicremote.music.PubSubRemote;


public class Main extends Activity implements View.OnClickListener {

    Button btnBindDevice;

    ImageView btnBack;
    ImageView btnPlay;
    ImageView btnNext;

    LinearLayout bindDeviceMessage;
    LinearLayout remotePanel;

    PubSubRemote remote = null;

    boolean remoteIsBound = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        btnBindDevice = (Button) findViewById(R.id.btnBindDevice);
        bindDeviceMessage = (LinearLayout) findViewById(R.id.bindPhoneMessage);
        remotePanel = (LinearLayout) findViewById(R.id.remotePanel);

        btnBack = (ImageView) findViewById(R.id.btnBack);
        btnPlay = (ImageView) findViewById(R.id.btnPlay);
        btnNext = (ImageView) findViewById(R.id.btnNext);
        btnBack.setOnClickListener(this);
        btnPlay.setOnClickListener(this);
        btnNext.setOnClickListener(this);

        btnBindDevice.setOnClickListener(this);
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
        }
    }


    void bindPlayerWithUrl(String requestUrl) {
        remote = new PubSubRemote(requestUrl);
        remoteIsBound = true;

        bindDeviceMessage.setVisibility(View.GONE);
        remotePanel.setVisibility(View.VISIBLE);
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
}
