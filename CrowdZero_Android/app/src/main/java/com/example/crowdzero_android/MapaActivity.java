package com.example.crowdzero_android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;

public class MapaActivity extends AppCompatActivity implements OnMapReadyCallback{
    private MapView mapView;
    private GoogleMap gmap;
    private LocationRequest locationRequest;
    private double lat, lon;
    LocationManager lmanager;
    LocationListener llistener;
    LatLng ny;
    Location loc;


    private static final String MAP_VIEW_BUNDLE_KEY = "AIzaSyA9tbVF3v7p0wYLhoRkcYdKuTLr5KREXr4";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mapa);

        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAP_VIEW_BUNDLE_KEY);
        }

        findViewById(R.id.btnMenu2).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnMenu2:
                        finish();
                        break;
                }
            }
        });

        mapView = findViewById(R.id.mapView);
        mapView.onCreate(mapViewBundle);
        mapView.getMapAsync(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
            if (ActivityCompat.checkSelfPermission(MapaActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
                Toast.makeText(MapaActivity.this, "Tenho permissão", Toast.LENGTH_SHORT).show();
                if (gpsen()){
                    LocationServices.getFusedLocationProviderClient(MapaActivity.this)
                            .requestLocationUpdates(locationRequest, new LocationCallback() {
                                @Override
                                public void onLocationResult(@NonNull LocationResult locationResult) {
                                    super.onLocationResult(locationResult);

                                    if (locationResult != null && locationResult.getLocations().size() >0){
                                        int index = locationResult.getLocations().size()-1;
                                        lat = locationResult.getLocations().get(index).getLatitude();
                                        lon = locationResult.getLocations().get(index).getLongitude();
                                    }
                                }
                            }, Looper.getMainLooper());
                }else {
                    Toast.makeText(MapaActivity.this, "Para utilizar esta funcionalidade tem de ter o GPS ativo", Toast.LENGTH_SHORT).show();
                }
            }
            else{
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    private boolean gpsen(){
        LocationManager locationManager = null;
        boolean isEnabled = false;

        if (locationManager == null){
            locationManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        }

        isEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        return isEnabled;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        Bundle mapViewBundle = outState.getBundle(MAP_VIEW_BUNDLE_KEY);
        if (mapViewBundle == null) {
            mapViewBundle = new Bundle();
            outState.putBundle(MAP_VIEW_BUNDLE_KEY, mapViewBundle);
        }

        mapView.onSaveInstanceState(mapViewBundle);
    }

    @Override
    protected void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mapView.onStop();
    }

    @Override
    protected void onPause() {
        mapView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        mapView.onDestroy();
        super.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        //gmap.setMinZoomPreference(12);
        //LatLng ny;
        //ny = new LatLng(40.7143528, -74.0059731);
        Circle circle;
        gmap = googleMap;
        if (ContextCompat.checkSelfPermission(this.getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            gmap.setMyLocationEnabled(true);
            ny = new LatLng(lat, lon);

            circle = gmap.addCircle(new CircleOptions()
                    .center(new LatLng(lat, lon))
                    .radius(10000)
                    .strokeColor(Color.RED));
            gmap.moveCamera(CameraUpdateFactory.newLatLng(ny));
        } else {
            finish();
        }
    }


    //Range do ponto
    /*Circle circle = map.addCircle(new CircleOptions()
            .center(new LatLng(-33.87365, 151.20689))
            .radius(10000)
            .strokeColor(Color.RED)
            .fillColor(Color.BLUE));


    circle = new google.maps.Circle( {
        map           : map,
                center        : new google.maps.LatLng( 100, 20 ),
                radius        : 2000,
                strokeColor   : '#FF0099',
                strokeOpacity : 1,
                strokeWeight  : 2,
                fillColor     : '#009ee0',
                fillOpacity   : 0.2
    } )

            circle.getBounds().contains( new google.maps.LatLng( 101, 21 ) );


    google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng( 100, 20 ),
            new google.maps.LatLng( 101, 21 )
            ) <= 2000;

    float[] distance = new float[2];

//Location.distanceBetween(latLng.latitude, latLng.longitude, circle.getCenter().latitude,circle.getCenter().longitude,distance);
//if ( distance[0] <= circle.getRadius())
//    {
        // Inside The Circle
//    }
//else
//    {
        // Outside The Circle
//    }*/




}