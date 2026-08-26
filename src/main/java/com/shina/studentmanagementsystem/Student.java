 package com.shina.studentmanagementsystem;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

import java.time.LocalDateTime;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // FIRST NAME
    // =====================================================

    @NotBlank(message = "First name is required")
    private String firstName;


    // =====================================================
    // LAST NAME
    // =====================================================

    @NotBlank(message = "Last name is required")
    private String lastName;


    // =====================================================
    // EMAIL
    // =====================================================

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;


    // =====================================================
    // PHONE NUMBER
    // =====================================================

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10,15}$",
            message = "Phone number must contain 10 to 15 digits"
    )
    private String phoneNumber;


    // =====================================================
    // REGISTRATION NUMBER
    // =====================================================

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;


    // =====================================================
    // FACULTY
    // =====================================================

    private String faculty;


    // =====================================================
    // DEPARTMENT
    // =====================================================

    private String department;


    // =====================================================
    // LEVEL
    // =====================================================

    private String level;


    // =====================================================
    // GENDER
    // =====================================================

    private String gender;


    // =====================================================
    // DATE OF BIRTH
    // =====================================================

    private LocalDate dateOfBirth;


    // =====================================================
    // ADDRESS
    // =====================================================

    private String address;


    // =====================================================
    // GUARDIAN / PARENT NAME
    // =====================================================

    private String guardianName;


    // =====================================================
    // GUARDIAN / PARENT PHONE
    // =====================================================

    private String guardianPhone;


    // =====================================================
    // ACADEMIC SESSION
    // =====================================================

    private String session;


    // =====================================================
    // REGISTRATION DATE
    // =====================================================

    private LocalDateTime registrationDate;


    // =====================================================
    // STUDENT STATUS
    // =====================================================

    private String status;


    // =====================================================
    // EMPTY CONSTRUCTOR
    // =====================================================

    public Student() {
    }


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Student(
            Long id,
            String firstName,
            String lastName,
            String email,
            String phoneNumber,
            String registrationNumber
    ) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.registrationNumber = registrationNumber;
    }


    // =====================================================
    // AUTOMATIC VALUES WHEN STUDENT IS CREATED
    // =====================================================

    @PrePersist
    protected void onCreate() {

        if (registrationDate == null) {

            registrationDate = LocalDateTime.now();

        }

        if (status == null || status.isBlank()) {

            status = "ACTIVE";

        }

    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }


    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }


    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }


    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }


    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }


    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }


    public String getSession() {
        return session;
    }

    public void setSession(String session) {
        this.session = session;
    }


    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }


    // =====================================================
    // STATUS
    // =====================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}

