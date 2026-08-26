// =====================================================
// STUDENT MANAGEMENT SYSTEM
// STUDENTS DASHBOARD JAVASCRIPT
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let allStudents = [];

let currentStudent = null;


// =====================================================
// PAGINATION SETTINGS
// =====================================================

const studentsPerPage = 10;

let currentPage = 1;

let filteredStudents = [];


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Students dashboard JavaScript loaded.");

    loadStudents();

    loadDashboardStatistics();

    setupSearch();

    setupEditForm();

    setupFilters();

    setupPagination();

});


// =====================================================
// LOAD STUDENTS FROM SPRING BOOT
// =====================================================

async function loadStudents() {

    try {

        console.log("Loading students...");

        const response =
            await fetch("/students");


        if (!response.ok) {

            throw new Error(
                "Server returned status: " +
                response.status
            );

        }


        const students =
            await response.json();


        console.log(
            "Students received:",
            students
        );


        allStudents =
            Array.isArray(students)
                ? students
                : [];


        // Start from page 1
        currentPage = 1;


        // Display students
        applyAllFilters();


        // Keep local statistics as fallback
        updateStatistics(allStudents);


        // Load official backend statistics
        loadDashboardStatistics();


        // Populate department filter
        populateDepartments();


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        allStudents = [];

        filteredStudents = [];

        currentPage = 1;


        displayStudents([]);

        updatePagination();


        updateStatistics([]);

    }

}


// =====================================================
// LOAD DASHBOARD STATISTICS FROM SPRING BOOT
// =====================================================

async function loadDashboardStatistics() {

    try {

        console.log(
            "Loading dashboard statistics..."
        );


        const response =
            await fetch(
                "/students/statistics"
            );


        if (!response.ok) {

            throw new Error(
                "Statistics server returned status: " +
                response.status
            );

        }


        const statistics =
            await response.json();


        console.log(
            "Dashboard statistics received:",
            statistics
        );


        // =================================================
        // TOTAL STUDENTS
        // =================================================

        const totalStudents =
            document.getElementById(
                "totalStudents"
            );


        if (totalStudents) {

            totalStudents.textContent =
                statistics.totalStudents ?? 0;

        }


        // =================================================
        // ACTIVE STUDENTS
        // =================================================

        const activeStudents =
            document.getElementById(
                "activeStudents"
            );


        if (activeStudents) {

            activeStudents.textContent =
                statistics.activeStudents ?? 0;

        }


        // =================================================
        // REGISTERED TODAY
        // =================================================

        const registeredToday =
            document.getElementById(
                "registeredToday"
            );


        if (registeredToday) {

            registeredToday.textContent =
                statistics.registeredToday ?? 0;

        }


        // =================================================
        // REGISTERED THIS MONTH
        // =================================================

        const registeredThisMonth =
            document.getElementById(
                "registeredThisMonth"
            );


        if (registeredThisMonth) {

            registeredThisMonth.textContent =
                statistics.registeredThisMonth ?? 0;

        }


    } catch (error) {

        console.error(
            "Error loading dashboard statistics:",
            error
        );

    }

}


// =====================================================
// APPLY ALL SEARCH AND FILTERS
// =====================================================

function applyAllFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const levelFilter =
        document.getElementById(
            "levelFilter"
        );


    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    const level =
        levelFilter
            ? levelFilter.value
            : "";


    const department =
        departmentFilter
            ? departmentFilter.value
            : "";


    filteredStudents =
        allStudents.filter(
            function (student) {


                // =================================================
                // SEARCH VALUES
                // =================================================

                const name =
                    getFullName(student)
                        .toLowerCase();


                const email =
                    String(
                        student.email ?? ""
                    ).toLowerCase();


                const phone =
                    String(
                        student.phoneNumber ?? ""
                    ).toLowerCase();


                const registration =
                    String(
                        student.registrationNumber ?? ""
                    ).toLowerCase();


                const studentDepartment =
                    String(
                        student.department ?? ""
                    ).toLowerCase();


                const faculty =
                    String(
                        student.faculty ?? ""
                    ).toLowerCase();


                // =================================================
                // STATUS
                // =================================================

                const studentStatus =
                    student.status
                        ? String(
                            student.status
                        ).toUpperCase()
                        : "ACTIVE";


                // =================================================
                // LEVEL
                // =================================================

                const studentLevel =
                    String(
                        student.level ?? ""
                    );


                // =================================================
                // SEARCH MATCH
                // =================================================

                const matchesSearch =
                    !searchTerm
                    ||
                    name.includes(
                        searchTerm
                    )
                    ||
                    email.includes(
                        searchTerm
                    )
                    ||
                    phone.includes(
                        searchTerm
                    )
                    ||
                    registration.includes(
                        searchTerm
                    )
                    ||
                    studentDepartment.includes(
                        searchTerm
                    )
                    ||
                    faculty.includes(
                        searchTerm
                    );


                // =================================================
                // STATUS MATCH
                // =================================================

                const matchesStatus =
                    !status
                    ||
                    studentStatus === status;


                // =================================================
                // LEVEL MATCH
                // =================================================

                const matchesLevel =
                    !level
                    ||
                    studentLevel === level;


                // =================================================
                // DEPARTMENT MATCH
                // =================================================

                const matchesDepartment =
                    !department
                    ||
                    studentDepartment ===
                    department.toLowerCase();


                return (
                    matchesSearch
                    &&
                    matchesStatus
                    &&
                    matchesLevel
                    &&
                    matchesDepartment
                );

            }
        );


    // =================================================
    // MAKE SURE CURRENT PAGE EXISTS
    // =================================================

    const totalPages =
        Math.ceil(
            filteredStudents.length /
            studentsPerPage
        );


    if (
        totalPages > 0
        &&
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    if (totalPages === 0) {

        currentPage = 1;

    }


    // =================================================
    // DISPLAY CURRENT PAGE
    // =================================================

    displayCurrentPage();


}


// =====================================================
// DISPLAY CURRENT PAGE
// =====================================================

function displayCurrentPage() {

    const startIndex =
        (currentPage - 1) *
        studentsPerPage;


    const endIndex =
        startIndex +
        studentsPerPage;


    const studentsToDisplay =
        filteredStudents.slice(
            startIndex,
            endIndex
        );


    displayStudents(
        studentsToDisplay
    );


    updatePagination();

}


// =====================================================
// DISPLAY STUDENTS
// =====================================================

function displayStudents(students) {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!tableBody) {

        console.error(
            "studentTableBody was not found."
        );

        return;

    }


    tableBody.innerHTML = "";


    // =================================================
    // NO STUDENTS
    // =================================================

    if (
        !students
        ||
        students.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    // =================================================
    // CREATE TABLE ROWS
    // =================================================

    students.forEach(
        function (student) {

            const row =
                document.createElement(
                    "tr"
                );


            // =================================================
            // ID
            // =================================================

            const idCell =
                document.createElement(
                    "td"
                );


            idCell.textContent =
                student.id ?? "N/A";


            // =================================================
            // NAME
            // =================================================

            const nameCell =
                document.createElement(
                    "td"
                );


            const strong =
                document.createElement(
                    "strong"
                );


            strong.textContent =
                getFullName(student);


            nameCell.appendChild(
                strong
            );


            // =================================================
            // EMAIL
            // =================================================

            const emailCell =
                document.createElement(
                    "td"
                );


            emailCell.textContent =
                student.email ?? "N/A";


            // =================================================
            // PHONE
            // =================================================

            const phoneCell =
                document.createElement(
                    "td"
                );


            phoneCell.textContent =
                student.phoneNumber ?? "N/A";


            // =================================================
            // REGISTRATION NUMBER
            // =================================================

            const registrationCell =
                document.createElement(
                    "td"
                );


            registrationCell.textContent =
                student.registrationNumber ??
                "N/A";


            // =================================================
            // STATUS
            // =================================================

            const statusCell =
                document.createElement(
                    "td"
                );


            statusCell.textContent =
                formatStatus(
                    student.status
                );


            // =================================================
            // ACTIONS
            // =================================================

            const actionCell =
                document.createElement(
                    "td"
                );


            actionCell.className =
                "action-buttons";


            // =================================================
            // VIEW BUTTON
            // =================================================

            const viewButton =
                document.createElement(
                    "button"
                );


            viewButton.type =
                "button";


            viewButton.className =
                "view-button";


            viewButton.textContent =
                "View";


            viewButton.addEventListener(
                "click",
                function () {

                    viewStudent(
                        student
                    );

                }
            );


            // =================================================
            // EDIT BUTTON
            // =================================================

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.className =
                "edit-button";


            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function () {

                    openEditModal(
                        student
                    );

                }
            );


            // =================================================
            // DELETE BUTTON
            // =================================================

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteStudent(
                        student
                    );

                }
            );


            // =================================================
            // ADD BUTTONS
            // =================================================

            actionCell.appendChild(
                viewButton
            );


            actionCell.appendChild(
                editButton
            );


            actionCell.appendChild(
                deleteButton
            );


            // =================================================
            // ADD CELLS
            // =================================================

            row.appendChild(
                idCell
            );


            row.appendChild(
                nameCell
            );


            row.appendChild(
                emailCell
            );


            row.appendChild(
                phoneCell
            );


            row.appendChild(
                registrationCell
            );


            row.appendChild(
                statusCell
            );


            row.appendChild(
                actionCell
            );


            tableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// PAGINATION
// =====================================================

function setupPagination() {

    const previousButton =
        document.getElementById(
            "previousPageButton"
        );


    const nextButton =
        document.getElementById(
            "nextPageButton"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    displayCurrentPage();

                }

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        filteredStudents.length /
                        studentsPerPage
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    displayCurrentPage();

                }

            }
        );

    }

}


// =====================================================
// UPDATE PAGINATION UI
// =====================================================

function updatePagination() {

    const paginationContainer =
        document.getElementById(
            "paginationContainer"
        );


    const paginationNumbers =
        document.getElementById(
            "paginationNumbers"
        );


    const previousButton =
        document.getElementById(
            "previousPageButton"
        );


    const nextButton =
        document.getElementById(
            "nextPageButton"
        );


    const totalPages =
        Math.ceil(
            filteredStudents.length /
            studentsPerPage
        );


    // =================================================
    // HIDE PAGINATION IF NOT NEEDED
    // =================================================

    if (
        !paginationContainer
    ) {

        return;

    }


    if (totalPages <= 1) {

        paginationContainer.style.display =
            "none";

    } else {

        paginationContainer.style.display =
            "flex";

    }


    // =================================================
    // PREVIOUS BUTTON
    // =================================================

    if (previousButton) {

        previousButton.disabled =
            currentPage <= 1;

    }


    // =================================================
    // NEXT BUTTON
    // =================================================

    if (nextButton) {

        nextButton.disabled =
            currentPage >= totalPages;

    }


    // =================================================
    // PAGE NUMBERS
    // =================================================

    if (!paginationNumbers) {

        return;

    }


    paginationNumbers.innerHTML = "";


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "pagination-number";


        button.textContent =
            page;


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                currentPage =
                    page;


                displayCurrentPage();

            }
        );


        paginationNumbers.appendChild(
            button
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        console.warn(
            "Search input was not found."
        );

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            currentPage = 1;

            applyAllFilters();

        }
    );

}


// =====================================================
// FILTERS
// =====================================================

function setupFilters() {

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const levelFilter =
        document.getElementById(
            "levelFilter"
        );


    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );


    const clearFiltersButton =
        document.getElementById(
            "clearFiltersButton"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyAllFilters();

            }
        );

    }


    if (levelFilter) {

        levelFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyAllFilters();

            }
        );

    }


    if (departmentFilter) {

        departmentFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyAllFilters();

            }
        );

    }


    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            function () {


                if (statusFilter) {

                    statusFilter.value =
                        "";

                }


                if (levelFilter) {

                    levelFilter.value =
                        "";

                }


                if (departmentFilter) {

                    departmentFilter.value =
                        "";

                }


                const searchInput =
                    document.getElementById(
                        "searchInput"
                    );


                if (searchInput) {

                    searchInput.value =
                        "";

                }


                currentPage = 1;


                applyAllFilters();

            }
        );

    }

}


// =====================================================
// POPULATE DEPARTMENT FILTER
// =====================================================

function populateDepartments() {

    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );


    if (!departmentFilter) {

        return;

    }


    const departments = [];


    allStudents.forEach(
        function (student) {

            const department =
                String(
                    student.department ?? ""
                ).trim();


            if (
                department
                &&
                !departments.includes(
                    department
                )
            ) {

                departments.push(
                    department
                );

            }

        }
    );


    departments.sort();


    const currentValue =
        departmentFilter.value;


    departmentFilter.innerHTML =
        '<option value="">All Departments</option>';


    departments.forEach(
        function (department) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            departmentFilter.appendChild(
                option
            );

        }
    );


    if (
        departments.includes(
            currentValue
        )
    ) {

        departmentFilter.value =
            currentValue;

    }

}


// =====================================================
// GET FULL STUDENT NAME
// =====================================================

function getFullName(student) {

    const firstName =
        student.firstName ?? "";


    const lastName =
        student.lastName ?? "";


    const fullName =
        (
            firstName +
            " " +
            lastName
        ).trim();


    return fullName ||
        "Unknown Student";

}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {

    if (!status) {

        return "ACTIVE";

    }


    const value =
        String(status).toUpperCase();


    if (value === "ACTIVE") {

        return "Active";

    }


    if (value === "INACTIVE") {

        return "Inactive";

    }


    return status;

}


// =====================================================
// UPDATE DASHBOARD STATISTICS
// =====================================================

function updateStatistics(students) {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const activeStudents =
        document.getElementById(
            "activeStudents"
        );


    const registeredToday =
        document.getElementById(
            "registeredToday"
        );


    const registeredThisMonth =
        document.getElementById(
            "registeredThisMonth"
        );


    if (totalStudents) {

        totalStudents.textContent =
            students.length;

    }


    const activeCount =
        students.filter(
            function (student) {

                if (!student.status) {

                    return true;

                }


                return String(
                        student.status
                    ).toUpperCase()
                    === "ACTIVE";

            }
        ).length;


    if (activeStudents) {

        activeStudents.textContent =
            activeCount;

    }


    const todayCount =
        students.filter(
            function (student) {

                return isRegisteredToday(
                    student
                );

            }
        ).length;


    if (registeredToday) {

        registeredToday.textContent =
            todayCount;

    }


    const monthCount =
        students.filter(
            function (student) {

                return isRegisteredThisMonth(
                    student
                );

            }
        ).length;


    if (registeredThisMonth) {

        registeredThisMonth.textContent =
            monthCount;

    }

}


// =====================================================
// CHECK REGISTERED TODAY
// =====================================================

function isRegisteredToday(student) {

    const dateValue =
        getRegistrationDate(
            student
        );


    if (!dateValue) {

        return false;

    }


    const registrationDate =
        new Date(dateValue);


    const today =
        new Date();


    if (
        isNaN(
            registrationDate.getTime()
        )
    ) {

        return false;

    }


    return (

        registrationDate.getFullYear()
        ===
        today.getFullYear()

        &&

        registrationDate.getMonth()
        ===
        today.getMonth()

        &&

        registrationDate.getDate()
        ===
        today.getDate()

    );

}


// =====================================================
// CHECK REGISTERED THIS MONTH
// =====================================================

function isRegisteredThisMonth(student) {

    const dateValue =
        getRegistrationDate(
            student
        );


    if (!dateValue) {

        return false;

    }


    const registrationDate =
        new Date(dateValue);


    const today =
        new Date();


    if (
        isNaN(
            registrationDate.getTime()
        )
    ) {

        return false;

    }


    return (

        registrationDate.getFullYear()
        ===
        today.getFullYear()

        &&

        registrationDate.getMonth()
        ===
        today.getMonth()

    );

}


// =====================================================
// GET REGISTRATION DATE
// =====================================================

function getRegistrationDate(student) {

    return (

        student.registrationDate

        ||

        student.createdAt

        ||

        student.createdDate

        ||

        student.dateCreated

        ||

        null

    );

}


// =====================================================
// VIEW STUDENT
// =====================================================

function viewStudent(student) {

    currentStudent =
        student;


    const modal =
        document.getElementById(
            "viewStudentModal"
        );


    if (!modal) {

        console.error(
            "View student modal not found."
        );

        return;

    }


    const profileName =
        document.getElementById(
            "viewProfileName"
        );


    const avatar =
        document.getElementById(
            "studentAvatar"
        );


    const fullName =
        getFullName(
            student
        );


    if (profileName) {

        profileName.textContent =
            fullName;

    }


    if (avatar) {

        avatar.textContent =
            getInitials(
                student
            );

    }


    setText(
        "viewStudentId",
        student.id
    );


    setText(
        "viewStudentName",
        fullName
    );


    setText(
        "viewStudentEmail",
        student.email
    );


    setText(
        "viewStudentPhone",
        student.phoneNumber
    );


    setText(
        "viewStudentRegistration",
        student.registrationNumber
    );


    setText(
        "viewStudentFaculty",
        student.faculty
    );


    setText(
        "viewStudentDepartment",
        student.department
    );


    setText(
        "viewStudentLevel",
        student.level
    );


    setText(
        "viewStudentSession",
        student.session
    );


    setText(
        "viewStudentGender",
        student.gender
    );


    setText(
        "viewStudentDateOfBirth",
        student.dateOfBirth
    );


    setText(
        "viewStudentAddress",
        student.address
    );


    setText(
        "viewStudentGuardianName",
        student.guardianName
    );


    setText(
        "viewStudentGuardianPhone",
        student.guardianPhone
    );


    setText(
        "viewStudentStatus",
        formatStatus(
            student.status
        )
    );


    const registrationDate =
        getRegistrationDate(
            student
        );


    setText(
        "viewStudentDate",
        formatDate(
            registrationDate
        )
    );


    modal.classList.add(
        "show"
    );


    const editButton =
        document.getElementById(
            "viewEditButton"
        );


    if (editButton) {

        editButton.onclick =
            function () {

                closeStudentDetails();

                openEditModal(
                    student
                );

            };

    }

}


// =====================================================
// SET TEXT SAFELY
// =====================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    if (
        value === null
        ||
        value === undefined
        ||
        value === ""
    ) {

        element.textContent =
            "Not available";

        return;

    }


    element.textContent =
        value;

}


// =====================================================
// GET INITIALS
// =====================================================

function getInitials(student) {

    const firstName =
        String(
            student.firstName ?? ""
        ).trim();


    const lastName =
        String(
            student.lastName ?? ""
        ).trim();


    let initials = "";


    if (firstName) {

        initials +=
            firstName.charAt(0);

    }


    if (lastName) {

        initials +=
            lastName.charAt(0);

    }


    if (!initials) {

        initials = "S";

    }


    return initials.toUpperCase();

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Not available";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateValue;

    }


    return date.toLocaleString();

}


// =====================================================
// CLOSE VIEW MODAL
// =====================================================

function closeStudentDetails() {

    const modal =
        document.getElementById(
            "viewStudentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    currentStudent =
        null;

}


// =====================================================
// OPEN EDIT MODAL
// =====================================================

function openEditModal(student) {

    currentStudent =
        student;


    const modal =
        document.getElementById(
            "editModal"
        );


    if (!modal) {

        console.error(
            "Edit modal not found."
        );

        return;

    }


    // =================================================
    // BASIC INFORMATION
    // =================================================

    setInputValue(
        "editId",
        student.id
    );


    setInputValue(
        "editFirstName",
        student.firstName
    );


    setInputValue(
        "editLastName",
        student.lastName
    );


    setInputValue(
        "editEmail",
        student.email
    );


    setInputValue(
        "editPhoneNumber",
        student.phoneNumber
    );


    setInputValue(
        "editRegistrationNumber",
        student.registrationNumber
    );


    // =================================================
    // PERSONAL INFORMATION
    // =================================================

    setInputValue(
        "editGender",
        student.gender
    );


    setInputValue(
        "editDateOfBirth",
        student.dateOfBirth
    );


    // =================================================
    // ACADEMIC INFORMATION
    // =================================================

    setInputValue(
        "editFaculty",
        student.faculty
    );


    setInputValue(
        "editDepartment",
        student.department
    );


    setInputValue(
        "editLevel",
        student.level
    );


    setInputValue(
        "editSession",
        student.session
    );


    // =================================================
    // ADDRESS
    // =================================================

    setInputValue(
        "editAddress",
        student.address
    );


    // =================================================
    // GUARDIAN INFORMATION
    // =================================================

    setInputValue(
        "editGuardianName",
        student.guardianName
    );


    setInputValue(
        "editGuardianPhone",
        student.guardianPhone
    );


    // =================================================
    // STATUS
    // =================================================

    const status =
        student.status
            ? String(
                student.status
            ).toUpperCase()
            : "ACTIVE";


    setInputValue(
        "editStatus",
        status
    );


    // =================================================
    // CLEAR PREVIOUS MESSAGE
    // =================================================

    const editMessage =
        document.getElementById(
            "editMessage"
        );


    if (editMessage) {

        editMessage.textContent =
            "";


        editMessage.style.background =
            "transparent";


        editMessage.style.border =
            "none";

    }


    // =================================================
    // SHOW MODAL
    // =================================================

    modal.classList.add(
        "show"
    );

}


// =====================================================
// SET INPUT VALUE
// =====================================================

function setInputValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}


// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    currentStudent =
        null;

}


// =====================================================
// EDIT FORM SUBMISSION
// =====================================================

function setupEditForm() {

    const editForm =
        document.getElementById(
            "editStudentForm"
        );


    if (!editForm) {

        console.warn(
            "Edit form was not found."
        );

        return;

    }


    editForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "editId"
                ).value;


            if (!id) {

                showEditMessage(
                    "Student ID is missing.",
                    "error"
                );

                return;

            }


            // =================================================
            // GET ALL EDIT VALUES
            // =================================================

            const updatedStudent = {

                firstName:
                    document.getElementById(
                        "editFirstName"
                    ).value.trim(),


                lastName:
                    document.getElementById(
                        "editLastName"
                    ).value.trim(),


                email:
                    document.getElementById(
                        "editEmail"
                    ).value.trim(),


                phoneNumber:
                    document.getElementById(
                        "editPhoneNumber"
                    ).value.trim(),


                registrationNumber:
                    document.getElementById(
                        "editRegistrationNumber"
                    ).value.trim(),


                gender:
                    document.getElementById(
                        "editGender"
                    ).value || null,


                dateOfBirth:
                    document.getElementById(
                        "editDateOfBirth"
                    ).value || null,


                faculty:
                    document.getElementById(
                        "editFaculty"
                    ).value.trim() || null,


                department:
                    document.getElementById(
                        "editDepartment"
                    ).value.trim() || null,


                level:
                    document.getElementById(
                        "editLevel"
                    ).value || null,


                session:
                    document.getElementById(
                        "editSession"
                    ).value || null,


                address:
                    document.getElementById(
                        "editAddress"
                    ).value.trim() || null,


                guardianName:
                    document.getElementById(
                        "editGuardianName"
                    ).value.trim() || null,


                guardianPhone:
                    document.getElementById(
                        "editGuardianPhone"
                    ).value.trim() || null,


                status:
                document.getElementById(
                    "editStatus"
                ).value

            };


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !updatedStudent.firstName
                ||
                !updatedStudent.lastName
                ||
                !updatedStudent.email
                ||
                !updatedStudent.phoneNumber
                ||
                !updatedStudent.registrationNumber
            ) {

                showEditMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;

            }


            // =================================================
            // UPDATE BUTTON
            // =================================================

            const updateButton =
                editForm.querySelector(
                    ".update-button"
                );


            if (updateButton) {

                updateButton.disabled =
                    true;


                updateButton.textContent =
                    "Updating...";

            }


            // =================================================
            // SEND UPDATE TO SPRING BOOT
            // =================================================

            try {

                const response =
                    await fetch(
                        "/students/" + id,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedStudent
                                )

                        }
                    );


                // =================================================
                // SUCCESS
                // =================================================

                if (response.ok) {

                    showEditMessage(
                        "Student updated successfully!",
                        "success"
                    );


                    await loadStudents();


                    await loadDashboardStatistics();


                    setTimeout(
                        function () {

                            closeEditModal();

                        },
                        700
                    );


                    return;

                }


                // =================================================
                // SERVER ERROR
                // =================================================

                let errorMessage =
                    "Failed to update student.";


                try {

                    const contentType =
                        response.headers.get(
                            "content-type"
                        );


                    if (
                        contentType
                        &&
                        contentType.includes(
                            "application/json"
                        )
                    ) {

                        const errorData =
                            await response.json();


                        if (errorData.message) {

                            errorMessage =
                                errorData.message;

                        } else if (
                            errorData.error
                        ) {

                            errorMessage =
                                errorData.error;

                        }

                    } else {

                        const errorText =
                            await response.text();


                        if (errorText) {

                            errorMessage =
                                errorText;

                        }

                    }

                } catch (error) {

                    console.error(
                        "Could not read update error:",
                        error
                    );

                }


                showEditMessage(
                    errorMessage,
                    "error"
                );


            } catch (error) {

                console.error(
                    "Update error:",
                    error
                );


                showEditMessage(
                    "Could not connect to the server.",
                    "error"
                );


            } finally {

                if (updateButton) {

                    updateButton.disabled =
                        false;


                    updateButton.textContent =
                        "Update Student";

                }

            }

        }
    );

}


// =====================================================
// SHOW EDIT MESSAGE
// =====================================================

function showEditMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "editMessage"
        );


    if (!message) {

        return;

    }


    message.textContent =
        text;


    if (type === "success") {

        message.style.color =
            "#16a34a";


        message.style.background =
            "#f0fdf4";


        message.style.border =
            "1px solid #bbf7d0";

    } else {

        message.style.color =
            "#dc2626";


        message.style.background =
            "#fef2f2";


        message.style.border =
            "1px solid #fecaca";

    }


    message.style.padding =
        "12px";


    message.style.borderRadius =
        "7px";


    message.style.marginTop =
        "15px";


    message.style.textAlign =
        "center";

}


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(student) {

    const id =
        student.id;


    if (!id) {

        alert(
            "This student does not have a valid ID."
        );

        return;

    }


    const fullName =
        getFullName(
            student
        );


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            fullName +
            "?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                "/students/" + id,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            alert(
                "Student deleted successfully."
            );


            await loadStudents();


            await loadDashboardStatistics();


            return;

        }


        let errorMessage =
            "Failed to delete student.";


        try {

            const contentType =
                response.headers.get(
                    "content-type"
                );


            if (
                contentType
                &&
                contentType.includes(
                    "application/json"
                )
            ) {

                const errorData =
                    await response.json();


                if (errorData.message) {

                    errorMessage =
                        errorData.message;

                } else if (
                    errorData.error
                ) {

                    errorMessage =
                        errorData.error;

                }

            } else {

                const errorText =
                    await response.text();


                if (errorText) {

                    errorMessage =
                        errorText;

                }

            }

        } catch (error) {

            console.error(
                "Could not read delete error:",
                error
            );

        }


        alert(
            errorMessage
        );


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Could not connect to the server."
        );

    }

}


// =====================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    function (event) {

        const viewModal =
            document.getElementById(
                "viewStudentModal"
            );


        const editModal =
            document.getElementById(
                "editModal"
            );


        if (
            viewModal
            &&
            event.target === viewModal
        ) {

            closeStudentDetails();

        }


        if (
            editModal
            &&
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// =====================================================
// ESC KEY CLOSES MODALS
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeStudentDetails();

        closeEditModal();

    }
);