#ifndef WEB_SERVER_HANDLER_HPP
#define WEB_SERVER_HANDLER_HPP

#include <WebServer.h>
#include "settings_repository.hpp"

class WebServerHandler {
public:
  WebServerHandler(SettingsRepository& settingsRepository);
  void init();
  void handleClient();

private:
  WebServer server;
  SettingsRepository& settingsRepository;

  void handleRoot();
  void handleNotFound();
  void handleGetSettings();
  void handleSetSettingsAndRestart();
};

#endif // WEB_SERVER_HANDLER_HPP