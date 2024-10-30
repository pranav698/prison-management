from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Replace with your MySQL username
    password="pranav77",  # Replace with your MySQL password
    database="prison_management"
)
cursor = db.cursor(dictionary=True)  # To return results as dictionaries

# Route for getting types of crimes and their counts
@app.route('/crime-types', methods=['GET'])
def get_crime_types():
    try:
        cursor.execute("""
            SELECT crime, COUNT(*) as count
            FROM inmates_crime_details
            GROUP BY crime
        """)
        crime_types = cursor.fetchall()
        return jsonify(crime_types), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500

# Route for getting total visitor count
@app.route('/visitor-count', methods=['GET'])
def get_total_visitor_count():
    try:
        cursor.execute("SELECT COUNT(*) as total_visitors FROM visitor_details")
        total_visitors = cursor.fetchone()
        return jsonify({"total_visitors": total_visitors['total_visitors']}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500

# Route for getting total inmate count
@app.route('/inmates-count', methods=['GET'])
def get_total_inmates():
    try:
        cursor.execute("SELECT COUNT(*) as total_inmates FROM inmates_details")
        total_inmates = cursor.fetchone()
        return jsonify({"total_inmates": total_inmates['total_inmates']}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500

@app.route('/query', methods=['POST'])
def run_query():
    try:
        question = request.json.get('question')
        if not question:
            return jsonify({"error": "Question is required"}), 400

        if question == "Get all inmates":
            cursor.execute("SELECT name, admission_date, release_date FROM inmates_details")
            data = cursor.fetchall()
            return jsonify(data), 200

        elif question == "Get all visitors":
            cursor.execute("SELECT DISTINCT name, visit_date FROM visitor_details")
            data = cursor.fetchall()
            return jsonify(data), 200

        elif question == "Get crime types":
            cursor.execute("SELECT DISTINCT crime FROM inmates_crime_details")
            data = cursor.fetchall()
            return jsonify(data), 200

        # General query handling using query_bank table
        else:
            cursor.execute("SELECT sql_query FROM query_bank WHERE question = %s", (question,))
            result = cursor.fetchone()

            if not result:
                return jsonify({"error": "No matching query found for the given question"}), 404

            query_to_execute = result['sql_query']
            cursor.execute(query_to_execute)
            data = cursor.fetchall()
            return jsonify(data), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
