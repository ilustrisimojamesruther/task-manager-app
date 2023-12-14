from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="james",
    database="taskmanager"
)

cursor = db.cursor()

# Create a task
@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        query = "INSERT INTO tasks (title, description, due_date, user_id) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (data['title'], data['description'], data['due_date'], data['user_id']))
        db.commit()

        # Get the ID of the last inserted row
        task_id = cursor.lastrowid

        # Fetch the newly created task
        cursor.execute("SELECT * FROM tasks WHERE task_id = %s", (task_id,))
        result = cursor.fetchone()
        new_task = {
            "task_id": result[0],
            "title": result[1],
            "description": result[2],
            "due_date": result[3],
            "status": result[4],
        }

        return jsonify({"message": "Task created successfully", "task": new_task}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Read tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        cursor.execute("SELECT * FROM tasks")
        result = cursor.fetchall()
        tasks = [{"task_id": row[0], "title": row[1], "description": row[2], "due_date": row[3], "status": row[4]} for row in result]
        return jsonify({"tasks": tasks})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        query = "UPDATE tasks SET title=%s, description=%s, due_date=%s, status=%s WHERE task_id=%s"
        cursor.execute(query, (data['title'], data['description'], data['due_date'], data['status'], task_id))
        db.commit()
        return jsonify({"message": "Task updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Mark a task as completed
@app.route('/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    try:
        cursor.execute("UPDATE tasks SET status='completed' WHERE task_id=%s", (task_id,))
        db.commit()
        return jsonify({"message": "Task marked as completed"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        cursor.execute("DELETE FROM tasks WHERE task_id=%s", (task_id,))
        db.commit()
        return jsonify({"message": "Task deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Task Manager"})


if __name__ == '__main__':
    app.run(debug=True)
