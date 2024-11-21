from flask import Flask, request, jsonify
from flask_cors import CORS  # Importuj Flask-CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)  # Włącz obsługę CORS dla wszystkich endpointów

# Funkcja łączenia z bazą danych
def get_db_connection():
    conn = psycopg2.connect(
        host="db",  # Nazwa usługi bazy danych w Docker Compose
        database="todo",
        user="postgres",
        password="postgres"
    )
    return conn

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    if request.method == 'POST':
        # Pobierz dane z żądania
        task = request.json.get('task')  # Sprawdź, czy to pole się zgadza z frontendem
        if not task:
            return jsonify({"error": "Task content is required"}), 400

        # Wstaw zadanie do bazy danych
        cursor.execute("INSERT INTO tasks (task) VALUES (%s) RETURNING *;", (task,))
        new_task = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(new_task), 201

    # Pobierz wszystkie zadania
    cursor.execute("SELECT * FROM tasks;")
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def modify_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    if request.method == 'PUT':
        # Pobierz dane z żądania
        task = request.json.get('task')
        if not task:
            return jsonify({"error": "Task content is required"}), 400

        # Aktualizuj zadanie w bazie danych
        cursor.execute("UPDATE tasks SET task = %s WHERE id = %s RETURNING *;", (task, task_id))
        updated_task = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        if not updated_task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(updated_task), 200

    if request.method == 'DELETE':
        # Usuń zadanie z bazy danych
        cursor.execute("DELETE FROM tasks WHERE id = %s RETURNING *;", (task_id,))
        deleted_task = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        if not deleted_task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(deleted_task), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
