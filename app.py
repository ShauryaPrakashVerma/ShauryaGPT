from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


@app.route("/", methods=["GET","POST"])
def home():
    return render_template("index.html")


@app.route("/chat", methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    print("User:", user_message)
    return jsonify({
        "response": user_message
    })



if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)