#ifndef web_server_hpp
#define web_server_hpp

#include <WebServer.h>
#include "settings_repository.hpp"

class WebServerHandler {
public:
  WebServerHandler(SettingsRepository& settingsRepository);
  void setup();
  void loop();

private:
  WebServer server;
  SettingsRepository& settingsRepository;

  void handleRoot();
  void handleNotFound();
  void handleGetSettings();
  void handleSetSettingsAndRestart();
};

#endif // web_server_hpp