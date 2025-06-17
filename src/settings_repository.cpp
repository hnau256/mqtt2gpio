#include "settings_repository.hpp"

#include "esp_log.h"
#include <LittleFS.h>

const char *const SETTINGS_FILENAME = "/settings.json";
static const char *TAG = "SettingsRepository";

SettingsRepository::SettingsRepository() {}

void SettingsRepository::setup() {
  File file = LittleFS.open(SETTINGS_FILENAME, "r");
  if (!file) {
    ESP_LOGW(TAG, "Settings file '%s' not found", SETTINGS_FILENAME);
    return;
  }

  String jsonString;
  while (file.available()) {
    jsonString += char(file.read());
  }
  file.close();

  settings.fromJson(jsonString);
  if (!settings.valid) {
    ESP_LOGW(TAG, "Unable parse settings from json: '%s'", jsonString);
    return;
  }

  ESP_LOGD(TAG, "Initialized successfully");
}

const Settings &SettingsRepository::getSettings() const {
  return settings;
}

bool SettingsRepository::updateSettings(const Settings &settings) {
  this->settings = settings;
  
  File file = LittleFS.open(SETTINGS_FILENAME, "w");
  if (!file) {
    ESP_LOGE(TAG, "Failed to open file '%s' for writing", SETTINGS_FILENAME);
    return false;
  }
  file.print(settings.toJson());
  file.close();

  ESP_LOGI(TAG, "Settings are saved to file '%s'", SETTINGS_FILENAME);
  return true;
}