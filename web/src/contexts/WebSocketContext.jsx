import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { useTaskContext } from "./TaskContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const { handleWsEvent } = useTaskContext();
  const clientRef = useRef(null);

  const connect = useCallback(() => {
    if (!token || clientRef.current?.active) return;

    const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket conectado");
        client.subscribe("/user/queue/events", (msg) => {
          try {
            const event = JSON.parse(msg.body);
            handleWsEvent(event);
          } catch (e) {
            console.error("Erro ao processar evento WS:", e);
          }
        });
        client.subscribe("/topic/sync", (msg) => {
          try {
            const event = JSON.parse(msg.body);
            handleWsEvent(event);
          } catch (e) {
            console.error("Erro ao processar evento WS:", e);
          }
        });
      },
      onDisconnect: () => console.log("WebSocket desconectado"),
      onStompError: (frame) => console.error("STOMP erro:", frame),
    });

    client.activate();
    clientRef.current = client;
  }, [token, handleWsEvent]);

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isAuthenticated, connect, disconnect]);

  const publish = useCallback((destination, body) => {
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination,
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ publish, connected: !!clientRef.current?.active }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
