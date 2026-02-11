from flask import Flask, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/roll', methods=['POST'])
def roll_dice():
    number = random.randint(1, 6)
    is_fire = number % 2 == 1
    
    return jsonify({
        'number': number,
        'is_fire': is_fire,
        'message': '🔥 It\'s a Dumpster Fire! 🔥' if is_fire else '✅ Safe for Now!'
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8000)