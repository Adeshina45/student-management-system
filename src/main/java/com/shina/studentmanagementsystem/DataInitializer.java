package com.shina.studentmanagementsystem;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            // ==========================================
            // CHECK IF ADMIN ALREADY EXISTS
            // ==========================================

            if (
                    adminRepository
                            .findByUsername("admin")
                            .isEmpty()
            ) {

                // ==========================================
                // CREATE ADMIN ACCOUNT
                // ==========================================

                Admin admin = new Admin();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );

                adminRepository.save(admin);

                System.out.println(
                        "========================================"
                );

                System.out.println(
                        "ADMIN ACCOUNT CREATED SUCCESSFULLY"
                );

                System.out.println(
                        "Username: admin"
                );

                System.out.println(
                        "Password: admin123"
                );

                System.out.println(
                        "========================================"
                );

            } else {

                System.out.println(
                        "========================================"
                );

                System.out.println(
                        "ADMIN ACCOUNT ALREADY EXISTS"
                );

                System.out.println(
                        "========================================"
                );

            }

        };

    }

}