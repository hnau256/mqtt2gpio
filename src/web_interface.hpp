#ifndef web_interface_hpp
#define web_interface_hpp

#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include "cycles_repository.hpp"

#define REST_API_JSON_MAX_SIZE 128

class WebInterface {
 private:
  ESP8266WebServer server;
  CyclesRepository cyclesRepository;
  bool initialized;
  void init_if_need();
  void handleRoot();
  void handleNotFound();
  void handleCycleList();
  void handleCycleInsert();
  void handleCycleRemove();
  void handleCycleGet();

  void sendError(int code, const char* message);
  void sendRequestError();
  void sendServerError();
  void sendJson(String& content);
  void sendEmptyJson();
  bool readJson(JsonDocument& result);
  const char* readName(const JsonDocument& request);

 public:
  WebInterface();
  void tic();
};

#endif  // web_interface_hpp