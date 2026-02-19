package com.todo.websocket;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Tag(name = "WebSocket", description = "Endpoint de sincronização em tempo real")
public class SyncController {

    private final SyncEventPublisher publisher;

    @MessageMapping("/sync/ping")
    public void ping(Principal principal, @Payload Map<String, Object> message) {
        if (principal != null) {
            publisher.publishToUser(principal.getName(), "PONG",
                    Map.of("timestamp", System.currentTimeMillis()));
        }
    }
}
