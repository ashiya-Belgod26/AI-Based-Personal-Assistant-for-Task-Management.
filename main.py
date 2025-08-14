from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, SentimentOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; change to your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IBM Watson credentials
api_key = os.getenv("IBM_API_KEY")
url = os.getenv("IBM_URL")

authenticator = IAMAuthenticator(api_key)
nlu = NaturalLanguageUnderstandingV1(
    version='2021-08-01',
    authenticator=authenticator
)
nlu.set_service_url(url)

@app.get("/")
def root():
    return {"message": "FastAPI IBM NLU is running!"}

@app.post("/analyze")
async def analyze_text(request: Request):
    data = await request.json()
    text_to_analyze = data.get("text", "")

    if not text_to_analyze.strip():
        return {"error": "No text provided"}

    try:
        response = nlu.analyze(
            text=text_to_analyze,
            features=Features(sentiment=SentimentOptions())
        ).get_result()

        return {"status": "success", "analysis": response}

    except Exception as e:
        return {"status": "error", "message": str(e)}
