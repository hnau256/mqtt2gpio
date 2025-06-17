#include "initialize_mdns.hpp"

#include <esp_log.h>
#include <ESPmDNS.h>

static const char *TAG = "InitializeMDNS";

bool initializeMDns(const Settings &settings) {
  const char *mdnsName = settings.mdnsName.c_str();
  bool success = MDNS.begin(mdnsName);
  if (!success) {
    ESP_LOGW(TAG, "Unable to start MDNS with name: %s", mdnsName);
    return false;
  }

  ESP_LOGI(TAG, "MDNS started with name: %s", mdnsName);
  return true;
}