from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "traceback": traceback.format_exc()}
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
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    result, confidence = scanner_service.scanner_service.scan_url(request.url, request.deep_scan)
    explanation = ai_engine.ai_engine.get_explanation("url", request.url, result)
    
    db_scan = models.Scan(
        type="url",
        target=request.url,
        result=result,
        confidence=confidence,
        explanation=explanation,
        owner_id=current_user.id
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

@app.post("/scan/email", response_model=schemas.Scan)
@app.post("/api/scan/email", response_model=schemas.Scan)
def scan_email(request: schemas.ScanRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not request.email_text:
        raise HTTPException(status_code=400, detail="Email text is required")
    
    result, confidence = scanner_service.scanner_service.scan_email(request.email_text, request.deep_scan)
    explanation = ai_engine.ai_engine.get_explanation("email", request.email_text, result)
    
    db_scan = models.Scan(
        type="email",
        target=request.email_text,
        result=result,
        confidence=confidence,
        explanation=explanation,
        owner_id=current_user.id
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

@app.get("/scans", response_model=List[schemas.Scan])
@app.get("/api/scans", response_model=List[schemas.Scan])
def list_scans(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Scan).filter(models.Scan.owner_id == current_user.id).order_by(models.Scan.created_at.desc()).all()

@app.get("/stats")
@app.get("/api/stats")
def get_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    scans = db.query(models.Scan).filter(models.Scan.owner_id == current_user.id).all()
    total = len(scans)
    phishing = len([s for s in scans if s.result == "phishing"])
    safe = len([s for s in scans if s.result == "safe"])
    suspicious = total - phishing - safe
    
    return {
        "total_scans": total,
        "phishing_detected": phishing,
        "safe_detected": safe,
        "suspicious_detected": suspicious
    }

@app.delete("/scans/{scan_id}")
@app.delete("/api/scans/{scan_id}")
def delete_scan(scan_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    scan = db.query(models.Scan).filter(models.Scan.id == scan_id, models.Scan.owner_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    db.delete(scan)
    db.commit()
    return {"message": "Scan deleted"}

@app.delete("/scans")
@app.delete("/api/scans")
def clear_history(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db.query(models.Scan).filter(models.Scan.owner_id == current_user.id).delete()
    db.commit()
    return {"message": "History cleared"}

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
