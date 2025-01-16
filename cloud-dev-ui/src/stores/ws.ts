// Websocket Initialization
import { io } from "socket.io-client";
import { usePropertyStore } from "@/stores/properties";
import { useAppStore } from "@/stores/app";

export function initWs(authToken: string, tenantId: string) {
  console.debug("Initializing WS");
  const propertyManagementUrl = useAppStore().api.propertyManagement;
  const path = propertyManagementUrl.split("/").at(3);
  console.debug("WS Path: ", path);
  const extraHeaders = {
    authorization: authToken,
  };
  if (tenantId !== (import.meta.env.PROD ? "free-tier" : "free"))
    Object.assign(extraHeaders, { "tenant-id": tenantId });
  const socket = io(propertyManagementUrl.replace(path, ""), {
    path: (path ? "/" + path : "") + "/socket.io/",
    extraHeaders: extraHeaders,
    reconnectionAttempts: 5,
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
