package com.example.crowdzero_android;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class MainActivity extends AppCompatActivity {
    ImageView c1, c2, c3;
    Button bMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        RequestQueue queue = Volley.newRequestQueue(this);
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
        queue.add(stringRequest);

        c1 = findViewById(R.id.btnPoints);
        c2 = findViewById(R.id.btnPerfil);
        bMap = findViewById(R.id.btnMapa);

        c1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnPoints:

                        break;
                }
            }
        });

        c2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnPerfil:
                        openPerfil();
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

    }

    protected void openPerfil(){
        startActivity(new Intent(MainActivity.this, PerfilActivity.class));
    }

    protected void openMapa(){
        startActivity(new Intent(MainActivity.this, MapaActivity.class));
    }
}