package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
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

public class PontosActivity extends AppCompatActivity {

    Session session;
    String nome;
    TextView user, cargo, points, rank;
    ImageView icon;
    int pontos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pontos);

        session = new Session(this);
        icon = findViewById(R.id.imageView3);
        user = findViewById(R.id.txtUsername);
        cargo = findViewById(R.id.txtCargo);
        points = findViewById(R.id.pointsnum);
        rank = findViewById(R.id.txtRank);

        carregarPontos();
        rank();
    }

    private void carregarPontos() {

        Log.d("log1:", nome + pontos);

        String url ="https://crowdzeromapi.herokuapp.com/userData";
        RequestQueue queue = Volley.newRequestQueue(this);

        StringRequest sr = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.e("HttpClient", "success! response: " + response.toString());
                        try {
                            JSONObject newData = new JSONObject(response);
                            JSONArray dataArray = newData.getJSONArray("user");

                            pontos = (Integer) dataArray.getJSONObject(0).get("cargo");
                            user.setText((String) dataArray.getJSONObject(0).get("nome"));
                            points.setText(String.valueOf(pontos));
                            if (pontos <= 50){
                                cargo.setText("Cidadão");
                                icon.setImageResource(R.drawable.avatar);
                            } else if (pontos > 50 && pontos <= 200) {
                                cargo.setText("Agente Sanitário");
                                icon.setImageResource(R.drawable.avatar2);
                            } else if (pontos > 200) {
                                cargo.setText("Agente de Saúde");
                                icon.setImageResource(R.drawable.avatar3);
                            }
                        }catch(Error | JSONException error) {
                            Toast.makeText(PontosActivity.this, error.toString(), Toast.LENGTH_SHORT).show();
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
                params.put("id", session.getId().toString());
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

    private void rank() {

        String urlRank ="https://crowdzeromapi.herokuapp.com/user";
        RequestQueue queueRank = Volley.newRequestQueue(this);

        StringRequest srR = new StringRequest(Request.Method.GET, urlRank,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.e("HttpClient", "success! response: " + response.toString());
                        try {
                            JSONObject newData = new JSONObject(response);
                            JSONArray dataArray = newData.getJSONArray("user");

                            for (int i = 0; i < dataArray.length(); i++){
                                if (Integer.valueOf(dataArray.getJSONObject(i).get("idu").toString()) == Integer.valueOf(session.getId())) {
                                    rank.setText("#" + i + "/" + dataArray.length());
                                    break;
                                }
                            }
                        }catch(Error | JSONException error) {
                            Toast.makeText(PontosActivity.this, error.toString(), Toast.LENGTH_SHORT).show();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("HttpClient", "error: " + error.toString());
            }
        });
        queueRank.add(srR);
    }
}