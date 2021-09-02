package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;

public class MapaActivity extends AppCompatActivity implements OnMapReadyCallback{
    private MapView mapView;
    private GoogleMap gmap;

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
        mapView.getMapAsync( this);
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
        gmap = googleMap;
        gmap.setMinZoomPreference(12);
        LatLng ny = new LatLng(40.7143528, -74.0059731);
        gmap.moveCamera(CameraUpdateFactory.newLatLng(ny));
    }

    //Centrar no user
    private void centerOnMyLocation() {

        map.setMyLocationEnabled(true);

        location = map.getMyLocation();

        if (location != null) {
            myLocation = new LatLng(location.getLatitude(),
                    location.getLongitude());
        }
        map.animateCamera(CameraUpdateFactory.newLatLngZoom(myLocation,
                Constants.MAP_ZOOM));
    }
    //Range do ponto
    Circle circle = map.addCircle(new CircleOptions()
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
//    }




}