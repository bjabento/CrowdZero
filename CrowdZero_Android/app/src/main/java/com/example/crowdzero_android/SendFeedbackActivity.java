package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class SendFeedbackActivity extends AppCompatActivity {

    private int idR=0, idU=0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_feedback);

        Intent intent = getIntent();
        idR = Integer.parseInt(intent.getStringExtra("message"));

        Toast.makeText(SendFeedbackActivity.this, String.valueOf(idR), Toast.LENGTH_SHORT).show();

        RequestQueue queue = Volley.newRequestQueue(SendFeedbackActivity.this);
        String urlRep = "https://crowdzeromapi.herokuapp.com/reportsData";

        StringRequest sr = new StringRequest(Request.Method.POST, urlRep,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.d("message", response);

                        try {
                            JSONObject newData = new JSONObject(response);
                            JSONArray dataArray = newData.getJSONArray("reports");
                            Log.d("log", newData.toString());
                            for (int i = 0; i < dataArray.length(); i++) {
                                idU = (Integer) dataArray.getJSONObject(i).get("idu");
                                Log.d("log1", String.valueOf(idU));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("HttpClient", "error: " + error.toString());
            }
        })
        {
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                params.put("idr", String.valueOf(idR));
                return params;
            }
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String> params = new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }
        };
        queue.add(sr);

        findViewById(R.id.btnV).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnV:
                        sendFeed(true);
                        break;
                }
            }
        });

        findViewById(R.id.btnF).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnF:
                        sendFeed(false);
                        break;
                }
            }
        });
    }


    private void sendFeed(boolean status){

        Log.d("log2", String.valueOf(idU));

       RequestQueue queueFeed = Volley.newRequestQueue(SendFeedbackActivity.this);
        String urlFdb = "https://crowdzeromapi.herokuapp.com/feedbackPost";

        StringRequest sr = new StringRequest(Request.Method.POST, urlFdb,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {

                        }catch(Error error) {
                            Toast.makeText(SendFeedbackActivity.this, error.toString(), Toast.LENGTH_SHORT).show();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("HttpClient", "error: " + error.toString());
            }
        })
        {
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                params.put("idr", String.valueOf(idR));
                params.put("idu", String.valueOf(idU));
                params.put("feedb", String.valueOf(status));
                return params;
            }
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String> params = new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }
        };
        queueFeed.add(sr);
        Toast.makeText(SendFeedbackActivity.this, "Obrigado por contibuir para a comunidade CrowdZero", Toast.LENGTH_SHORT).show();
    }
}