package com.todo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        System.out.println(enc.encode("demo123"));
        System.out.println(enc.matches("demo123", "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"));
    }
}
