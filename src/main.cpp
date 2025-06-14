#include "not_found_html.hpp"
#include "generated/index_html.hpp"

#include <Arduino.h>
#include <WiFiManager.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "settings_repository.hpp"
#include "web_server.hpp"

SettingsRepository settingsRepository;
WebServerHandler server(settingsRepository);

void setup() {
  Serial.begin(115200);

  WiFiManager wifiManager;
  if (!wifiManager.autoConnect("ESP32-AP")) {
    Serial.println("Failed to connect and hit timeout");
    ESP.restart();
  }

  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  settingsRepository.init();
  server.init();

  const Settings& settings = settingsRepository.getSettings();
  if (MDNS.begin(settings.mdns_name.c_str())) {
    Serial.println("mDNS responder started with name: " + settings.mdns_name);
  } else {
    Serial.println("Failed to start mDNS");
  }
}

void loop() {
  server.handleClient();
}