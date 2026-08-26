 package com.shina.studentmanagementsystem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // =====================================================
    // CHECK FOR DUPLICATE EMAIL
    // =====================================================

    boolean existsByEmail(String email);


    // =====================================================
    // CHECK FOR DUPLICATE REGISTRATION NUMBER
    // =====================================================

    boolean existsByRegistrationNumber(String registrationNumber);


    // =====================================================
    // CHECK FOR DUPLICATE EMAIL WHEN UPDATING
    // =====================================================

    boolean existsByEmailAndIdNot(
            String email,
            Long id
    );


    // =====================================================
    // CHECK FOR DUPLICATE REGISTRATION NUMBER WHEN UPDATING
    // =====================================================

    boolean existsByRegistrationNumberAndIdNot(
            String registrationNumber,
            Long id
    );


    // =====================================================
    // COUNT ACTIVE STUDENTS
    // =====================================================

    long countByStatus(String status);


    // =====================================================
    // COUNT STUDENTS REGISTERED AFTER A DATE
    // =====================================================

    long countByRegistrationDateAfter(
            LocalDateTime date
    );

}

