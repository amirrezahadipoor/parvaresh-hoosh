package ir.parvareshhoosh.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;

import androidx.activity.OnBackPressedCallback;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, true);
        window.setStatusBarColor(Color.rgb(247, 249, 252));
        window.setNavigationBarColor(Color.rgb(247, 249, 252));

        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(true);
            controller.setAppearanceLightNavigationBars(true);
        }

        // Android system-back: navigate inside the SPA first; exit only from the home screen.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() == null || getBridge().getWebView() == null) {
                    finish();
                    return;
                }
                getBridge().getWebView().evaluateJavascript(
                    "(function(){if(window.Nav&&window.Nav.current&&window.Nav.current()!=='home'){window.Nav.back();return 'handled';}return 'exit';})()",
                    value -> { if ("\"exit\"".equals(value)) finish(); }
                );
            }
        });
    }
}
