// Websocket Initialization
import { io } from "socket.io-client";
import { usePropertyStore } from "@/stores/properties";
import { propertyManagementUrl, useAppStore } from "@/stores/app";

export function initWs() {
  const path = propertyManagementUrl.split("/").at(3);
  console.debug("WS Path: ", path);
  const socket = io(propertyManagementUrl.replace(path, ""), {
    path: (path ? "/" + path : "") + "/socket.io/",
  });

  socket.on("connect", function () {
    console.info("WS Connected");
    useAppStore().updateWsConnection(socket);
  });
  socket.on("disconnect", function () {
    console.info("WS Disconnected");
    useAppStore().updateWsConnection(socket);
  });
  socket.on("pong", function () {
    setTimeout(() => {
      socket.emit("ping");
    }, 10000);
  });
  socket.on("parking-properties", function (data) {
    if (data && data.length > 0) usePropertyStore().setProperties(data);
  });
}
