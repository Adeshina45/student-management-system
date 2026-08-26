package com.shina.studentmanagementsystem;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }


    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {

        return ResponseEntity.ok(
                studentRepository.findAll()
        );
    }


    // =====================================================
    // DASHBOARD STATISTICS
    // =====================================================

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {

        long totalStudents =
                studentRepository.count();

        long activeStudents =
                studentRepository.countByStatus("ACTIVE");

        LocalDateTime startOfToday =
                LocalDateTime.of(
                        LocalDate.now(),
                        LocalTime.MIN
                );

        long registeredToday =
                studentRepository.countByRegistrationDateAfter(
                        startOfToday
                );

        LocalDateTime startOfMonth =
                LocalDateTime.of(
                        LocalDate.now().withDayOfMonth(1),
                        LocalTime.MIN
                );

        long registeredThisMonth =
                studentRepository.countByRegistrationDateAfter(
                        startOfMonth
                );

        Map<String, Long> statistics =
                new LinkedHashMap<>();

        statistics.put(
                "totalStudents",
                totalStudents
        );

        statistics.put(
                "activeStudents",
                activeStudents
        );

        statistics.put(
                "registeredToday",
                registeredToday
        );

        statistics.put(
                "registeredThisMonth",
                registeredThisMonth
        );

        return ResponseEntity.ok(statistics);
    }


    // =====================================================
    // GET ONE STUDENT
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(
            @PathVariable Long id
    ) {

        try {

            return studentRepository.findById(id)

                    .<ResponseEntity<?>>map(
                            student ->
                                    ResponseEntity.ok(student)
                    )

                    .orElseGet(
                            () ->
                                    ResponseEntity
                                            .notFound()
                                            .build()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            Map<String, String> error =
                    new LinkedHashMap<>();

            error.put(
                    "message",
                    "Could not load student with ID " + id
            );

            error.put(
                    "error",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Unknown error"
            );

            return ResponseEntity
                    .internalServerError()
                    .body(error);
        }
    }


    // =====================================================
    // CREATE STUDENT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createStudent(
            @Valid @RequestBody Student student
    ) {

        // =================================================
        // CHECK DUPLICATE EMAIL
        // =================================================

        if (studentRepository.existsByEmail(
                student.getEmail()
        )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A student with this email already exists."
                    );
        }


        // =================================================
        // CHECK DUPLICATE REGISTRATION NUMBER
        // =================================================

        if (studentRepository.existsByRegistrationNumber(
                student.getRegistrationNumber()
        )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A student with this registration number already exists."
                    );
        }


        // =================================================
        // SAVE STUDENT
        // =================================================

        Student savedStudent =
                studentRepository.save(student);

        return ResponseEntity.ok(savedStudent);
    }


    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student studentDetails
    ) {

        return studentRepository.findById(id)

                .map(student -> {

                    // =====================================
                    // CHECK DUPLICATE EMAIL
                    // =====================================

                    if (studentRepository.existsByEmailAndIdNot(
                            studentDetails.getEmail(),
                            id
                    )) {

                        return ResponseEntity
                                .badRequest()
                                .body(
                                        "A student with this email already exists."
                                );
                    }


                    // =====================================
                    // CHECK DUPLICATE REGISTRATION NUMBER
                    // =====================================

                    if (
                            studentRepository
                                    .existsByRegistrationNumberAndIdNot(
                                            studentDetails
                                                    .getRegistrationNumber(),
                                            id
                                    )
                    ) {

                        return ResponseEntity
                                .badRequest()
                                .body(
                                        "A student with this registration number already exists."
                                );
                    }


                    // =====================================
                    // UPDATE FIRST NAME
                    // =====================================

                    student.setFirstName(
                            studentDetails.getFirstName()
                    );


                    // =====================================
                    // UPDATE LAST NAME
                    // =====================================

                    student.setLastName(
                            studentDetails.getLastName()
                    );


                    // =====================================
                    // UPDATE EMAIL
                    // =====================================

                    student.setEmail(
                            studentDetails.getEmail()
                    );


                    // =====================================
                    // UPDATE PHONE NUMBER
                    // =====================================

                    student.setPhoneNumber(
                            studentDetails.getPhoneNumber()
                    );


                    // =====================================
                    // UPDATE REGISTRATION NUMBER
                    // =====================================

                    student.setRegistrationNumber(
                            studentDetails
                                    .getRegistrationNumber()
                    );


                    // =====================================
                    // UPDATE FACULTY
                    // =====================================

                    student.setFaculty(
                            studentDetails.getFaculty()
                    );


                    // =====================================
                    // UPDATE DEPARTMENT
                    // =====================================

                    student.setDepartment(
                            studentDetails.getDepartment()
                    );


                    // =====================================
                    // UPDATE LEVEL
                    // =====================================

                    student.setLevel(
                            studentDetails.getLevel()
                    );


                    // =====================================
                    // UPDATE GENDER
                    // =====================================

                    student.setGender(
                            studentDetails.getGender()
                    );


                    // =====================================
                    // UPDATE DATE OF BIRTH
                    // =====================================

                    student.setDateOfBirth(
                            studentDetails.getDateOfBirth()
                    );


                    // =====================================
                    // UPDATE ADDRESS
                    // =====================================

                    student.setAddress(
                            studentDetails.getAddress()
                    );


                    // =====================================
                    // UPDATE GUARDIAN NAME
                    // =====================================

                    student.setGuardianName(
                            studentDetails.getGuardianName()
                    );


                    // =====================================
                    // UPDATE GUARDIAN PHONE
                    // =====================================

                    student.setGuardianPhone(
                            studentDetails.getGuardianPhone()
                    );


                    // =====================================
                    // UPDATE ACADEMIC SESSION
                    // =====================================

                    student.setSession(
                            studentDetails.getSession()
                    );


                    // =====================================
                    // UPDATE STATUS
                    // =====================================

                    student.setStatus(
                            studentDetails.getStatus()
                    );


                    // =====================================
                    // SAVE UPDATED STUDENT
                    // =====================================

                    Student updatedStudent =
                            studentRepository.save(student);


                    return ResponseEntity.ok(
                            updatedStudent
                    );

                })

                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id
    ) {

        if (!studentRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        studentRepository.deleteById(id);


        return ResponseEntity.ok(
                "Student deleted successfully"
        );
    }

}