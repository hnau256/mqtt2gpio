#include "mqtt_connector.hpp"

#include "esp_log.h"

static const char* TAG = "MqttConnector";

MqttConnector::MqttConnector(PubSubClient &pubSubClient,
                             std::function<void()> onConnected)
    : pubSubClient(pubSubClient), lastConnection(0), onConnected(onConnected) {}

void MqttConnector::setup(const Settings &settings) {
  this->settings = settings;
  pubSubClient.setServer(settings.mqtt.address.c_str(), settings.mqtt.port);
}

void MqttConnector::loop() {
  if (!this->pubSubClient.connected()) {
    this->handleDisconnected();
  }
}

void MqttConnector::handleDisconnected() {
  if (this->lastConnection != 0) {
    uint64_t delta = millis() - this->lastConnection;
    if (delta < 5000) { //TODO settings
      return;
    }
  }

  ESP_LOGD(TAG, "Connecting to MQTT broker on '%s'", settings.mqtt.address);
  bool connected = this->pubSubClient.connect(settings.mqtt.clientId.c_str(),
                                              settings.mqtt.user.c_str(),
                                              settings.mqtt.password.c_str());
  this->lastConnection = millis();
  if (connected) {
    ESP_LOGI(TAG, "Connected");
    this->onConnected();
  } else {
    ESP_LOGE(TAG, "Not connected");
  }
}