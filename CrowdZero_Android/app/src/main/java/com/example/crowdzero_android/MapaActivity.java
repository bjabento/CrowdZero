package com.example.crowdzero_android;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MapaActivity extends AppCompatActivity implements OnMapReadyCallback {
    private MapView mapView;
    private GoogleMap gmap;
    private LocationRequest locationRequest;
    private double lat, lon;
    FusedLocationProviderClient fusedLocationProviderClient;
    LocationManager lmanager;
    LocationListener llistener;
    LatLng sydney = new LatLng(-34, 151);
    LatLng TamWorth = new LatLng(-31.083332, 150.916672);
    LatLng NewCastle = new LatLng(-32.916668, 151.750000);


    private static final String MAP_VIEW_BUNDLE_KEY = "AIzaSyA9tbVF3v7p0wYLhoRkcYdKuTLr5KREXr4";

    private ArrayList<LatLng> locationArrayList;

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

        findViewById(R.id.btnSubmeter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnSubmeter:
                        report();
                        break;
                }
            }
        });

        mapView = findViewById(R.id.mapView);
        mapView.onCreate(mapViewBundle);
        mapView.getMapAsync(this);

        locationArrayList = new ArrayList<>();

        locationArrayList.add(sydney);
        locationArrayList.add(TamWorth);
        locationArrayList.add(NewCastle);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ActivityCompat.checkSelfPermission(MapaActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                //Toast.makeText(MapaActivity.this, "Tenho permissão", Toast.LENGTH_SHORT).show();
                if (gpsen()) {
                    LocationServices.getFusedLocationProviderClient(MapaActivity.this)
                            .requestLocationUpdates(locationRequest, new LocationCallback() {
                                @Override
                                public void onLocationResult(@NonNull LocationResult locationResult) {
                                    super.onLocationResult(locationResult);

                                    if (locationResult != null && locationResult.getLocations().size() > 0) {
                                        int index = locationResult.getLocations().size() - 1;
                                        lat = locationResult.getLocations().get(index).getLatitude();
                                        lon = locationResult.getLocations().get(index).getLongitude();
                                    }
                                }
                            }, Looper.getMainLooper());
                } else {
                    Toast.makeText(MapaActivity.this, "Para utilizar esta funcionalidade tem de ter o GPS ativo", Toast.LENGTH_SHORT).show();
                }
            } else {
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == 1) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                if (isGPSEnabled()) {

                    getCurrentLocation();

                } else {

                    turnOnGPS();
                }
            }
        }


    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 2) {
            if (resultCode == Activity.RESULT_OK) {

                getCurrentLocation();
            }
        }
    }

    private boolean gpsen() {
        LocationManager locationManager = null;
        boolean isEnabled = false;

        if (locationManager == null) {
            locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
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
        gmap = googleMap;
        RequestQueue queue = Volley.newRequestQueue(this);
        String url1 = "https://crowdzeromapi.herokuapp.com/locals";
        String url2 = "https://crowdzeromapi.herokuapp.com/reports";

        if (ContextCompat.checkSelfPermission(this.getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            gmap.setMyLocationEnabled(true);

            StringRequest stringRequest1 = new StringRequest(Request.Method.GET, url1, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.d("message", response);

                    try {
                        JSONObject newData = new JSONObject(response);
                        JSONArray dataArray = newData.getJSONArray("locals");
                        for (int i = 0; i < dataArray.length(); i++) {
                            int idl = (Integer) dataArray.getJSONObject(i).get("idl");
                            String nome = (String) dataArray.getJSONObject(i).get("nome");
                            String lat = (String) dataArray.getJSONObject(i).get("latitude");
                            String lon = (String) dataArray.getJSONObject(i).get("longitude");
                            LatLng local = new LatLng(Double.valueOf(lat), Double.valueOf(lon));
                            Log.d("idlMESSAGE", Integer.toString(idl));


                            gmap.addMarker(new MarkerOptions().position(local).title(nome).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)).snippet(String.valueOf(idl)));
                            Circle circle = gmap.addCircle(new CircleOptions()
                                    .center(local)
                                    .radius(200)
                                    .strokeColor(Color.BLUE));
                        }
                        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(MapaActivity.this);
                        if (ActivityCompat.checkSelfPermission(MapaActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                            fusedLocationProviderClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() {
                                @Override
                                public void onComplete(@NonNull Task<Location> task) {
                                    Location location = task.getResult();
                                    Log.d("latitude", Double.toString(location.getLatitude()));
                                    Log.d("longitude", Double.toString(location.getLongitude()));
                                }
                            });
                        } else {
                            ActivityCompat.requestPermissions(MapaActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 44);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("fail", error.toString());
                    //Toast.makeText(MainActivity.this, Log.d("fail" , "dota"), Toast.LENGTH_SHORT).show();
                }
            });
            queue.add(stringRequest1);

            StringRequest stringRequest2 = new StringRequest(Request.Method.GET, url2, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.d("message", response);

                    try {
                        JSONObject newData = new JSONObject(response);
                        JSONArray dataArray = newData.getJSONArray("reports");
                        for (int i = 0; i < dataArray.length(); i++) {
                            int idr = (Integer) dataArray.getJSONObject(i).get("idr");
                            Log.d("idrMESSAGE", Integer.toString(idr));

                            gmap.addMarker(new MarkerOptions().position(locationArrayList.get(i)).title(String.valueOf(idr)));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("fail", error.toString());
                    //Toast.makeText(MainActivity.this, Log.d("fail" , "dota"), Toast.LENGTH_SHORT).show();
                }
            });
            queue.add(stringRequest2);
        } else {
            finish();
        }
    }

    public void report() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ActivityCompat.checkSelfPermission(MapaActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                //Location loc = LocationServices.FusedLocationApi.getLastLocation(google);
            } else {
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    private void getCurrentLocation(){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
            if(ActivityCompat.checkSelfPermission(MapaActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
                if(isGPSEnabled()){
                    LocationServices.getFusedLocationProviderClient(MapaActivity.this).requestLocationUpdates(locationRequest, new LocationCallback() {
                        @Override
                        public void onLocationResult(@NonNull LocationResult locationResult){
                            super.onLocationResult(locationResult);

                            LocationServices.getFusedLocationProviderClient(MapaActivity.this).removeLocationUpdates(this);

                            if(locationResult != null && locationResult.getLocations().size() > 0){

                                int index = locationResult.getLocations().size() - 1;
                                double latitude = locationResult.getLocations().get(index).getLatitude();
                                double longitude = locationResult.getLocations().get(index).getLongitude();

                                Log.d("Latitude", Double.toString(latitude));
                                Log.d("Longitude", Double.toString(longitude));
                            }
                        }
                    }, Looper.getMainLooper());
                } else {
                    turnOnGPS();
                }
            } else {
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    private void turnOnGPS() {
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder().addLocationRequest(locationRequest);
        builder.setAlwaysShow(true);

        Task<LocationSettingsResponse> result = LocationServices.getSettingsClient(getApplicationContext()).checkLocationSettings(builder.build());
        result.addOnCompleteListener(new OnCompleteListener<LocationSettingsResponse>() {
            @Override
            public void onComplete(@NonNull Task<LocationSettingsResponse> task) {
                try{
                    LocationSettingsResponse response = task.getResult(ApiException.class);
                    Toast.makeText(MapaActivity.this, "GPS ta a andar", Toast.LENGTH_SHORT).show();

                }catch(ApiException e){
                    switch(e.getStatusCode()){
                        case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                            try{
                                ResolvableApiException resolvableApiException = (ResolvableApiException) e;
                                resolvableApiException.startResolutionForResult(MapaActivity.this, 2);
                            }catch(IntentSender.SendIntentException ex){
                                ex.printStackTrace();
                            }
                            break;
                        case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                            Log.d("ITS OVER...", "Bros...");
                            break;
                    }
                }
            }
        });

    }
    private boolean isGPSEnabled(){
        LocationManager locationManager = null;
        boolean isEnabled = false;

        if(locationManager == null){
            locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        }

        isEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        return isEnabled;
    }

    /*public void getLocation() {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setInterval(1000);
        locationRequest.setFastestInterval(1000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        LocationServices.getFusedLocationProviderClient(MapaActivity.this)
                .requestLocationUpdates(locationRequest, new LocationCallback() {
                    @Override
                    public void onLocationResult(LocationResult locationResult) {
                        super.onLocationResult(locationResult);
                        LocationServices.getFusedLocationProviderClient(MapaActivity.this)
                                .removeLocationUpdates(this);
                        if (locationResult != null && locationResult.getLocations().size() > 0){
                            int lastestLocationIndex = locationResult.getLocations().size() - 1;
                            Double latitude = locationResult.getLocations().get(lastestLocationIndex).getLatitude();
                            Double longitude = locationResult.getLocations().get(lastestLocationIndex).getLongitude();
                        }
                    }
                }), Looper.getMainLooper();

    }*/
}