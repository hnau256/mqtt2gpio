#include "initialize_wifi.hpp"

#include <esp_log.h>

#include <WiFiManager.h>

static const char *TAG = "InitializeWiFi";

bool initializeWifi() {
  WiFiManager wifiManager;

  if (!wifiManager.autoConnect("mqtt2gpio_ap")) {
    ESP_LOGE(TAG, "Failed to create Access Point");
    return false;
  }

  ESP_LOGD(TAG, "Waiting for WiFi connection...");
  while (WiFi.status() != WL_CONNECTED) {
    ESP_LOGD(TAG, ".");
    wifiManager.process();
    delay(10);
  }

  ESP_LOGI(TAG, "Connected to WiFi, IP: %s", WiFi.localIP().toString().c_str());
  return true;
}