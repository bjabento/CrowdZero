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
import androidx.cardview.widget.CardView;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.viewbinding.ViewBinding;
import com.example.crowdzero_android.R;
import com.google.android.material.textfield.TextInputLayout;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityPerfilBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final ImageView btnBack;

  @NonNull
  public final Button button;

  @NonNull
  public final ImageView imageView4;

  @NonNull
  public final CardView menuUserBar;

  @NonNull
  public final TextView txtCargo;

  @NonNull
  public final TextInputLayout txtContact;

  @NonNull
  public final TextInputLayout txtEmail;

  @NonNull
  public final TextInputLayout txtName;

  @NonNull
  public final TextInputLayout txtPassword;

  @NonNull
  public final TextView txtUsername;

  private ActivityPerfilBinding(@NonNull ConstraintLayout rootView, @NonNull ImageView btnBack,
      @NonNull Button button, @NonNull ImageView imageView4, @NonNull CardView menuUserBar,
      @NonNull TextView txtCargo, @NonNull TextInputLayout txtContact,
      @NonNull TextInputLayout txtEmail, @NonNull TextInputLayout txtName,
      @NonNull TextInputLayout txtPassword, @NonNull TextView txtUsername) {
    this.rootView = rootView;
    this.btnBack = btnBack;
    this.button = button;
    this.imageView4 = imageView4;
    this.menuUserBar = menuUserBar;
    this.txtCargo = txtCargo;
    this.txtContact = txtContact;
    this.txtEmail = txtEmail;
    this.txtName = txtName;
    this.txtPassword = txtPassword;
    this.txtUsername = txtUsername;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityPerfilBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityPerfilBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_perfil, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityPerfilBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.btnBack;
      ImageView btnBack = rootView.findViewById(id);
      if (btnBack == null) {
        break missingId;
      }

      id = R.id.button;
      Button button = rootView.findViewById(id);
      if (button == null) {
        break missingId;
      }

      id = R.id.imageView4;
      ImageView imageView4 = rootView.findViewById(id);
      if (imageView4 == null) {
        break missingId;
      }

      id = R.id.menuUserBar;
      CardView menuUserBar = rootView.findViewById(id);
      if (menuUserBar == null) {
        break missingId;
      }

      id = R.id.txtCargo;
      TextView txtCargo = rootView.findViewById(id);
      if (txtCargo == null) {
        break missingId;
      }

      id = R.id.txtContact;
      TextInputLayout txtContact = rootView.findViewById(id);
      if (txtContact == null) {
        break missingId;
      }

      id = R.id.txtEmail;
      TextInputLayout txtEmail = rootView.findViewById(id);
      if (txtEmail == null) {
        break missingId;
      }

      id = R.id.txtName;
      TextInputLayout txtName = rootView.findViewById(id);
      if (txtName == null) {
        break missingId;
      }

      id = R.id.txtPassword;
      TextInputLayout txtPassword = rootView.findViewById(id);
      if (txtPassword == null) {
        break missingId;
      }

      id = R.id.txtUsername;
      TextView txtUsername = rootView.findViewById(id);
      if (txtUsername == null) {
        break missingId;
      }

      return new ActivityPerfilBinding((ConstraintLayout) rootView, btnBack, button, imageView4,
          menuUserBar, txtCargo, txtContact, txtEmail, txtName, txtPassword, txtUsername);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
