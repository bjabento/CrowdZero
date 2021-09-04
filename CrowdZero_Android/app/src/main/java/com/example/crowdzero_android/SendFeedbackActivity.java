package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.HashMap;
import java.util.Map;

public class SendFeedbackActivity extends AppCompatActivity {

    Button v, f;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_feedback);

        v = findViewById(R.id.btnV);
        f = findViewById(R.id.btnF);


    }


    private void sendFeed(){
        RequestQueue queue = Volley.newRequestQueue(SendFeedbackActivity.this);
        String urlFdb = "https://crowdzeromapi.herokuapp.com/feedbackPost";

        StringRequest sr = new StringRequest(Request.Method.POST, urlFdb,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            if (!response.equals("[]")){
                                String[] sep = response.split(":");
                            }
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
                params.put("idu", session.getId().toString());
                params.put("idr", idF.toString());
                params.put("feedb", "true");
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
    }
}