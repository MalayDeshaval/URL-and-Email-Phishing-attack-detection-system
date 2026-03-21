from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/ping")
@app.get("/ping")
async def ping():
    return {"status": "debug_mode_active", "message": "Base routing is working"}

@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def catch_all(path_name: str):
    return {
        "message": "Catch-all reached",
        "path": path_name,
        "debug": "If you see this, connectivity is fixed!"
    }
