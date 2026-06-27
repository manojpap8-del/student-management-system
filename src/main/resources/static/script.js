const API_URL = "/students";

const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");

let editMode = false;

// Token check karna - agar nahi hai to login page pe bhejo
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

// Har request ke liye common headers (token ke saath)
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Page load hote hi students fetch karo
document.addEventListener("DOMContentLoaded", fetchStudents);

// Sab students fetch karke table me dikhana
function fetchStudents() {
    fetch(API_URL, { headers: getAuthHeaders() })
        .then(res => {
            if (res.status === 401) {
                logout(); // token expire/invalid hai, login pe bhejo
                return;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;

            tableBody.innerHTML = "";

            const filtered = data.filter(student =>
                student.name.toLowerCase().includes(searchInput.value.toLowerCase())
            );

            document.getElementById("studentCount").textContent = data.length;

           filtered.forEach((student, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                   <td data-label="S.No">${index + 1}</td>
                    <td data-label="Name">${student.name}</td>
                    <td data-label="Email">${student.email}</td>
                    <td data-label="Course">${student.course}</td>
                    <td data-label="Age">${student.age}</td>
                    <td data-label="Actions">
                        <button class="edit-btn" onclick="editStudent(${student.id}, '${student.name}', '${student.email}', '${student.course}', ${student.age})">Edit</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error("Error fetching students: - script.js:73", err));
}

// Form submit hone par (Add ya Update)
form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorMsg.textContent = "";

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        age: parseInt(document.getElementById("age").value)
    };

    if (editMode) {
        const id = document.getElementById("studentId").value;
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(student)
        })
        .then(res => {
            if (res.status === 401) { logout(); return; }
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        })
        .then(() => {
            resetForm();
            fetchStudents();
        })
        .catch(err => errorMsg.textContent = "Error updating student");
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(student)
        })
        .then(res => {
            if (res.status === 401) { logout(); return; }
            if (!res.ok) {
                return res.json().then(data => { throw data; });
            }
            return res.json();
        })
        .then(() => {
            resetForm();
            fetchStudents();
        })
        .catch(err => {
            errorMsg.textContent = Object.values(err).join(", ") || "Error adding student";
        });
    }
});

// Edit button click hone par form fill karna
function editStudent(id, name, email, course, age) {
    editMode = true;
    document.getElementById("studentId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("course").value = course;
    document.getElementById("age").value = age;

    formTitle.textContent = "Edit Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.style.display = "inline-block";
}

// Cancel button click hone par form reset karna
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
    editMode = false;
    form.reset();
    document.getElementById("studentId").value = "";
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.style.display = "none";
    errorMsg.textContent = "";
}

// Delete button click hone par
function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        })
            .then(res => {
                if (res.status === 401) { logout(); return; }
                fetchStudents();
            })
            .catch(err => console.error("Error deleting student: - script.js:166", err));
    }
}

searchInput.addEventListener("input", fetchStudents);