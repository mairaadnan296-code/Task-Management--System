# 🚀 Smart Task Management System

A modern **full-stack task management web application** developed to help users organize tasks, track progress, manage priorities, and monitor deadlines efficiently.

The system combines a **HTML/CSS/JavaScript frontend**, **Python Flask REST API**, and **Microsoft SQL Server database**.

---

## 📌 Project Overview

The **Smart Task Management System** was developed as the **Week 4 Full Stack Mini Project** for the **NexaSecure Software Development Internship Program**.

The application provides:

* 🔐 User Registration & Login
* 📋 Task Creation & Management
* ✏️ Edit and Delete Tasks
* ✅ Task Completion
* 📊 Progress Tracking
* 📝 Progress Updates / Notes
* 🎯 Task Priority
* 🏷️ Task Categories
* 📅 Due Dates
* 🔎 Search & Filtering
* 📈 Dashboard Statistics
* ⏰ Upcoming / Overdue Tasks
* 💾 SQL Server Database Storage
* 📱 Responsive User Interface

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* User logout
* Password hashing
* Session-based authentication
* Current-user verification
* Duplicate email protection
* Password validation

### 📋 Task Management

Users can:

* Add new tasks
* View their tasks
* Edit task information
* Delete tasks
* Mark tasks as completed
* Set task priority
* Select task category
* Add descriptions
* Set due dates

### 📊 Progress Tracking

Tasks support progress monitoring through:

* Task status
* Progress percentage
* Progress updates
* Progress notes
* Completion tracking

Example:

```text
Status: In Progress
Progress: 70%

Progress Update:
Backend integration has been completed.
Frontend testing is remaining.
```

### 📈 Dashboard

The dashboard provides:

* Total Tasks
* Completed Tasks
* Pending Tasks
* Overdue Tasks
* Completion Percentage

### 🔎 Search & Filters

Tasks can be filtered using:

* Search keyword
* Status
* Priority
* Category

### 📅 Deadline Monitoring

Users can view upcoming deadlines and identify tasks that require attention.

### 📱 Responsive Design

The interface is designed for:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Web Design

### Backend

* Python
* Flask
* Flask-CORS
* REST API
* Werkzeug

### Database

* Microsoft SQL Server
* PyODBC
* T-SQL

### Development Tools

* PyCharm
* SQL Server Management Studio
* GitHub
* Web Browser

---

## 🏗️ System Architecture

```text
                User
                  │
                  ▼
        ┌───────────────────┐
        │     Frontend      │
        │ HTML + CSS + JS   │
        └─────────┬─────────┘
                  │
             HTTP Requests
                  │
                  ▼
        ┌───────────────────┐
        │    Flask REST API │
        │      Python       │
        └─────────┬─────────┘
                  │
             Database Queries
                  │
                  ▼
        ┌───────────────────┐
        │   SQL Server DB   │
        └───────────────────┘
```

---

## 📂 Project Structure

The repository uses a simple root-level structure:

```text
Task-Management--System/
│
├── App.py
├── auth.py
├── db.py
│
├── index.html
├── style.css
├── script.js
│
├── schema.sql
│
├── screenshots/
│   ├── login.png
│   ├── register.png
│   ├── dashboard.png
│   ├── add-task.png
│   ├── my tasks.png
│   └── deadlines.png
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/api/register` | Register a new user        |
| POST   | `/api/login`    | Login user                 |
| GET    | `/api/me`       | Get current logged-in user |
| POST   | `/api/logout`   | Logout user                |

### Task Management

| Method | Endpoint                        | Description            |
| ------ | ------------------------------- | ---------------------- |
| POST   | `/api/tasks`                    | Add a new task         |
| GET    | `/api/tasks`                    | Get user's tasks       |
| PUT    | `/api/tasks/<task_id>`          | Update a task          |
| DELETE | `/api/tasks/<task_id>`          | Delete a task          |
| PUT    | `/api/tasks/<task_id>/complete` | Mark task as completed |

### Dashboard

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/dashboard` | Get task statistics |

---

## 🗄️ Database

The application uses **Microsoft SQL Server** for persistent data storage.

### Users Table

Stores registered user information:

```text
UserID
FullName
Email
PasswordHash
CreatedAt
```

### Tasks Table

Stores task information:

```text
TaskID
UserID
Title
Description
Category
Priority
DueDate
Status
CreatedAt
UpdatedAt
```

Each task is associated with its user through `UserID`.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Open the project folder.

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install flask flask-cors pyodbc werkzeug
```

### 4. Configure SQL Server

Make sure Microsoft SQL Server is installed and running.

Run the provided:

```text
schema.sql
```

file in SQL Server Management Studio to create the required database and tables.

Update the database connection settings in:

```text
db.py
```

according to your SQL Server configuration.

### 5. Start the Backend

Run:

```bash
python App.py
```

The Flask backend runs on:

```text
http://127.0.0.1:5000
```

### 6. Start the Frontend

From the project folder, run:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

---

## 🧪 Testing

The application was tested for:

* User registration
* User login
* User logout
* Task creation
* Task retrieval
* Task editing
* Task deletion
* Progress updates
* Task completion
* Dashboard statistics
* Search and filtering
* Database connectivity
* Frontend-backend communication

---

## 📸 Screenshots

Screenshots demonstrating the application's functionality are available in the [`screenshots`](./screenshots) folder.

### 🔐 Login

![Login]<img width="850" height="471" alt="Login " src="https://github.com/user-attachments/assets/644ed359-144e-4ffc-8098-bbeb989d14a2" />


### 📝 Registration

![Registration]<img width="793" height="437" alt="Register" src="https://github.com/user-attachments/assets/3cea3221-03cf-4d6f-9589-e5d9bb7ae188" />


### 📊 Dashboard

![Dashboard]<img width="838" height="178" alt="dashboard" src="https://github.com/user-attachments/assets/51b8edf3-0a85-401b-9097-47af93fffd14" />


### ➕ Add Task

![Add Task]<img width="901" height="419" alt="add tasks" src="https://github.com/user-attachments/assets/ee05d5cd-5896-4a18-b3d4-4d33511bc261" />

### My tasks
![My tasks]<img width="849" height="480" alt="my tasks" src="https://github.com/user-attachments/assets/0fe5a319-3258-4415-8484-2d0c687a31e9" />

### 📈 Deadlines

![Deadlines]<img width="893" height="278" alt="deadlines" src="https://github.com/user-attachments/assets/e7734ec0-078b-4ea4-bc3f-a00999f7f92b" />


---

## 🔒 Security

The application implements basic security practices including:

* Password hashing
* Session-based authentication
* User-specific task access
* Input validation
* Protected task endpoints
* Duplicate email checking
* Safe frontend task rendering

---

## 🎯 Project Objectives

The main objectives were to:

1. Develop a functional full-stack web application.
2. Connect a frontend with a Flask REST API.
3. Implement user authentication.
4. Store application data in a relational database.
5. Implement CRUD operations.
6. Add task progress tracking.
7. Create a responsive user interface.
8. Practice API testing.
9. Integrate SQL Server with Python.
10. Apply GitHub version control and project documentation.

---

## 🚀 Future Improvements

Possible future improvements include:

* Email notifications
* Calendar integration
* Dark / Light theme
* Task reminders
* Drag-and-drop task organization
* Advanced analytics and charts
* User profile management
* Cloud deployment
* Role-based access control

---

## 👩‍💻 Developed By

**Maira Adnan**

**Information Technology Student**

### Project

**Smart Task Management System**

Developed as part of the:

**NexaSecure Software Development Internship Program — Week 4 Full Stack Mini Project**

---

## 📄 License

This project was developed for **educational and internship purposes**.
