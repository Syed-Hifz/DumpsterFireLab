from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route('/')
def index():
    """Serve the main application page"""
    return app.send_static_file('index.html')

@app.route('/api/roll', methods=['POST'])
def roll_dice():
    """Roll the dice and return the result"""
    number = random.randint(1, 6)
    is_fire = number % 2 == 1  # Odd numbers (1, 3, 5) are fire
    
    return jsonify({
        'number': number,
        'is_fire': is_fire,
        'message': '🔥 It\'s a Dumpster Fire! 🔥' if is_fire else '✅ Safe for Now!'
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8000)
