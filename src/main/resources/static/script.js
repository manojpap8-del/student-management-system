const API_URL = "http://localhost:8080/students";

const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const searchInput =
document.getElementById(
"searchInput"
);

let editMode = false;

// Page load hote hi students fetch karo
document.addEventListener("DOMContentLoaded", fetchStudents);

// Sab students fetch karke table me dikhana
function fetchStudents() {
    fetch(API_URL)
        .then(res => res.json())
       .then(data => {

    tableBody.innerHTML = "";

    const filtered =
    data.filter(student =>

        student.name
        .toLowerCase()

        .includes(

            searchInput
            .value
            .toLowerCase()

        )

    );

    filtered.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.age}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id}, '${student.name}', '${student.email}', '${student.course}', ${student.age})">Edit</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error("Error fetching students: - script.js:59", err));
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        })
        .then(res => {
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        })
        .then(res => {
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
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => fetchStudents())
            .catch(err => console.error("Error deleting student: - script.js:144", err));
    }
}
searchInput.addEventListener(
"input",
fetchStudents
);