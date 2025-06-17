#include "mqtt_binder.hpp"

#include <esp_log.h>

#include "plugins/bool_to_pin.hpp"
#include "plugins/pin_to_bool.hpp"

static const char *TAG = "MqttBinder";

MqttBinder::MqttBinder()
    : pubSubClient(wifiClient),
      connector(pubSubClient, std::bind(&MqttBinder::onConnected, this)) {}

void MqttBinder::setup(const Settings &settings) {
  this->settings = settings;
  if (!settings.valid) {
    ESP_LOGW(TAG, "Settings are not valid so no need to config bindings");
    return;
  }
  connector.setup(settings);

  for (const Binding &binding : settings.bindings) {
    addPlugin(binding);
  }

  pubSubClient.setCallback(
      std::bind(&MqttBinder::callback, this, std::placeholders::_1,
                std::placeholders::_2, std::placeholders::_3));
}

void MqttBinder::addPlugin(const Binding &binding) {
  switch (binding.direction) {
  case MqttDirection::SUBSCRIBE:
    switch (binding.type) {
    case MqttType::BOOL:
      ESP_LOGD(TAG, "Creating BoolToPin plugin for pin %d and topic '%s'",
               binding.pin, binding.topic);
      plugins.emplace_back(std::unique_ptr<BindingPlugin>(
          new BoolToPin(pubSubClient, binding.pin, binding.topic)));
      break;
    case MqttType::FLOAT:
      // TODO
      break;
    case MqttType::TIC:
      // TODO
      break;
    }
    break;
  case MqttDirection::PUBLISH:
    switch (binding.type) {
    case MqttType::BOOL:
      ESP_LOGD(TAG, "Creating BoolToPin plugin for pin %d and topic '%s'",
               binding.pin, binding.topic);
      plugins.emplace_back(std::unique_ptr<BindingPlugin>(
          new PinToBool(pubSubClient, binding.pin, binding.topic)));
      break;
    case MqttType::FLOAT:
      // TODO
      break;
    case MqttType::TIC:
      // TODO
      break;
    }
    break;
  }
}

void MqttBinder::callback(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  String topicString = topic;

  for (const auto &plugin : plugins) {
    plugin->onMessage(topicString, message);
  }
}

void MqttBinder::loop() {

  if (!settings.valid) {
    return;
  }
  pubSubClient.loop();
  connector.loop();

  for (const auto &plugin : plugins) {
    plugin->loop();
  }
}

void MqttBinder::onConnected() {
  for (const auto &plugin : plugins) {
    plugin->onConnected();
  }
}
