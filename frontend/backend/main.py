from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from typing import Optional
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Text Similarity API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = None


@app.on_event("startup")
async def load_model():
    global model
    model = SentenceTransformer('all-mpnet-base-v2')
    print("Model loaded successfully!")


# Request models
class SimilarityRequest(BaseModel):
    context_text: str
    user_text: str
    threshold: Optional[float] = 0.4


class SimilarityResponse(BaseModel):
    score: float
    passes_threshold: bool
    threshold: float


# Endpoints
@app.get("/")
async def root():
    return {
        "message": "Text Similarity API",
        "endpoints": {
            "/similarity": "POST - Calculate similarity score",
            "/check-similarity": "POST - Check if similarity meets threshold",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/similarity", response_model=SimilarityResponse)
async def calculate_similarity_endpoint(request: SimilarityRequest):
    """
    Calculate the similarity between context and user input(thier prompt).
    Returns the score and whether it passes the threshold(current Threshold is 0.4 so 40% similar).
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Encode texts
        context_vec = model.encode(request.context_text, normalize_embeddings=True)
        input_vec = model.encode(request.user_text, normalize_embeddings=True)

        # Calculate similarity
        score = util.cos_sim(context_vec, input_vec).item()
        passes_threshold = score >= request.threshold

        return SimilarityResponse(
            score=score,
            passes_threshold=passes_threshold,
            threshold=request.threshold
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating similarity: {str(e)}")


@app.post("/check-similarity")
async def check_similarity_endpoint(request: SimilarityRequest):
    """
    Check if similarity between texts meets the threshold.
    Returns a boolean result.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        context_vec = model.encode(request.context_text, normalize_embeddings=True)
        input_vec = model.encode(request.user_text, normalize_embeddings=True)

        score = util.cos_sim(context_vec, input_vec).item()
        passes = score >= request.threshold

        return {
            "passes_threshold": passes,
            "score": score,
            "threshold": request.threshold
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking similarity: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)