package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.myapplication.ui.theme.MyApplicationTheme

public class mywebClient extends WebViewClient {
    @Override
    public void onPageStarted(WebView view,
                              String url,
                              Bitmap favicon) {
        super.onPageStarted(view,url,favicon);
    }
    @Override
    public boolean shouldOverrideUrlLoading(WebView view,
                                            String url) {
        view.loadUrl(url);
        return true;
    }
    @Override
    public void onBackPressed() {
        if (mywebView.canGoBack()) {
            mywebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}