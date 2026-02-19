package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.AuthResponse;
import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.repository.UserRepository;
import com.todo.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@ActiveProfiles("test")
@DisplayName("AuthController - Testes de Integração")
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean AuthService authService;
    @MockBean UserRepository userRepository;
    @MockBean com.todo.security.JwtTokenProvider tokenProvider;
    @MockBean com.todo.security.UserDetailsServiceImpl userDetailsService;

    @Test
    @DisplayName("POST /api/auth/register deve retornar 201 com token")
    void shouldRegister() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Teste");
        req.setEmail("teste@test.com");
        req.setPassword("senha123");

        AuthResponse response = AuthResponse.builder()
                .token("jwt-token")
                .type("Bearer")
                .user(AuthResponse.UserDto.builder().id(1L).name("Teste").email("teste@test.com").build())
                .build();

        when(authService.register(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("teste@test.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login com credenciais inválidas deve retornar 401")
    void shouldReturnUnauthorizedOnBadLogin() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("wrong@test.com");
        req.setPassword("errada");

        when(authService.login(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/register com email inválido deve retornar 400")
    void shouldReturn400OnInvalidEmail() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test");
        req.setEmail("invalid-email");
        req.setPassword("senha123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
