
from flask import Flask, request, jsonify, session
from flask_cors import CORS

from db import get_connection
from auth import hash_password, verify_password


app = Flask(__name__)

# Secret key for login sessions
app.secret_key = "smart-task-management-secret-key"

CORS(app, supports_credentials=True)

# ==========================================
# HOME / API STATUS
# ==========================================

@app.route("/")
def home():
    return {
        "message": "Smart Task Management System API is running!",
        "status": "success"
    }


# ==========================================
# REGISTER
# ==========================================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Full name, email and password are required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters"
        }), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT UserID FROM Users WHERE Email = ?",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

        password_hash = hash_password(password)

        cursor.execute(
            """
            INSERT INTO Users (FullName, Email, PasswordHash)
            VALUES (?, ?, ?)
            """,
            (full_name, email, password_hash)
        )

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Registration failed",
            "error": str(e)
        }), 500


# ==========================================
# LOGIN
# ==========================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT UserID, FullName, Email, PasswordHash
            FROM Users
            WHERE Email = ?
            """,
            (email,)
        )

        user = cursor.fetchone()

        connection.close()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        user_id = user[0]
        full_name = user[1]
        user_email = user[2]
        password_hash = user[3]

        if not verify_password(password, password_hash):
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        session["user_id"] = user_id
        session["full_name"] = full_name
        session["email"] = user_email

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "userId": user_id,
                "fullName": full_name,
                "email": user_email
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Login failed",
            "error": str(e)
        }), 500


# ==========================================
# CURRENT LOGGED-IN USER
# ==========================================

@app.route("/api/me", methods=["GET"])
def current_user():

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "User is not logged in"
        }), 401

    return jsonify({
        "success": True,
        "user": {
            "userId": session["user_id"],
            "fullName": session["full_name"],
            "email": session["email"]
        }
    }), 200


# ==========================================
# LOGOUT
# ==========================================

@app.route("/api/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logout successful"
    }), 200


# ==========================================
# ADD TASK
# ==========================================

@app.route("/api/tasks", methods=["POST"])
def add_task():

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    title = data.get("title")
    description = data.get("description")
    category = data.get("category")
    priority = data.get("priority", "Medium")
    due_date = data.get("dueDate")

    if not title:
        return jsonify({
            "success": False,
            "message": "Task title is required"
        }), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO Tasks
            (UserID, Title, Description, Category, Priority, DueDate)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                session["user_id"],
                title,
                description,
                category,
                priority,
                due_date
            )
        )

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Task added successfully"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to add task",
            "error": str(e)
        }), 500


# ==========================================
# VIEW TASKS
# ==========================================

@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT TaskID,
                   Title,
                   Description,
                   Category,
                   Priority,
                   DueDate,
                   Status,
                   Progress,
                   ProgressNotes,
                   CreatedAt,
                   UpdatedAt
            FROM Tasks
            WHERE UserID = ?
            ORDER BY CreatedAt DESC
            """,
            (session["user_id"],)
        )

        rows = cursor.fetchall()
        connection.close()

        tasks = []

        for row in rows:
            tasks.append({
                "taskId": row[0],
                "title": row[1],
                "description": row[2],
                "category": row[3],
                "priority": row[4],
                "dueDate": str(row[5]) if row[5] else None,
                "status": row[6],
                "progress": row[7] if row[7] is not None else 0,
                "progressNotes": row[8] if row[8] else "",
                "createdAt": str(row[9]) if row[9] else None,
                "updatedAt": str(row[10]) if row[10] else None
            })

        return jsonify({
            "success": True,
            "tasks": tasks
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to fetch tasks",
            "error": str(e)
        }), 500


# ==========================================
# UPDATE TASK
# ==========================================

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Get current task first
        cursor.execute(
            """
            SELECT Title,
                   Description,
                   Category,
                   Priority,
                   DueDate,
                   Status,
                   Progress,
                   ProgressNotes
            FROM Tasks
            WHERE TaskID = ?
            AND UserID = ?
            """,
            (task_id, session["user_id"])
        )

        current_task = cursor.fetchone()

        if not current_task:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        # Existing values
        title = data.get("title", current_task[0])
        description = data.get("description", current_task[1])
        category = data.get("category", current_task[2])
        priority = data.get("priority", current_task[3])
        due_date = data.get("dueDate", current_task[4])
        status = data.get("status", current_task[5])

        progress = data.get(
            "progress",
            current_task[6] if current_task[6] is not None else 0
        )

        progress_notes = data.get(
            "progressNotes",
            current_task[7]
        )

        # Validate progress
        try:
            progress = int(progress)
        except (ValueError, TypeError):
            connection.close()

            return jsonify({
                "success": False,
                "message": "Progress must be a number between 0 and 100"
            }), 400

        if progress < 0 or progress > 100:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Progress must be between 0 and 100"
            }), 400

        # Automatically update status according to progress
        if progress == 100:
            status = "Completed"
        elif progress > 0 and status != "Completed":
            status = "In Progress"
        elif progress == 0 and status != "Completed":
            status = "Pending"

        cursor.execute(
            """
            UPDATE Tasks
            SET Title = ?,
                Description = ?,
                Category = ?,
                Priority = ?,
                DueDate = ?,
                Status = ?,
                Progress = ?,
                ProgressNotes = ?,
                UpdatedAt = GETDATE()
            WHERE TaskID = ?
            AND UserID = ?
            """,
            (
                title,
                description,
                category,
                priority,
                due_date,
                status,
                progress,
                progress_notes,
                task_id,
                session["user_id"]
            )
        )

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Task updated successfully",
            "task": {
                "taskId": task_id,
                "status": status,
                "progress": progress,
                "progressNotes": progress_notes
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to update task",
            "error": str(e)
        }), 500


# ==========================================
# DELETE TASK
# ==========================================

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM Tasks
            WHERE TaskID = ?
            AND UserID = ?
            """,
            (task_id, session["user_id"])
        )

        if cursor.rowcount == 0:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Task deleted successfully"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to delete task",
            "error": str(e)
        }), 500


# ==========================================
# MARK TASK AS COMPLETE
# ==========================================

@app.route("/api/tasks/<int:task_id>/complete", methods=["PUT"])
def complete_task(task_id):

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE Tasks
            SET Status = 'Completed',
                Progress = 100,
                UpdatedAt = GETDATE()
            WHERE TaskID = ?
            AND UserID = ?
            """,
            (task_id, session["user_id"])
        )

        if cursor.rowcount == 0:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Task marked as completed"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to complete task",
            "error": str(e)
        }), 500


# ==========================================
# TASK DASHBOARD STATISTICS
# ==========================================

@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                COUNT(*) AS TotalTasks,

                SUM(
                    CASE
                        WHEN Status = 'Completed'
                        THEN 1
                        ELSE 0
                    END
                ) AS CompletedTasks,

                SUM(
                    CASE
                        WHEN Status IN ('Pending', 'In Progress')
                        THEN 1
                        ELSE 0
                    END
                ) AS PendingTasks,

                SUM(
                    CASE
                        WHEN Status IN ('Pending', 'In Progress')
                        AND DueDate < CAST(GETDATE() AS DATE)
                        THEN 1
                        ELSE 0
                    END
                ) AS OverdueTasks

            FROM Tasks
            WHERE UserID = ?
            """,
            (session["user_id"],)
        )

        result = cursor.fetchone()
        connection.close()

        total_tasks = result[0] or 0
        completed_tasks = result[1] or 0
        pending_tasks = result[2] or 0
        overdue_tasks = result[3] or 0

        if total_tasks > 0:
            completion_percentage = round(
                (completed_tasks / total_tasks) * 100,
                2
            )
        else:
            completion_percentage = 0

        return jsonify({
            "success": True,
            "dashboard": {
                "totalTasks": total_tasks,
                "completedTasks": completed_tasks,
                "pendingTasks": pending_tasks,
                "overdueTasks": overdue_tasks,
                "completionPercentage": completion_percentage
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to load dashboard",
            "error": str(e)
        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)

