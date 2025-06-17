#include "mqtt_binder.hpp"

#include "esp_log.h"

static const char *TAG = "MqttBinder";

MqttBinder::MqttBinder()  : pubSubClient(wifiClient), lastConnection(0) {}

void MqttBinder::setup(
  const Settings& settings
) {
  this->settings = settings;
  if (!settings.valid) {
    ESP_LOGW(TAG, "Settings are not valid so no need to config bindings");
    return;
  }
  pubSubClient.setServer(settings.mqtt.address.c_str(), settings.mqtt.port);
  pubSubClient.setCallback(
      std::bind(&MqttBinder::callback, this, std::placeholders::_1,
                std::placeholders::_2, std::placeholders::_3));
}

void MqttBinder::callback(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  String topicString = topic;

  Serial.println("MQTT. Received from topic '" + topicString + "' message: '" + message + "'");
  for (const Binding &binding : settings.bindings) {
    if (binding.direction == MqttDirection::SUBSCRIBE &&
        binding.topic == topicString) {
      uint8_t level = (message == "true") ? HIGH : LOW;
      digitalWrite(binding.pin, level);
    }
  }
}

void MqttBinder::loop() {
  if (!settings.valid) {
    return;
  }
  if (!this->pubSubClient.connected()) {
    this->handleDisconnected();
  }
  this->pubSubClient.loop();
}

void MqttBinder::handleDisconnected() {
  if (this->lastConnection != 0) {
    uint64_t delta = millis() - this->lastConnection;
    if (delta < 5000) {
      return;
    }
  }

  bool connected = this->pubSubClient.connect(settings.mqtt.clientId.c_str(),
                                              settings.mqtt.user.c_str(),
                                              settings.mqtt.password.c_str());
  this->lastConnection = millis();
  if (connected) {
    Serial.println("MQTT. Connected");
    this->bind();
  } else {
    Serial.println("MQTT. Not connected");
  }
}

void MqttBinder::bind() {
  for (const Binding &binding : settings.bindings) {
    if (binding.direction == MqttDirection::SUBSCRIBE) {
      Serial.println("MQTT. Subscribing to: '" + binding.topic + "' for pin: " + binding.pin);
      pubSubClient.subscribe(binding.topic.c_str());
      pinMode(binding.pin, OUTPUT);
    }
  }
  Serial.println("MQTT. Subscribed for all expected topics");
}
