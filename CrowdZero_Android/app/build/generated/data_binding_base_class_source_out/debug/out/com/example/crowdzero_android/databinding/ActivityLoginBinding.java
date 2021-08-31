// Generated by view binder compiler. Do not edit!
package com.example.crowdzero_android.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.viewbinding.ViewBinding;
import com.example.crowdzero_android.R;
import com.google.android.gms.common.SignInButton;
import com.google.android.material.textfield.TextInputLayout;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityLoginBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final Button btnLogin;

  @NonNull
  public final SignInButton btnLoginG;

  @NonNull
  public final TextView btnReg;

  @NonNull
  public final View divider;

  @NonNull
  public final ImageView imageView;

  @NonNull
  public final TextView textView;

  @NonNull
  public final TextView textView2;

  @NonNull
  public final TextInputLayout txtEmail;

  @NonNull
  public final TextInputLayout txtPassLogin;

  private ActivityLoginBinding(@NonNull ConstraintLayout rootView, @NonNull Button btnLogin,
      @NonNull SignInButton btnLoginG, @NonNull TextView btnReg, @NonNull View divider,
      @NonNull ImageView imageView, @NonNull TextView textView, @NonNull TextView textView2,
      @NonNull TextInputLayout txtEmail, @NonNull TextInputLayout txtPassLogin) {
    this.rootView = rootView;
    this.btnLogin = btnLogin;
    this.btnLoginG = btnLoginG;
    this.btnReg = btnReg;
    this.divider = divider;
    this.imageView = imageView;
    this.textView = textView;
    this.textView2 = textView2;
    this.txtEmail = txtEmail;
    this.txtPassLogin = txtPassLogin;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityLoginBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityLoginBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_login, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityLoginBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.btnLogin;
      Button btnLogin = rootView.findViewById(id);
      if (btnLogin == null) {
        break missingId;
      }

      id = R.id.btnLoginG;
      SignInButton btnLoginG = rootView.findViewById(id);
      if (btnLoginG == null) {
        break missingId;
      }

      id = R.id.btnReg;
      TextView btnReg = rootView.findViewById(id);
      if (btnReg == null) {
        break missingId;
      }

      id = R.id.divider;
      View divider = rootView.findViewById(id);
      if (divider == null) {
        break missingId;
      }

      id = R.id.imageView;
      ImageView imageView = rootView.findViewById(id);
      if (imageView == null) {
        break missingId;
      }

      id = R.id.textView;
      TextView textView = rootView.findViewById(id);
      if (textView == null) {
        break missingId;
      }

      id = R.id.textView2;
      TextView textView2 = rootView.findViewById(id);
      if (textView2 == null) {
        break missingId;
      }

      id = R.id.txtEmail;
      TextInputLayout txtEmail = rootView.findViewById(id);
      if (txtEmail == null) {
        break missingId;
      }

      id = R.id.txtPassLogin;
      TextInputLayout txtPassLogin = rootView.findViewById(id);
      if (txtPassLogin == null) {
        break missingId;
      }

      return new ActivityLoginBinding((ConstraintLayout) rootView, btnLogin, btnLoginG, btnReg,
          divider, imageView, textView, textView2, txtEmail, txtPassLogin);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
