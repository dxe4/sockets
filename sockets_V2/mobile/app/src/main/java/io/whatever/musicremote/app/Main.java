package io.whatever.musicremote.app;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;


public class Main extends Activity implements View.OnClickListener {

    Button btnBindDevice;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        btnBindDevice = (Button) findViewById(R.id.btnBindDevice);

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
        if (v.getId() == R.id.btnBindDevice) {
            IntentIntegrator integrator = new IntentIntegrator(this);
            integrator.initiateScan();
        }
    }

    protected void onActivityResult(int requestCode, int resultCode,
                                    Intent data) {
        switch(requestCode) {
            case IntentIntegrator.REQUEST_CODE: {
                if (resultCode != RESULT_CANCELED) {
                    IntentResult scanResult =
                            IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
                    if (scanResult != null) {
                        String upc = scanResult.getContents();
                        Log.d("Main", String.format("We got a scan result %s", upc));
                    }
                }
                break;
            }
        }
    }
}
