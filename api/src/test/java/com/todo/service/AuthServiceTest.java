package com.todo.service;

import com.todo.dto.AuthResponse;
import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.model.User;
import com.todo.repository.UserRepository;
import com.todo.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService - Testes Unitários")
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtTokenProvider tokenProvider;
    @Mock AuthenticationManager authManager;

    @InjectMocks AuthService authService;

    @Test
    @DisplayName("Deve registrar novo usuário com sucesso")
    void shouldRegisterUser() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Novo Usuário");
        req.setEmail("novo@test.com");
        req.setPassword("senha123");

        when(userRepository.existsByEmail("novo@test.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(tokenProvider.generateToken("novo@test.com")).thenReturn("jwt-token");

        AuthResponse result = authService.register(req);

        assertThat(result.getToken()).isEqualTo("jwt-token");
        assertThat(result.getUser().getEmail()).isEqualTo("novo@test.com");
    }

    @Test
    @DisplayName("Deve lançar exceção ao registrar email duplicado")
    void shouldThrowOnDuplicateEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test");
        req.setEmail("existing@test.com");
        req.setPassword("senha123");

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    @DisplayName("Deve fazer login com credenciais válidas")
    void shouldLoginSuccessfully() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("senha123");

        User user = User.builder().id(1L).name("Test").email("test@test.com").build();

        var auth = mock(org.springframework.security.core.Authentication.class);
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(tokenProvider.generateToken(auth)).thenReturn("jwt-token");

        AuthResponse result = authService.login(req);

        assertThat(result.getToken()).isEqualTo("jwt-token");
        assertThat(result.getUser().getName()).isEqualTo("Test");
    }

    @Test
    @DisplayName("Deve lançar exceção com credenciais inválidas")
    void shouldThrowOnInvalidCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("errada");

        when(authManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }
}
