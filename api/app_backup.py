from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/ping")
@app.get("/ping")
async def ping():
    return {"status": "debug_mode_active", "message": "Base routing is working"}

@app.post("/api/register")
@app.post("/register")
async def debug_register():
    return {"message": "Debug register reached"}

@app.get("/api/debug")
async def debug():
    import sys
    import os
    return {
        "python_version": sys.version,
        "cwd": os.getcwd(),
        "files_in_api": os.listdir("api") if os.path.exists("api") else "api folder not found",
        "env_vercel": os.environ.get("VERCEL", "not_set")
    }
