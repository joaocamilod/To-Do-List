package com.todo.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class SyncEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishToUser(String userEmail, String eventType, Object payload) {
        try {
            Map<String, Object> event = Map.of(
                    "type", eventType,
                    "payload", payload
            );
            messagingTemplate.convertAndSendToUser(userEmail, "/queue/events", event);
        } catch (Exception e) {
            log.warn("Falha ao publicar evento WebSocket para {}: {}", userEmail, e.getMessage());
        }
    }

    public void publishToTopic(String topic, String eventType, Object payload) {
        try {
            Map<String, Object> event = Map.of(
                    "type", eventType,
                    "payload", payload
            );
            messagingTemplate.convertAndSend("/topic/" + topic, event);
        } catch (Exception e) {
            log.warn("Falha ao publicar evento no tópico {}: {}", topic, e.getMessage());
        }
    }
}
