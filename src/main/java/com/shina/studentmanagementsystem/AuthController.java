package com.shina.studentmanagementsystem;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // =====================================================
    // AUTH CONTROLLER
    // =====================================================
    //
    // NOTE:
    // The actual login is handled by Spring Security
    // through POST /login.
    //
    // This controller is kept for authentication-related
    // API functionality and future expansion.
    // =====================================================


    // =====================================================
    // AUTHENTICATION STATUS
    // =====================================================

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {

        Map<String, String> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Authentication system is active."
        );

        return ResponseEntity.ok(response);
    }

}