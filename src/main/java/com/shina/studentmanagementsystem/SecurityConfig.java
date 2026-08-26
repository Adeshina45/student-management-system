package com.shina.studentmanagementsystem;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // DATABASE USER DETAILS SERVICE
    // =====================================================

    @Bean
    public UserDetailsService userDetailsService(
            AdminRepository adminRepository
    ) {

        return username -> {

            Admin admin = adminRepository
                    .findByUsername(username)
                    .orElseThrow(
                            () -> new UsernameNotFoundException(
                                    "Admin not found: " + username
                            )
                    );


            return org.springframework.security.core.userdetails.User
                    .withUsername(admin.getUsername())
                    .password(admin.getPassword())
                    .roles("ADMIN")
                    .build();
        };
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http


                // =================================================
                // CSRF
                // =================================================

                /*
                 * CSRF is disabled because this project currently
                 * uses simple HTML forms and JavaScript fetch()
                 * requests.
                 */

                .csrf(csrf -> csrf.disable())


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth


                        // -------------------------------------------------
                        // LOGIN PAGE
                        // -------------------------------------------------

                        .requestMatchers(
                                "/login.html",
                                "/login.css",
                                "/login.js",
                                "/favicon.ico"
                        ).permitAll()


                        // -------------------------------------------------
                        // LOGIN PROCESSING
                        // -------------------------------------------------

                        .requestMatchers(
                                "/login"
                        ).permitAll()


                        // -------------------------------------------------
                        // STATIC FILES
                        // -------------------------------------------------

                        .requestMatchers(
                                "/style.css",
                                "/students.css",
                                "/students.js",
                                "/admin.js"
                        ).authenticated()


                        // -------------------------------------------------
                        // EVERYTHING ELSE
                        // -------------------------------------------------

                        .anyRequest().authenticated()
                )


                // =================================================
                // FORM LOGIN
                // =================================================

                .formLogin(form -> form


                        // Login page
                        .loginPage("/login.html")


                        // Login form submits here
                        .loginProcessingUrl("/login")


                        // After successful login
                        .defaultSuccessUrl(
                                "/students.html",
                                true
                        )


                        // If login fails
                        .failureUrl(
                                "/login.html?error=true"
                        )


                        // Allow login-related requests
                        .permitAll()
                )


                // =================================================
                // LOGOUT
                // =================================================

                .logout(logout -> logout


                        // Logout URL
                        .logoutUrl("/logout")


                        // Where user goes after logout
                        .logoutSuccessUrl(
                                "/login.html?logout=true"
                        )


                        // Clear authentication
                        .clearAuthentication(true)


                        // Invalidate session
                        .invalidateHttpSession(true)


                        // Allow logout
                        .permitAll()
                );


        // =====================================================
        // BUILD SECURITY CONFIGURATION
        // =====================================================

        return http.build();
    }
}