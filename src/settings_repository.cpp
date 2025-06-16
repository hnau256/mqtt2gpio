#include "settings_repository.hpp"

namespace {
const char *const SETTINGS_FILENAME = "/settings.json";
}

void SettingsRepository::init() {
  if (!LittleFS.begin(true)) {
    Serial.println("Failed to mount LittleFS, using default settings");
    return;
  }

  File file = LittleFS.open(SETTINGS_FILENAME, "r");
  if (file) {
    String jsonString;
    while (file.available()) {
      jsonString += char(file.read());
    }
    file.close();
    bool parseResult = settings.fromJson(jsonString);
    if (parseResult) {
      Serial.println("Settings loaded from file");
    } else {
      Serial.println("Unable parse setting from: " + jsonString);
    }
  } else {
    Serial.println("No settings.json found, using default settings");
  }
}

const Settings &SettingsRepository::getSettings() const { return settings; }

bool SettingsRepository::saveSettings(const Settings &newSettings) {
  String jsonString = newSettings.toJson();
  File file = LittleFS.open(SETTINGS_FILENAME, "w");
  if (!file) {
    Serial.println("Failed to open settings.json for writing");
    return false;
  }
  file.print(jsonString);
  file.close();

  settings = newSettings;
  Serial.println("Settings saved successfully");
  return true;
}