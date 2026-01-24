from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from typing import Optional
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Text Similarity API", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup and global context storage
model = None
global_context = None


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


class SetContextRequest(BaseModel):
    context_text: str


class LLMInputRequest(BaseModel):
    llm_input: str
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
        "version": "2.0.0",
        "endpoints": {
            "/similarity": "POST - Calculate similarity score",
            "/check-similarity": "POST - Check if similarity meets threshold",
            "/set-context": "POST - Set global context",
            "/check-llm-input": "POST - Compare LLM input against global context",
            "/reset-context": "POST - Reset global context",
            "/get-context": "GET - View current global context",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "context_loaded": global_context is not None
    }


@app.post("/set-context")
async def set_global_context(request: SetContextRequest):
    """
    Set the global context that will be used for subsequent LLM input comparisons.
    """
    global global_context

    try:
        global_context = request.context_text
        preview = global_context[:100] + "..." if len(global_context) > 100 else global_context

        print(f"Global context set (length: {len(global_context)} chars)")

        return {
            "message": "Global context set successfully",
            "context_set": True,
            "context_preview": preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error setting context: {str(e)}")


@app.get("/get-context")
async def get_global_context():
    """
    Retrieve the current global context.
    """
    if global_context is None:
        return {
            "context_set": False,
            "message": "No global context has been set",
            "context": None
        }

    return {
        "context_set": True,
        "message": "Global context retrieved",
        "context": global_context,
        "length": len(global_context)
    }


@app.post("/reset-context")
async def reset_global_context():
    """
    Reset the global context to None.
    """
    global global_context

    global_context = None
    print("Global context reset")

    return {
        "message": "Global context reset successfully",
        "context_set": False
    }


@app.post("/check-llm-input", response_model=SimilarityResponse)
async def check_llm_input(request: LLMInputRequest):
    """
    Compare LLM input against the global context.
    Requires global context to be set first via /set-context endpoint.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if global_context is None:
        raise HTTPException(
            status_code=400,
            detail="No global context set. Please use /set-context endpoint first."
        )

    try:
        # Encode context and LLM input
        context_vec = model.encode(global_context, normalize_embeddings=True)
        input_vec = model.encode(request.llm_input, normalize_embeddings=True)

        # Calculate similarity
        score = util.cos_sim(context_vec, input_vec).item()
        passes_threshold = score >= request.threshold

        print(f"LLM input check: score={score:.4f}, passes={passes_threshold}")

        return SimilarityResponse(
            score=score,
            passes_threshold=passes_threshold,
            threshold=request.threshold
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking LLM input: {str(e)}")


@app.post("/similarity", response_model=SimilarityResponse)
async def calculate_similarity_endpoint(request: SimilarityRequest):
    """
    Calculate the similarity between context and user input (their prompt).
    Returns the score and whether it passes the threshold (current Threshold is 0.4 so 40% similar).
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