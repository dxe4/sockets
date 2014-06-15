package io.whatever.musicremote.views;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.shapes.Shape;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

/**
 * Created by codi on 15/06/2014.
 */
public class ColorBackground extends FrameLayout {
    private int r;
    private int g;
    private int b;
    private String currentColor;
    final int STEP = 3;

    public ColorBackground(Context context) {
        super(context);
    }

    public ColorBackground(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ColorBackground(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private void updateColor() {
    }

    public void setColor(String color) {
        this.currentColor = color;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (this.currentColor != null) {
            //this.setBackgroundColor(Color.parseColor(this.currentColor));
        }
    }
}
