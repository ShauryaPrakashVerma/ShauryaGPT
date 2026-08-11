from flask import Flask, render_template, request, jsonify
from Resume import ask_llm

app = Flask(__name__)


@app.route("/", methods=["GET","POST"])
def home():
    return render_template("index.html")


@app.route("/chat", methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    answer = ask_llm(user_prompt=user_message)
    print(answer)
    return jsonify({
        "response": answer
    })



if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)