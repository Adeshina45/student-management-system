 package com.shina.studentmanagementsystem;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    private String email;

    private String phone;


    // ==========================================
    // EMPTY CONSTRUCTOR
    // ==========================================

    public Admin() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Admin(
            String username,
            String password
    ) {

        this.username = username;
        this.password = password;

    }


    // ==========================================
    // GET USERNAME
    // ==========================================

    public String getUsername() {

        return username;

    }


    // ==========================================
    // SET USERNAME
    // ==========================================

    public void setUsername(String username) {

        this.username = username;

    }


    // ==========================================
    // GET PASSWORD
    // ==========================================

    public String getPassword() {

        return password;

    }


    // ==========================================
    // SET PASSWORD
    // ==========================================

    public void setPassword(String password) {

        this.password = password;

    }


    // ==========================================
    // GET EMAIL
    // ==========================================

    public String getEmail() {

        return email;

    }


    // ==========================================
    // SET EMAIL
    // ==========================================

    public void setEmail(String email) {

        this.email = email;

    }


    // ==========================================
    // GET PHONE
    // ==========================================

    public String getPhone() {

        return phone;

    }


    // ==========================================
    // SET PHONE
    // ==========================================

    public void setPhone(String phone) {

        this.phone = phone;

    }


    // ==========================================
    // GET ID
    // ==========================================

    public Long getId() {

        return id;

    }


    // ==========================================
    // SET ID
    // ==========================================

    public void setId(Long id) {

        this.id = id;

    }

}
