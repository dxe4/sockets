package io.whatever.musicremote.music;

import android.util.Log;

import com.pubnub.api.*;

import org.json.JSONException;
import org.json.JSONObject;
/**
 * Created by codi on 14/06/2014.
 */
public class PubSubRemote {

    final String PUBLISH_KEY = "pub-c-d9292649-de96-4d92-8425-1b559da50c45";
    final String SUBSCRIBE_KEY = "sub-c-44b62dd0-f3f1-11e3-a672-02ee2ddab7fe";

    String remoteChannelName;

    Pubnub pubnub;

    Callback callback;

    public PubSubRemote(final String remoteChannelName) {
        pubnub = new Pubnub(PUBLISH_KEY, SUBSCRIBE_KEY);
        this.remoteChannelName = remoteChannelName;
        this.callback = new Callback() {
            public void successCallback(String channel, Object response) {
                Log.d("PubSubRemote", String.format("Succeeded to publish in %s", remoteChannelName));
            }
            public void errorCallback(String channel, PubnubError error) {
                Log.e("PubSubRemote", String.format("Failed to publish in %s: %s", remoteChannelName, error.getErrorString()));
            }
        };
    }

    public void sendPlayPause() {
        JSONObject message = new JSONObject();
        try {
            message.put("action", "playpause");
        } catch (JSONException ex) {
            Log.e("PubSubRemote", "message could not be set");
        }

        Log.d("PubSubRemote", String.format("Sending action playpause in channel %s ...", this.remoteChannelName));
        pubnub.publish(remoteChannelName, message, this.callback);
    }

    public void sendSkip() {
        JSONObject message = new JSONObject();
        try {
            message.put("action", "skip");
        } catch (JSONException ex) {
            Log.e("PubSubRemote", "message could not be set");
        }

        pubnub.publish(remoteChannelName, message, this.callback);
    }

    public void sendBack() {
        JSONObject message = new JSONObject();
        try {
            message.put("action", "back");
        } catch (JSONException ex) {
            Log.e("PubSubRemote", "message could not be set");
        }

        pubnub.publish(remoteChannelName, message, this.callback);
    }
}
