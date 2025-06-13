#include "Arduino.h"
#include "wifi_configurator.hpp"
#include "web_interface.hpp"

WifiConfigurator wifiConfigurator;
WebInterface webInterface;

void setup() {
  Serial.begin(115200);
  wifiConfigurator.connect();
}

void loop() {
  if (!wifiConfigurator.isConnected()) {
    return;
  }
  webInterface.tic();
}