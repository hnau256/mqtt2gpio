#include "pin_to_bool.hpp"

#include "bool_constants.hpp"
#include <esp_log.h>

static const char *TAG = "PinToBool";

PinToBool::PinToBool(PubSubClient &client, uint8_t pin, String topic)
    : client(client), pin(pin), topic(topic) {
  pinMode(pin, INPUT_PULLDOWN);
}

void PinToBool::loop() {
  uint8_t currentPinState = digitalRead(pin);
  if (currentPinState != lastPinState) {
    sendPinState(currentPinState);
  }
}

void PinToBool::onConnected() {
  sendPinState(digitalRead(pin));
}

void PinToBool::sendPinState(uint8_t currentPinState) {
  lastPinState = currentPinState;

  String levelLog;
  const char* payload;
  if (currentPinState == HIGH) {
    levelLog = "HIGH";
    payload = BoolConstants::TRUE;
  } else  {
    levelLog = "LOW";
    payload = BoolConstants::FALSE;
  }

  ESP_LOGI(TAG, "Pin #%d state is %s => sending '%s' to topic '%s'", pin, levelLog, payload, topic);

  bool published = client.publish(topic.c_str(), payload, true);
  if (published) {
   ESP_LOGD(TAG, "Published '%s' to topic '%s'", payload, topic);
  } else {
   ESP_LOGE(TAG, "Error while publishing '%s' to topic '%s'", payload, topic);
  }
}