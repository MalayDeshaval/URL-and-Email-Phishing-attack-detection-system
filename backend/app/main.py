from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import os
from datetime import timedelta
from typing import List

import models, schemas, auth, database, scanner_service, ai_engine

# Initialize Database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="AI-Powered Phishing Detection API",
    root_path="/api" if os.environ.get("VERCEL") else ""
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
@app.get("/api/ping")
async def ping():
    return {"status": "online"}

@app.post("/register", response_model=schemas.User)
@app.post("/api/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    try:
        # Check username
        if db.query(models.User).filter(models.User.username == user.username).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Check email
        if db.query(models.User).filter(models.User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
            
        hashed_password = auth.get_password_hash(user.password)
        db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print("UNEXPECTED ERROR DURING REGISTRATION:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/token", response_model=schemas.Token)
@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/scan/url", response_model=schemas.Scan)
@app.post("/api/scan/url", response_model=schemas.Scan)
def scan_url(request: schemas.ScanRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ... (rest of the code similar)
@app.post("/scan/email", response_model=schemas.Scan)
@app.post("/api/scan/email", response_model=schemas.Scan)
def scan_email(request: schemas.ScanRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ...
@app.get("/scans", response_model=List[schemas.Scan])
@app.get("/api/scans", response_model=List[schemas.Scan])
def list_scans(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ...
@app.get("/stats")
@app.get("/api/stats")
def get_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ...
@app.delete("/scans/{scan_id}")
@app.delete("/api/scans/{scan_id}")
def delete_scan(scan_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ...
@app.delete("/scans")
@app.delete("/api/scans")
def clear_history(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
# ...
@app.put("/user/password")
@app.put("/api/user/password")
def update_password(update: schemas.UserPasswordUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not auth.verify_password(update.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    current_user.hashed_password = auth.get_password_hash(update.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
