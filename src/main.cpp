#include "not_found_html.hpp"
#include "generated/index_html.hpp"

#include <Arduino.h>
#include <WiFiManager.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "settings_repository.hpp"

WebServer server(80);
SettingsRepository settingsRepo;

void handleRoot() {
  server.send_P(200, "text/html", index_html);
}

void handleNotFound() {
  server.send_P(404, "text/html", not_found_html);
}

void handleGetSettings() {
  String jsonString = settingsRepo.getSettings().toJson();
  server.send(200, "application/json", jsonString);
}

void handleSetSettingsAndRestart() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    if (!settingsRepo.saveSettings(body)) {
      server.send(500, "application/json", "{\"error\":\"Failed to save settings\"}");
      return;
    }
    server.send(200, "application/json", "{\"status\":\"Settings saved, restarting\"}");
    delay(1000);
    ESP.restart();
  } else {
    server.send(400, "application/json", "{\"error\":\"No body provided\"}");
  }
}

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

  settingsRepo.init();
  const Settings& settings = settingsRepo.getSettings();
  if (MDNS.begin(settings.mdns_name.c_str())) {
    Serial.println("mDNS responder started with name: " + settings.mdns_name);
  } else {
    Serial.println("Failed to start mDNS");
  }

  server.on("/", handleRoot);
  server.on("/get_settings", HTTP_GET, handleGetSettings);
  server.on("/set_settings_and_restart", HTTP_POST, handleSetSettingsAndRestart);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  //MDNS.update();
}