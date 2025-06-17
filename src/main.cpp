#define LOG_LOCAL_LEVEL ESP_LOG_VERBOSE
#include "esp_log.h"

#include <Arduino.h>

#include "initialize_filesystem.hpp"
#include "initialize_mdns.hpp"
#include "initialize_wifi.hpp"
#include "mqtt_binder.hpp"
#include "settings_repository.hpp"
#include "web_server.hpp"

static const char *TAG = "Main";

bool initialized;

SettingsRepository settingsRepository;
WebServerHandler server(settingsRepository);
MqttBinder mqtt;

bool initialize() {
  bool fileSystemInitialized = initializeFilesystem();
  if (!fileSystemInitialized) {
    return false;
  }

  bool wifiInitialized = initializeWifi();
  if (!wifiInitialized) {
    return false;
  }

  return true;
}

void setup() {
  Serial.begin(115200);

  ESP_LOGD(TAG, "Init");

  initialized = initialize();
  if (!initialized) {
    ESP_LOGE(TAG, "Unable to initialie. Restarting...");
    ESP.restart();
    return;
  }

  settingsRepository.setup();

  server.setup();
  
  const Settings& settings = settingsRepository.getSettings();
  initializeMDns(settings);
  mqtt.setup(settings);
}

void loop() {
  if (!initialized) {
    return;
  }
  server.loop();
  mqtt.loop();
}