package com.example.crowdzero_android;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.textfield.TextInputLayout;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    private Session session;
    private String[] rCargo, rNome;
    ImageView c1, c2, c3;
    Button bMap, bLogo;
    TextView tUser, tCargo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        session = new Session(this);

        c1 = findViewById(R.id.btnPoints);
        c2 = findViewById(R.id.btnPerfil);
        c3 = findViewById(R.id.btnContactos);
        bMap = findViewById(R.id.btnMapa);
        tUser = findViewById(R.id.txtUsername);
        tCargo = findViewById(R.id.txtCargo);
        bLogo = findViewById(R.id.btnLogout);

        /*RequestQueue queue = Volley.newRequestQueue(this);
        String url = "https://crowdzeromapi.herokuapp.com/user";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("message", response);
                //Toast.makeText(MainActivity.this, "Dota", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("fail" , error.toString());
                //Toast.makeText(MainActivity.this, Log.d("fail" , "dota"), Toast.LENGTH_SHORT).show();
            }
        });
        queue.add(stringRequest);*/

        String url ="https://crowdzeromapi.herokuapp.com/userData";
        RequestQueue queue = Volley.newRequestQueue(this);

        StringRequest sr = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.e("HttpClient", "success! response: " + response.toString());
                        try {
                            if (!response.equals("[]")){
                                String[] sep = response.split(":");
                                rCargo = sep[2].split(",");
                                rNome = sep[3].split(",");

                                tUser.setText(rNome[0] = rNome[0].replace("\"", ""));
                                rCargo[0] = rCargo[0].replace("\"", "");
                                if (Integer.parseInt(rCargo[0]) <= 10){
                                    tCargo.setText("Cidadão");
                                } else if (Integer.parseInt(rCargo[0]) > 10 && Integer.parseInt(rCargo[0]) <= 20) {
                                    tCargo.setText("Agente Sanitário");
                                } else if (Integer.parseInt(rCargo[0]) > 20) {
                                    tCargo.setText("Agente de Saúde");
                                }
                            }
                        }catch(Error error) {
                            Toast.makeText(MainActivity.this, error.toString(), Toast.LENGTH_SHORT).show();
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

        c1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnPoints:
                        startActivity(new Intent(MainActivity.this, PontosActivity.class));
                        break;
                }
            }
        });

        c2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnPerfil:
                        startActivity(new Intent(MainActivity.this, PerfilActivity.class));
                        break;
                }
            }
        });

        c3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnContactos:
                        startActivity(new Intent(MainActivity.this, ContactosActivity.class));
                        break;
                }
            }
        });

        bMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnMapa:
                        openMapa();
                        break;
                }
            }
        });

        bLogo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnLogout:
                        finish();
                        break;
                }
            }
        });

    }

    protected void openMapa(){
        startActivity(new Intent(MainActivity.this, MapaActivity.class));
    }
}