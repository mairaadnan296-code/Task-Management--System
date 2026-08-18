/* ==========================================
   SMART TASK MANAGEMENT SYSTEM
   FRONTEND JAVASCRIPT
========================================== */

const API_URL = "http://localhost:5000";

let allTasks = [];
let selectedTaskId = null;


/* ==========================================
   AUTHENTICATION UI
========================================== */

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("authMessage").textContent = "";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("authMessage").textContent = "";
}


/* ==========================================
   REGISTER
========================================== */

async function registerUser() {

    const fullName =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const message =
        document.getElementById("authMessage");

    if (!fullName || !email || !password) {
        message.textContent = "Please fill in all fields.";
        message.style.color = "#ef4444";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Password must be at least 6 characters.";
        message.style.color = "#ef4444";
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            message.textContent =
                "Account created successfully. Please login.";

            message.style.color = "#22c55e";

            document.getElementById("registerName").value = "";
            document.getElementById("registerEmail").value = "";
            document.getElementById("registerPassword").value = "";

            setTimeout(function () {
                showLogin();
            }, 1000);

        } else {

            message.textContent =
                data.message || "Registration failed.";

            message.style.color = "#ef4444";
        }

    } catch (error) {

        console.error("Register Error:", error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#ef4444";
    }
}


/* ==========================================
   LOGIN
========================================== */

async function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("authMessage");

    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

        message.style.color = "#ef4444";

        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            message.textContent =
                "Login successful.";

            message.style.color = "#22c55e";

            showDashboard(data.user);

            await loadDashboard();
            await loadTasks();

        } else {

            message.textContent =
                data.message ||
                "Invalid email or password.";

            message.style.color = "#ef4444";
        }

    } catch (error) {

        console.error("Login Error:", error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#ef4444";
    }
}


/* ==========================================
   SHOW DASHBOARD
========================================== */

function showDashboard(user) {

    document.getElementById("authSection").style.display = "none";

    document.getElementById("dashboardSection").style.display = "block";

    const welcomeUser =
        document.getElementById("welcomeUser");

    if (user && user.fullName) {
        welcomeUser.textContent = user.fullName;
    } else {
        welcomeUser.textContent = "User";
    }
}


/* ==========================================
   CHECK CURRENT USER
========================================== */

async function checkCurrentUser() {

    try {

        const response = await fetch(
            API_URL + "/api/me",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (data.success) {

            showDashboard(data.user);

            await loadDashboard();
            await loadTasks();
        }

    } catch (error) {

        console.log("User is not logged in.");
    }
}


/* ==========================================
   LOGOUT
========================================== */

async function logoutUser() {

    try {

        const response = await fetch(
            API_URL + "/api/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (data.success) {

            document.getElementById(
                "dashboardSection"
            ).style.display = "none";

            document.getElementById(
                "authSection"
            ).style.display = "flex";

            document.getElementById(
                "loginEmail"
            ).value = "";

            document.getElementById(
                "loginPassword"
            ).value = "";

            showLogin();

            document.getElementById(
                "authMessage"
            ).textContent =
                "Logged out successfully.";

            document.getElementById(
                "authMessage"
            ).style.color = "#22c55e";
        }

    } catch (error) {

        console.error("Logout Error:", error);
    }
}


/* ==========================================
   ADD TASK
========================================== */

async function addTask() {

    const title =
        document.getElementById("title").value.trim();

    const category =
        document.getElementById("category").value.trim();

    const priority =
        document.getElementById("priority").value;

    const dueDate =
        document.getElementById("dueDate").value;

    const description =
        document.getElementById("description").value.trim();

    const progressNotesElement =
        document.getElementById("progressNotes");

    const progressNotes =
        progressNotesElement
            ? progressNotesElement.value.trim()
            : "";

    const statusElement =
        document.getElementById("status");

    const status =
        statusElement
            ? statusElement.value
            : "Pending";

    const message =
        document.getElementById("taskMessage");

    if (!title) {

        message.textContent =
            "Task title is required.";

        message.style.color = "#ef4444";

        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/tasks",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    title: title,
                    description: description,
                    category: category,
                    priority: priority,
                    dueDate: dueDate
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            message.textContent =
                "Task added successfully.";

            message.style.color = "#22c55e";

            clearTaskForm();

            await loadTasks();
            await loadDashboard();

        } else {

            message.textContent =
                data.message ||
                "Failed to add task.";

            message.style.color = "#ef4444";
        }

    } catch (error) {

        console.error("Add Task Error:", error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#ef4444";
    }
}


/* ==========================================
   CLEAR TASK FORM
========================================== */

function clearTaskForm() {

    document.getElementById("title").value = "";

    document.getElementById("category").value = "";

    document.getElementById("priority").value =
        "Medium";

    document.getElementById("dueDate").value = "";

    document.getElementById("description").value = "";

    const progressNotes =
        document.getElementById("progressNotes");

    if (progressNotes) {
        progressNotes.value = "";
    }

    const status =
        document.getElementById("status");

    if (status) {
        status.value = "Pending";
    }
}


/* ==========================================
   LOAD TASKS
========================================== */

async function loadTasks() {

    const taskList =
        document.getElementById("taskList");

    try {

        const response = await fetch(
            API_URL + "/api/tasks",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            taskList.innerHTML =
                '<div class="empty-message">' +
                '<h3>Unable to load tasks</h3>' +
                '<p>' +
                (data.message || "Please login first.") +
                '</p>' +
                '</div>';

            return;
        }

        allTasks = data.tasks || [];

        updateCategoryFilter();
        displayTasks(allTasks);
        displayUpcomingTasks(allTasks);

    } catch (error) {

        console.error("Load Tasks Error:", error);

        taskList.innerHTML =
            '<div class="empty-message">' +
            '<h3>Connection Error</h3>' +
            '<p>Unable to connect to the backend server.</p>' +
            '</div>';
    }
}


/* ==========================================
   DISPLAY TASKS
========================================== */

function displayTasks(tasks) {

    const taskList =
        document.getElementById("taskList");

    if (!tasks || tasks.length === 0) {

        taskList.innerHTML =
            '<div class="empty-message">' +
            '<h3>No tasks found</h3>' +
            '<p>Create a new task to get started.</p>' +
            '</div>';

        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        const status =
            getTaskStatus(task);

        const progress =
            Number(task.progress || 0);

        const priorityClass =
            getPriorityClass(task.priority);

        const statusClass =
            getStatusClass(status);

        const card =
            document.createElement("div");

        card.className = "task-card";

        card.innerHTML =

            "<h3>" +
            escapeHTML(task.title) +
            "</h3>" +

            "<p>" +
            "<strong>Category:</strong> " +
            escapeHTML(task.category || "General") +
            "</p>" +

            "<p>" +
            "<strong>Priority:</strong> " +
            '<span class="' + priorityClass + '">' +
            escapeHTML(task.priority || "Medium") +
            "</span>" +
            "</p>" +

            "<p>" +
            "<strong>Status:</strong> " +
            '<span class="' + statusClass + '">' +
            escapeHTML(status) +
            "</span>" +
            "</p>" +

            "<p>" +
            "<strong>Due Date:</strong> " +
            escapeHTML(task.dueDate || "No due date") +
            "</p>" +

            "<p>" +
            "<strong>Description:</strong> " +
            escapeHTML(
                task.description ||
                "No description provided."
            ) +
            "</p>" +

            '<div class="progress-display">' +

            '<div class="progress-header">' +

            "<strong>Progress</strong>" +

            "<span>" +
            progress +
            "%" +
            "</span>" +

            "</div>" +

            '<div class="progress-bar">' +

            '<div class="progress-fill" style="width: ' +
            progress +
            '%"></div>' +

            "</div>" +

            "</div>" +

            "<p>" +
            "<strong>Progress Update:</strong> " +
            escapeHTML(
                task.progressNotes ||
                "No progress update yet."
            ) +
            "</p>" +

            '<div class="task-actions">' +

            '<button class="complete-btn" ' +
            'onclick="completeTask(' +
            task.taskId +
            ')">' +
            "✓ Complete" +
            "</button>" +

            '<button class="edit-btn" ' +
            'onclick="openProgressModal(' +
            task.taskId +
            ')">' +
            "↗ Update Progress" +
            "</button>" +

            '<button class="delete-btn" ' +
            'onclick="deleteTask(' +
            task.taskId +
            ')">' +
            "Delete" +
            "</button>" +

            "</div>";

        taskList.appendChild(card);
    });
}


/* ==========================================
   TASK STATUS
========================================== */

function getTaskStatus(task) {

    if (task.status === "Completed") {
        return "Completed";
    }

    if (
        task.dueDate &&
        new Date(task.dueDate) <
        new Date().setHours(0, 0, 0, 0)
    ) {
        return "Overdue";
    }

    return task.status || "Pending";
}


/* ==========================================
   PRIORITY CLASS
========================================== */

function getPriorityClass(priority) {

    if (priority === "High") {
        return "priority-high";
    }

    if (priority === "Low") {
        return "priority-low";
    }

    return "priority-medium";
}


/* ==========================================
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    if (status === "Completed") {
        return "status-completed";
    }

    if (status === "In Progress") {
        return "status-progress";
    }

    if (status === "Overdue") {
        return "status-overdue";
    }

    return "status-pending";
}


/* ==========================================
   COMPLETE TASK
========================================== */

async function completeTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to mark this task as completed?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            API_URL +
            "/api/tasks/" +
            taskId +
            "/complete",
            {
                method: "PUT",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (data.success) {

            alert(
                "Task marked as completed."
            );

            await loadTasks();
            await loadDashboard();

        } else {

            alert(
                data.message ||
                "Unable to complete task."
            );
        }

    } catch (error) {

        console.error(
            "Complete Task Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );
    }
}


/* ==========================================
   DELETE TASK
========================================== */

async function deleteTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            API_URL +
            "/api/tasks/" +
            taskId,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const data =
            await response.json();

        if (data.success) {

            alert(
                "Task deleted successfully."
            );

            await loadTasks();
            await loadDashboard();

        } else {

            alert(
                data.message ||
                "Unable to delete task."
            );
        }

    } catch (error) {

        console.error(
            "Delete Task Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );
    }
}


/* ==========================================
   PROGRESS MODAL
========================================== */

function openProgressModal(taskId) {

    const task =
        allTasks.find(function (item) {
            return item.taskId === taskId;
        });

    if (!task) {
        return;
    }

    selectedTaskId = taskId;

    document.getElementById(
        "progressStatus"
    ).value =
        task.status || "Pending";

    document.getElementById(
        "progressPercentage"
    ).value =
        Number(task.progress || 0);

    document.getElementById(
        "progressUpdate"
    ).value =
        task.progressNotes || "";

    document.getElementById(
        "progressModal"
    ).style.display = "flex";
}


/* ==========================================
   CLOSE PROGRESS MODAL
========================================== */

function closeProgressModal() {

    selectedTaskId = null;

    document.getElementById(
        "progressModal"
    ).style.display = "none";
}


/* ==========================================
   SAVE PROGRESS UPDATE
========================================== */

async function saveProgressUpdate() {

    if (!selectedTaskId) {
        return;
    }

    const status =
        document.getElementById(
            "progressStatus"
        ).value;

    let progress =
        Number(
            document.getElementById(
                "progressPercentage"
            ).value
        );

    const progressUpdate =
        document.getElementById(
            "progressUpdate"
        ).value.trim();

    if (isNaN(progress)) {
        progress = 0;
    }

    if (progress < 0) {
        progress = 0;
    }

    if (progress > 100) {
        progress = 100;
    }

    try {

        const response = await fetch(
            API_URL +
            "/api/tasks/" +
            selectedTaskId,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    status: status,
                    progress: progress,
                    progressNotes: progressUpdate
                })
            }
        );

        const data =
            await response.json();

        if (data.success) {

            alert(
                "Progress updated successfully."
            );

            closeProgressModal();

            await loadTasks();
            await loadDashboard();

        } else {

            alert(
                data.message ||
                "Unable to update progress."
            );
        }

    } catch (error) {

        console.error(
            "Save Progress Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );
    }
}


/* ==========================================
   SEARCH + FILTER
========================================== */

function filterTasks() {

    const search =
        document.getElementById(
            "searchTasks"
        ).value
        .toLowerCase()
        .trim();

    const statusFilter =
        document.getElementById(
            "statusFilter"
        ).value;

    const priorityFilter =
        document.getElementById(
            "priorityFilter"
        ).value;

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        ).value;

    const filtered =
        allTasks.filter(function (task) {

            const title =
                (task.title || "")
                .toLowerCase();

            const category =
                (task.category || "")
                .toLowerCase();

            const matchesSearch =
                title.includes(search) ||
                category.includes(search);

            const currentStatus =
                getTaskStatus(task);

            const matchesStatus =
                statusFilter === "All" ||
                currentStatus === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                task.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesCategory
            );
        });

    displayTasks(filtered);
}


/* ==========================================
   CATEGORY FILTER
========================================== */

function updateCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    const categories =
        [
            ...new Set(
                allTasks
                    .map(function (task) {
                        return task.category;
                    })
                    .filter(Boolean)
            )
        ];

    select.innerHTML =
        '<option value="All">All Categories</option>';

    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        select.appendChild(option);
    });
}


/* ==========================================
   UPCOMING DEADLINES
========================================== */

function displayUpcomingTasks(tasks) {

    const container =
        document.getElementById(
            "upcomingTasks"
        );

    const upcoming =
        tasks
            .filter(function (task) {
                return (
                    task.dueDate &&
                    getTaskStatus(task) !== "Completed"
                );
            })
            .sort(function (a, b) {
                return (
                    new Date(a.dueDate) -
                    new Date(b.dueDate)
                );
            })
            .slice(0, 5);

    if (upcoming.length === 0) {

        container.innerHTML =
            '<p class="empty-message">' +
            'No upcoming deadlines.' +
            '</p>';

        return;
    }

    container.innerHTML = "";

    upcoming.forEach(function (task) {

        const item =
            document.createElement("div");

        item.className = "task-card";

        item.innerHTML =
            "<h3>" +
            escapeHTML(task.title) +
            "</h3>" +

            "<p>" +
            "<strong>Due:</strong> " +
            escapeHTML(task.dueDate) +
            "</p>" +

            "<p>" +
            "<strong>Priority:</strong> " +
            escapeHTML(task.priority || "Medium") +
            "</p>";

        container.appendChild(item);
    });
}


/* ==========================================
   DASHBOARD STATISTICS
========================================== */

async function loadDashboard() {

    try {

        const response =
            await fetch(
                API_URL + "/api/dashboard",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

        const data =
            await response.json();

        if (!data.success) {
            return;
        }

        const dashboard =
            data.dashboard;

        document.getElementById(
            "totalTasks"
        ).textContent =
            dashboard.totalTasks || 0;

        document.getElementById(
            "completedTasks"
        ).textContent =
            dashboard.completedTasks || 0;

        document.getElementById(
            "pendingTasks"
        ).textContent =
            dashboard.pendingTasks || 0;

        document.getElementById(
            "overdueTasks"
        ).textContent =
            dashboard.overdueTasks || 0;

        document.getElementById(
            "completionPercentage"
        ).textContent =
            (dashboard.completionPercentage || 0) + "%";

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );
    }
}


/* ==========================================
   HTML SAFETY
========================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==========================================
   CLOSE MODAL OUTSIDE CLICK
========================================== */

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "progressModal"
            );

        if (event.target === modal) {
            closeProgressModal();
        }
    }
);


/* ==========================================
   START APPLICATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkCurrentUser();

    }
);