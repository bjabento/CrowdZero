// Generated by view binder compiler. Do not edit!
package com.example.crowdzero_android.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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

public final class ActivityPontosBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final ImageView imageView3;

  @NonNull
  public final CardView menuUserBar;

  @NonNull
  public final ImageView pointslogo;

  @NonNull
  public final TextView pointsnum;

  @NonNull
  public final TextView textView4;

  @NonNull
  public final TextView textView6;

  @NonNull
  public final TextView txtCargo;

  @NonNull
  public final TextView txtNext;

  @NonNull
  public final TextView txtRank;

  @NonNull
  public final TextView txtUsername;

  private ActivityPontosBinding(@NonNull ConstraintLayout rootView, @NonNull ImageView imageView3,
      @NonNull CardView menuUserBar, @NonNull ImageView pointslogo, @NonNull TextView pointsnum,
      @NonNull TextView textView4, @NonNull TextView textView6, @NonNull TextView txtCargo,
      @NonNull TextView txtNext, @NonNull TextView txtRank, @NonNull TextView txtUsername) {
    this.rootView = rootView;
    this.imageView3 = imageView3;
    this.menuUserBar = menuUserBar;
    this.pointslogo = pointslogo;
    this.pointsnum = pointsnum;
    this.textView4 = textView4;
    this.textView6 = textView6;
    this.txtCargo = txtCargo;
    this.txtNext = txtNext;
    this.txtRank = txtRank;
    this.txtUsername = txtUsername;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityPontosBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityPontosBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_pontos, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityPontosBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.imageView3;
      ImageView imageView3 = rootView.findViewById(id);
      if (imageView3 == null) {
        break missingId;
      }

      id = R.id.menuUserBar;
      CardView menuUserBar = rootView.findViewById(id);
      if (menuUserBar == null) {
        break missingId;
      }

      id = R.id.pointslogo;
      ImageView pointslogo = rootView.findViewById(id);
      if (pointslogo == null) {
        break missingId;
      }

      id = R.id.pointsnum;
      TextView pointsnum = rootView.findViewById(id);
      if (pointsnum == null) {
        break missingId;
      }

      id = R.id.textView4;
      TextView textView4 = rootView.findViewById(id);
      if (textView4 == null) {
        break missingId;
      }

      id = R.id.textView6;
      TextView textView6 = rootView.findViewById(id);
      if (textView6 == null) {
        break missingId;
      }

      id = R.id.txtCargo;
      TextView txtCargo = rootView.findViewById(id);
      if (txtCargo == null) {
        break missingId;
      }

      id = R.id.txtNext;
      TextView txtNext = rootView.findViewById(id);
      if (txtNext == null) {
        break missingId;
      }

      id = R.id.txtRank;
      TextView txtRank = rootView.findViewById(id);
      if (txtRank == null) {
        break missingId;
      }

      id = R.id.txtUsername;
      TextView txtUsername = rootView.findViewById(id);
      if (txtUsername == null) {
        break missingId;
      }

      return new ActivityPontosBinding((ConstraintLayout) rootView, imageView3, menuUserBar,
          pointslogo, pointsnum, textView4, textView6, txtCargo, txtNext, txtRank, txtUsername);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
