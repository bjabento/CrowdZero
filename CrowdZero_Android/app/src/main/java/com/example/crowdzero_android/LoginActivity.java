package com.example.crowdzero_android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "";
    SignInButton signInButton;
    private GoogleSignInClient mGoogleSignInClient;
    private static final int SIGN_IN = 1;
    private int RC_SIGN_IN;
    private String[] rIdu, rCargo, rNome, rEmail, rPass;
    private Session session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        session = new Session(this);

        findViewById(R.id.btnLoginG).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnLoginG:
                        signIn();
                        break;
                }
            }
        });

        findViewById(R.id.btnLogin).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnLogin:
                        login();
                        break;
                }
            }
        });

        findViewById(R.id.btnReg).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (view.getId()) {
                    case R.id.btnReg:
                        startActivity(new Intent(LoginActivity.this, RegistarActivity.class));
                        break;
                }
            }
        });

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail().build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
    }

    @Override
    protected void onStart() {
        super.onStart();

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
    }

    private void login() {
        String url ="https://crowdzeromapi.herokuapp.com/login";
        RequestQueue queue = Volley.newRequestQueue(this);

        String email = ((TextInputLayout)findViewById(R.id.txtEmail)).getEditText().getText().toString();
        String password = ((TextInputLayout)findViewById(R.id.txtPassLogin)).getEditText().getText().toString();

        StringRequest sr = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            if (!response.equals("[]")){
                                String[] sep = response.split(":");
                                rIdu = sep[1].split(",");
                                rCargo = sep[2].split(",");
                                rNome = sep[3].split(",");
                                rEmail = sep[5].split(",");
                                rPass = sep[6].split(",");
                                rPass[0] = rPass[0].replace("\"", "");

                                if (rPass[0].equals(password)){
                                    Log.e("HttpClient", "success! response: " + response.toString());
                                    session.setId(rIdu[0] = rIdu[0].replace("\"", ""));
                                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                                    finish();
                                }
                                else {
                                    Toast.makeText(LoginActivity.this, "Credenciais incorretas", Toast.LENGTH_SHORT).show();
                                }
                               /* Toast.makeText(LoginActivity.this, sep[6].toString(), Toast.LENGTH_SHORT).show();
                                Toast.makeText(LoginActivity.this, rPass[0].toString(), Toast.LENGTH_SHORT).show();*/
                            }
                        }catch(Error error) {
                            Toast.makeText(LoginActivity.this, error.toString(), Toast.LENGTH_SHORT).show();
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
                params.put("user", email);
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

    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finish();
        } catch (ApiException e) {
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
        }
    }
}