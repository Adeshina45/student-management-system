package com.shina.studentmanagementsystem;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =====================================================
    // CREATE STUDENT
    // =====================================================

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }


    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }


    // =====================================================
    // GET STUDENT BY ID
    // =====================================================

    public Student getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Student not found")
                );
    }


    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    public Student updateStudent(Long id, Student student) {

        Student existingStudent =
                getStudentById(id);


        // =================================================
        // BASIC INFORMATION
        // =================================================

        existingStudent.setFirstName(
                student.getFirstName()
        );

        existingStudent.setLastName(
                student.getLastName()
        );

        existingStudent.setEmail(
                student.getEmail()
        );

        existingStudent.setPhoneNumber(
                student.getPhoneNumber()
        );

        existingStudent.setRegistrationNumber(
                student.getRegistrationNumber()
        );


        // =================================================
        // ACADEMIC INFORMATION
        // =================================================

        existingStudent.setFaculty(
                student.getFaculty()
        );

        existingStudent.setDepartment(
                student.getDepartment()
        );

        existingStudent.setLevel(
                student.getLevel()
        );

        existingStudent.setSession(
                student.getSession()
        );


        // =================================================
        // PERSONAL INFORMATION
        // =================================================

        existingStudent.setGender(
                student.getGender()
        );

        existingStudent.setDateOfBirth(
                student.getDateOfBirth()
        );

        existingStudent.setAddress(
                student.getAddress()
        );


        // =================================================
        // GUARDIAN INFORMATION
        // =================================================

        existingStudent.setGuardianName(
                student.getGuardianName()
        );

        existingStudent.setGuardianPhone(
                student.getGuardianPhone()
        );


        // =================================================
        // STATUS
        // =================================================

        if (student.getStatus() != null
                && !student.getStatus().isBlank()) {

            existingStudent.setStatus(
                    student.getStatus()
            );

        }


        // =================================================
        // SAVE UPDATED STUDENT
        // =================================================

        return studentRepository.save(
                existingStudent
        );
    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    public void deleteStudent(Long id) {

        studentRepository.deleteById(id);

    }

}