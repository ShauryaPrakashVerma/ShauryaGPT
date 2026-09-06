from flask import Flask, render_template, request, jsonify
from Backend.Resume import ask_llm
from flask import request, Response, stream_with_context


app = Flask(__name__)


@app.route("/", methods=["GET","POST"])
def home():
    return render_template("index.html")




@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return {
            "error": "Message is required"
        }, 400

    @stream_with_context
    def generate():
        try:
            for chunk in ask_llm(user_message):
                yield chunk

        except Exception as e:
            print("LLM error:", e)
            yield "\nSorry, something went wrong."

    return Response(
        generate(),
        mimetype="text/plain"
    )


if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)