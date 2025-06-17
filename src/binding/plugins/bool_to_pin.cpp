#include "bool_to_pin.hpp"

#include "bool_constants.hpp"
#include <esp_log.h>

static const char *TAG = "BoolToPin";

BoolToPin::BoolToPin(PubSubClient &client, uint8_t pin, String topic)
    : client(client), pin(pin), topic(topic) {
  pinMode(pin, OUTPUT);
}

void BoolToPin::onConnected() {
  ESP_LOGD(TAG, "Subscribing to topic: %s", topic);
  bool subscribed = client.subscribe(topic.c_str());
  if (subscribed) {
    ESP_LOGI(TAG, "Subscribed to topic: %s", topic);
  } else {
    ESP_LOGW(TAG, "Error while subscribing to topic: %s", topic);
  }
}

void BoolToPin::onMessage(String topic, String message) {
  if (topic != this->topic) {
    return;
  }
  String levelLog;
  uint8_t level;
  if (message == BoolConstants::TRUE) {
    levelLog = "HIGH";
    level = HIGH;
  } else if (message == BoolConstants::FALSE) {
    levelLog = "LOW";
    level = LOW;
  } else {
    ESP_LOGW(
        TAG,
        "Received message '%s' from topic '%s', but expected only '%s' or '%s'",
        message, topic, BoolConstants::TRUE, BoolConstants::FALSE);
    return;
  }
  ESP_LOGI(TAG, "Received message '%s' from topic '%s', switching pin %d to %s",
           message, topic, pin, levelLog);
  digitalWrite(pin, level);
}