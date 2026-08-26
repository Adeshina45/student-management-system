package com.shina.studentmanagementsystem;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminController(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;

    }


    // =====================================================
    // GET CURRENT ADMIN PROFILE
    // =====================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        // -------------------------------------------------
        // CHECK AUTHENTICATION
        // -------------------------------------------------

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "You are not authenticated."
                            )
                    );
        }


        // -------------------------------------------------
        // GET LOGGED-IN USERNAME
        // -------------------------------------------------

        String username =
                authentication.getName();


        // -------------------------------------------------
        // FIND ADMIN
        // -------------------------------------------------

        Admin admin =
                adminRepository
                        .findByUsername(username)
                        .orElse(null);


        if (admin == null) {

            return ResponseEntity
                    .notFound()
                    .build();

        }


        // -------------------------------------------------
        // RETURN PROFILE
        // -------------------------------------------------

        Map<String, Object> profile =
                new LinkedHashMap<>();

        profile.put(
                "id",
                admin.getId()
        );

        profile.put(
                "username",
                admin.getUsername()
        );

        profile.put(
                "email",
                admin.getEmail() == null
                        ? ""
                        : admin.getEmail()
        );

        profile.put(
                "phone",
                admin.getPhone() == null
                        ? ""
                        : admin.getPhone()
        );


        return ResponseEntity.ok(profile);
    }


    // =====================================================
    // UPDATE ADMIN PROFILE
    // =====================================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {

        // -------------------------------------------------
        // CHECK AUTHENTICATION
        // -------------------------------------------------

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "You are not authenticated."
                            )
                    );
        }


        // -------------------------------------------------
        // CURRENT USERNAME
        // -------------------------------------------------

        String currentUsername =
                authentication.getName();


        // -------------------------------------------------
        // FIND ADMIN
        // -------------------------------------------------

        Admin admin =
                adminRepository
                        .findByUsername(currentUsername)
                        .orElse(null);


        if (admin == null) {

            return ResponseEntity
                    .notFound()
                    .build();

        }


        // -------------------------------------------------
        // GET NEW VALUES
        // -------------------------------------------------

        String username =
                request.get("username");

        String email =
                request.get("email");

        String phone =
                request.get("phone");


        // -------------------------------------------------
        // VALIDATE USERNAME
        // -------------------------------------------------

        if (username == null
                || username.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username cannot be empty."
                            )
                    );
        }


        username =
                username.trim();


        // -------------------------------------------------
        // CHECK DUPLICATE USERNAME
        // -------------------------------------------------

        if (!username.equals(currentUsername)
                && adminRepository
                .findByUsername(username)
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username is already in use."
                            )
                    );
        }


        // -------------------------------------------------
        // UPDATE USERNAME
        // -------------------------------------------------

        admin.setUsername(username);


        // -------------------------------------------------
        // UPDATE EMAIL
        // -------------------------------------------------

        if (email != null) {

            admin.setEmail(
                    email.trim()
            );

        } else {

            admin.setEmail(null);

        }


        // -------------------------------------------------
        // UPDATE PHONE
        // -------------------------------------------------

        if (phone != null) {

            admin.setPhone(
                    phone.trim()
            );

        } else {

            admin.setPhone(null);

        }


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        adminRepository.save(admin);


        // -------------------------------------------------
        // RETURN UPDATED PROFILE
        // -------------------------------------------------

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Profile updated successfully."
        );

        response.put(
                "username",
                admin.getUsername()
        );

        response.put(
                "email",
                admin.getEmail() == null
                        ? ""
                        : admin.getEmail()
        );

        response.put(
                "phone",
                admin.getPhone() == null
                        ? ""
                        : admin.getPhone()
        );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {

        // -------------------------------------------------
        // CHECK AUTHENTICATION
        // -------------------------------------------------

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "You are not authenticated."
                            )
                    );
        }


        // -------------------------------------------------
        // GET PASSWORD VALUES
        // -------------------------------------------------

        String currentPassword =
                request.get("currentPassword");

        String newPassword =
                request.get("newPassword");


        // -------------------------------------------------
        // VALIDATE PASSWORD FIELDS
        // -------------------------------------------------

        if (currentPassword == null
                || newPassword == null
                || currentPassword.isBlank()
                || newPassword.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Please fill in all password fields."
                            )
                    );
        }


        // -------------------------------------------------
        // PASSWORD LENGTH
        // -------------------------------------------------

        if (newPassword.length() < 6) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password must be at least 6 characters."
                            )
                    );
        }


        // -------------------------------------------------
        // GET CURRENT ADMIN
        // -------------------------------------------------

        String username =
                authentication.getName();


        Admin admin =
                adminRepository
                        .findByUsername(username)
                        .orElse(null);


        if (admin == null) {

            return ResponseEntity
                    .notFound()
                    .build();

        }


        // -------------------------------------------------
        // CHECK CURRENT PASSWORD
        // -------------------------------------------------

        if (!passwordEncoder.matches(
                currentPassword,
                admin.getPassword()
        )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Current password is incorrect."
                            )
                    );
        }


        // -------------------------------------------------
        // ENCODE NEW PASSWORD
        // -------------------------------------------------

        String encodedPassword =
                passwordEncoder.encode(
                        newPassword
                );


        admin.setPassword(
                encodedPassword
        );


        // -------------------------------------------------
        // SAVE NEW PASSWORD
        // -------------------------------------------------

        adminRepository.save(admin);


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully."
                )
        );
    }

}