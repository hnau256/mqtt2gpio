#include "web_server.hpp"

#include <Arduino.h>
#include "generated/index_html.hpp" 
#include "not_found_html.hpp"
#include "settings_repository.hpp"

WebServerHandler::WebServerHandler(
  SettingsRepository& settingsRepository
) : server(80), settingsRepository(settingsRepository) {}

void WebServerHandler::setup() {
  server.on("/", std::bind(&WebServerHandler::handleRoot, this));
  server.on("/get_settings", HTTP_GET, std::bind(&WebServerHandler::handleGetSettings, this));
  server.on("/set_settings_and_restart", HTTP_POST, std::bind(&WebServerHandler::handleSetSettingsAndRestart, this));
  server.onNotFound(std::bind(&WebServerHandler::handleNotFound, this));
  server.begin();
  Serial.println("HTTP server started");
}

void WebServerHandler::loop() {
  server.handleClient();
}

void WebServerHandler::handleRoot() {
  server.send_P(200, "text/html", index_html);
}

void WebServerHandler::handleNotFound() {
  server.send_P(404, "text/html", not_found_html);
}

void WebServerHandler::handleGetSettings() {
  server.send(200, "application/json", settingsRepository.getSettings().toJson());
}

void WebServerHandler::handleSetSettingsAndRestart() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"No body provided\"}");
    return;
  }

  String body = server.arg("plain");
  Settings settings;
  bool parseResult = settings.fromJson(body);
  if (!parseResult) {
    Serial.println("Unable parse settings from: " + body);
    server.send(500, "application/json", "{\"error\":\"Unable parse settings\"}");
    return;
  }

  if (!settingsRepository.updateSettings(settings)) {
    server.send(500, "application/json", "{\"error\":\"Failed to save settings\"}");
    return;
  }

  server.send(200, "application/json", "{\"status\":\"Settings saved, restarting\"}");
  delay(1000);
  ESP.restart();
}