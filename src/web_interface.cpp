#include "web_interface.hpp"

#include "Arduino.h"
#include "generated/index_html.hpp"
#include "not_found_html.hpp"

WebInterface::WebInterface() : initialized(false) {}

void WebInterface::init_if_need() {
  if (initialized) {
    return;
  }
  server.on("/cycle/list", std::bind(&WebInterface::handleCycleList, this));
  server.on("/cycle/insert", std::bind(&WebInterface::handleCycleInsert, this));
  server.on("/cycle/remove", std::bind(&WebInterface::handleCycleRemove, this));
  server.on("/cycle/get", std::bind(&WebInterface::handleCycleGet, this));
  server.on("/", std::bind(&WebInterface::handleRoot, this));
  server.onNotFound(std::bind(&WebInterface::handleNotFound, this));
  server.begin();
  initialized = true;
}

void WebInterface::handleRoot() {
  server.send_P(200, "text/html", index_html);
}

void WebInterface::handleNotFound() {
  server.send_P(200, "text/html", not_found_html);
}

void WebInterface::handleCycleList() {
  String response = "[";
  bool firstItem = true;
  bool cyclesWasRead =
      cyclesRepository.listCycles([&](const String& cycleName) {
        if (firstItem) {
          firstItem = false;
        } else {
          response += ",";
        }
        response += "\"" + cycleName + "\"";
      });
  if (!cyclesWasRead) {
    sendServerError();
    return;
  }
  response += "]";
  sendJson(response);
}

#define CYCLE_INSERT_FIELD_CYCLE "cycle"

void WebInterface::handleCycleInsert() {
  JsonDocument request;
  bool jsonWasRead = readJson(request);
  if (!jsonWasRead) {
    return;
  }

  const char* name = readName(request);
  if (!name) {
    return;
  }

  if (!request.containsKey(CYCLE_INSERT_FIELD_CYCLE)) {
    Serial.print("Request json has no \"");
    Serial.print(CYCLE_INSERT_FIELD_CYCLE);
    Serial.println("\" field");
    sendRequestError();
    return;
  }
  JsonArray cycleJson = request[CYCLE_INSERT_FIELD_CYCLE];
  Cycle cycle;
  bool cycleWasFilled = cycle.fill(cycleJson);
  if (!cycleWasFilled) {
    sendRequestError();
    return;
  }

  bool cycleWasInserted = cyclesRepository.insert(name, cycle);
  if (!cycleWasInserted) {
    sendServerError();
    return;
  }
  sendEmptyJson();
}

void WebInterface::handleCycleRemove() {
  JsonDocument request;
  bool jsonWasRead = readJson(request);
  if (!jsonWasRead) {
    return;
  }

  const char* name = readName(request);
  if (!name) {
    return;
  }
  bool cycleWasReoved = cyclesRepository.remove(name);
  if (!cycleWasReoved) {
    sendServerError();
    return;
  }
  sendEmptyJson();
}

void WebInterface::handleCycleGet() {
  JsonDocument request;
  bool jsonWasRead = readJson(request);
  if (!jsonWasRead) {
    return;
  }

  const char* name = readName(request);
  if (!name) {
    return;
  }

  Cycle cycle;
  bool cycleWasRead = cyclesRepository.get(name, cycle);
  if (!cycleWasRead) {
    sendServerError();
    return;
  }
  String response = cycle.toJson();
  sendJson(response);
}

void WebInterface::sendError(int code, const char* message) {
  server.send(code, "text/plain", message);
}

void WebInterface::sendRequestError() {
  sendError(400, "RequestError");
}

void WebInterface::sendServerError() {
  sendError(500, "Internal server error");
}

void WebInterface::sendJson(String& content) {
  server.send(200, "application/json", content);
}

void WebInterface::sendEmptyJson() {
  String response = String("{}");
  sendJson(response);
}

#define HTTP_BODY_ARG_NAME "plain"

bool WebInterface::readJson(JsonDocument& result) {
  if (!server.hasArg(HTTP_BODY_ARG_NAME)) {
    Serial.print("Request has no \"");
    Serial.print(HTTP_BODY_ARG_NAME);
    Serial.println("\" field");
    sendRequestError();
    return false;
  }
  String body = server.arg(HTTP_BODY_ARG_NAME);
  DeserializationError error = deserializeJson(result, body);
  if (error) {
    Serial.print("Unable parse json from \"");
    Serial.print(body);
    Serial.print("\": ");
    Serial.println(error.c_str());
    sendRequestError();
    return false;
  }
  return true;
}

#define CYCLE_INSERT_FIELD_NAME "name"

const char* WebInterface::readName(const JsonDocument& request) {
  if (!request.containsKey(CYCLE_INSERT_FIELD_NAME)) {
    Serial.print("Request json has no \"");
    Serial.print(CYCLE_INSERT_FIELD_NAME);
    Serial.println("\" field");
    sendRequestError();
    return nullptr;
  }
  const char* result = request[CYCLE_INSERT_FIELD_NAME];
  if (!(*result) || strlen(result) < 1) {
    Serial.println("Cycle name is empty");
    sendRequestError();
    return nullptr;
  }
  return result;
}

void WebInterface::tic() {
  init_if_need();
  server.handleClient();
}
