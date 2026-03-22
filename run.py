import subprocess
import os
import sys
import time

def start_services():
    print("--- PhishGuard AI Multi-Service Runner ---")
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Start Backend
    print("[1/2] Launching Backend API...")
    backend_cmd = [sys.executable, os.path.join(root_dir, "backend", "app", "main.py")]
    backend_proc = subprocess.Popen(backend_cmd)
    
    # 2. Start Frontend
    print("[2/2] Launching Frontend (Vite)...")
    frontend_dir = root_dir
    # shell=True is needed for npm on Windows
    frontend_proc = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir, shell=True)
    
    print("\nSUCCESS: All services are running.")
    print(f"API: http://localhost:8000")
    print(f"UI:  http://localhost:5173")
    print("\nPress Ctrl+C to stop all services.")
    
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend process stopped. Exiting.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend process stopped. Exiting.")
                break
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    start_services()
