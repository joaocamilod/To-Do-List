package com.todo.config;

import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DemoDataInitializer implements ApplicationRunner {

    private static final String DEMO_EMAIL    = "demo@todo.com";
    private static final String DEMO_PASSWORD = "demo123";

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        userRepository.findByEmail(DEMO_EMAIL).ifPresentOrElse(
            user -> {
                if (!passwordEncoder.matches(DEMO_PASSWORD, user.getPassword())) {
                    user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
                    userRepository.save(user);
                    log.info("Senha do usuário demo atualizada com sucesso.");
                }
            },
            () -> log.warn("Usuário demo '{}' não encontrado no banco de dados.", DEMO_EMAIL)
        );
    }
}
