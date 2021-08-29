package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

public class MainActivity extends AppCompatActivity {
    ImageView c1, c2, c3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        c1 = findViewById(R.id.btnPoints);
        c2 = findViewById(R.id.btnPerfil);

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
    }

    protected void openPerfil(){
        startActivity(new Intent(MainActivity.this, PerfilActivity.class));
    }
}