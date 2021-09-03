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
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityMainBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final ImageView btnContactos;

  @NonNull
  public final Button btnLogout;

  @NonNull
  public final Button btnMapa;

  @NonNull
  public final Button btnMenu;

  @NonNull
  public final ImageView btnPerfil;

  @NonNull
  public final ImageView btnPoints;

  @NonNull
  public final CardView cardView3;

  @NonNull
  public final CardView cardViewPerfil;

  @NonNull
  public final CardView cardViewPontos;

  @NonNull
  public final ImageView imageView4;

  @NonNull
  public final CardView menuUserBar;

  @NonNull
  public final TextView txtCargo;

  @NonNull
  public final TextView txtUsername;

  private ActivityMainBinding(@NonNull ConstraintLayout rootView, @NonNull ImageView btnContactos,
      @NonNull Button btnLogout, @NonNull Button btnMapa, @NonNull Button btnMenu,
      @NonNull ImageView btnPerfil, @NonNull ImageView btnPoints, @NonNull CardView cardView3,
      @NonNull CardView cardViewPerfil, @NonNull CardView cardViewPontos,
      @NonNull ImageView imageView4, @NonNull CardView menuUserBar, @NonNull TextView txtCargo,
      @NonNull TextView txtUsername) {
    this.rootView = rootView;
    this.btnContactos = btnContactos;
    this.btnLogout = btnLogout;
    this.btnMapa = btnMapa;
    this.btnMenu = btnMenu;
    this.btnPerfil = btnPerfil;
    this.btnPoints = btnPoints;
    this.cardView3 = cardView3;
    this.cardViewPerfil = cardViewPerfil;
    this.cardViewPontos = cardViewPontos;
    this.imageView4 = imageView4;
    this.menuUserBar = menuUserBar;
    this.txtCargo = txtCargo;
    this.txtUsername = txtUsername;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityMainBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityMainBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_main, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityMainBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.btnContactos;
      ImageView btnContactos = rootView.findViewById(id);
      if (btnContactos == null) {
        break missingId;
      }

      id = R.id.btnLogout;
      Button btnLogout = rootView.findViewById(id);
      if (btnLogout == null) {
        break missingId;
      }

      id = R.id.btnMapa;
      Button btnMapa = rootView.findViewById(id);
      if (btnMapa == null) {
        break missingId;
      }

      id = R.id.btnMenu;
      Button btnMenu = rootView.findViewById(id);
      if (btnMenu == null) {
        break missingId;
      }

      id = R.id.btnPerfil;
      ImageView btnPerfil = rootView.findViewById(id);
      if (btnPerfil == null) {
        break missingId;
      }

      id = R.id.btnPoints;
      ImageView btnPoints = rootView.findViewById(id);
      if (btnPoints == null) {
        break missingId;
      }

      id = R.id.cardView3;
      CardView cardView3 = rootView.findViewById(id);
      if (cardView3 == null) {
        break missingId;
      }

      id = R.id.cardView_Perfil;
      CardView cardViewPerfil = rootView.findViewById(id);
      if (cardViewPerfil == null) {
        break missingId;
      }

      id = R.id.cardView_Pontos;
      CardView cardViewPontos = rootView.findViewById(id);
      if (cardViewPontos == null) {
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

      id = R.id.txtUsername;
      TextView txtUsername = rootView.findViewById(id);
      if (txtUsername == null) {
        break missingId;
      }

      return new ActivityMainBinding((ConstraintLayout) rootView, btnContactos, btnLogout, btnMapa,
          btnMenu, btnPerfil, btnPoints, cardView3, cardViewPerfil, cardViewPontos, imageView4,
          menuUserBar, txtCargo, txtUsername);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
