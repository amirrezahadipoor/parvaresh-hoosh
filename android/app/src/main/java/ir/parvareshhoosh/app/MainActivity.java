package ir.parvareshhoosh.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        // Android 15 enforces edge-to-edge for targetSdk 35. Reserve the real
        // status/navigation/gesture areas at the native WebView boundary instead
        // of trusting CSS env(safe-area-inset-*), which is often zero in WebView.
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.rgb(247, 249, 252));

        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(true);
            controller.setAppearanceLightNavigationBars(true);
        }

        View webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.setBackgroundColor(Color.rgb(247, 249, 252));
            ViewCompat.setOnApplyWindowInsetsListener(webView, (view, windowInsets) -> {
                Insets bars = windowInsets.getInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
                );
                // Insets must reduce the WebView's measured viewport. Padding the
                // WebView leaves CSS 100dvh at the full edge-to-edge size and clips
                // the page, which breaks scaling on Android 15. Real layout margins
                // make CSS pixels match the visible area and reserve Home/gesture UI.
                ViewGroup.LayoutParams rawParams = view.getLayoutParams();
                if (rawParams instanceof ViewGroup.MarginLayoutParams) {
                    ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) rawParams;
                    if (params.leftMargin != bars.left || params.topMargin != bars.top
                        || params.rightMargin != bars.right || params.bottomMargin != bars.bottom) {
                        params.setMargins(bars.left, bars.top, bars.right, bars.bottom);
                        view.setLayoutParams(params);
                    }
                }
                view.setPadding(0, 0, 0, 0);
                return windowInsets;
            });
            ViewCompat.requestApplyInsets(webView);
        }

        // Android system-back: navigate inside the SPA first; exit only from home.
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
