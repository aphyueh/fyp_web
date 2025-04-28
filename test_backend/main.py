from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import storage
import uuid


app = Flask(__name__)
CORS(app)  

BUCKET_NAME = "cityscapes-dataset-package3"

storage_client = storage.Client()

def upload_to_bucket(bucket_name, file_obj, destination_blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_file(file_obj, content_type=file_obj.content_type)
    blob.make_public()  # 👈 Optional: makes it publicly accessible
    return blob.public_url

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Python on Cloud Run!"})

@app.route('/api/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    filename = f"{uuid.uuid4()}_{image.filename}"
    before_url = upload_to_bucket(BUCKET_NAME, image, f"uploads/{filename}")

    after_url = before_url

    # For testing: you can return the same image URL as both before & after
    return jsonify({
        'before_url': before_url,
        'after_url': after_url
    })

if __name__ == "__main__":
    app.run(debug=True)
