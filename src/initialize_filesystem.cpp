#include "initialize_filesystem.hpp"

#include "esp_log.h"
#include <LittleFS.h>

static const char *TAG = "InitializeFilesystem";

bool initializeFilesystem() {
bool result = LittleFS.begin(true);
  if (!result) {
    ESP_LOGE(TAG, "Failed to mount LittleFS");
  }

  return result;
}