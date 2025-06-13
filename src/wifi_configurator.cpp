#include "wifi_configurator.hpp"
#include "Arduino.h"
#include <WiFiManager.h>  

WifiConfigurator::WifiConfigurator(): connected(false) {}

void WifiConfigurator::connect() {
    WiFiManager wifi_manager;
  connected = wifi_manager.autoConnect("TermoCycleAP");
  if (connected) {
    Serial.print("Successfully connected to WiFi. IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Filed to connect to WiFi");
  }
}

bool WifiConfigurator::isConnected() {
    return connected;
}
