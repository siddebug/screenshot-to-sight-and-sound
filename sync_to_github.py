"""
Full Repository Sync Utility for Medicate
Pushes the entire standalone codebase to a target GitHub repository.
"""

import os
import sys
import base64
import requests

DEFAULT_REPO = "siddebug/Medicate"
BRANCH = "main"
TOKEN_PATH = r"C:\Users\SIDDHARTH GAJJAR\Downloads\gabru.txt"
PROJECT_DIR = r"C:\Users\SIDDHARTH GAJJAR\.gemini\antigravity\scratch\Medicate"

EXCLUDE_DIRS = {".git", ".lovable", "node_modules", "dist", ".vite", "__pycache__"}
EXCLUDE_FILES = {".DS_Store", "mingit.zip"}

def get_token():
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, "r", encoding="utf-8") as f:
            return f.read().strip()
    return None

def get_all_project_files():
    file_list = []
    for root, dirs, files in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f in EXCLUDE_FILES or f.endswith(".pyc"):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, PROJECT_DIR).replace("\\", "/")
            file_list.append(rel_path)
    return sorted(file_list)

def push_project_to_repo(repo_name: str = DEFAULT_REPO):
    token = get_token()
    if not token:
        print("[Error] No token found in gabru.txt")
        return False

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json"
    }

    print(f"Target repository: https://github.com/{repo_name}")
    
    # Check if repo exists
    repo_res = requests.get(f"https://api.github.com/repos/{repo_name}", headers=headers)
    if repo_res.status_code == 404:
        print(f"[Notice] Repository '{repo_name}' not found yet.")
        print("Please create the empty repository on GitHub first at https://github.com/new")
        return False
    elif repo_res.status_code != 200:
        print(f"[Error] Repository check returned {repo_res.status_code}: {repo_res.text}")
        return False

    all_files = get_all_project_files()
    print(f"Discovered {len(all_files)} files to upload...")

    # Upload files using standard contents API
    success_count = 0
    for rel_path in all_files:
        full_path = os.path.join(PROJECT_DIR, rel_path)
        api_url = f"https://api.github.com/repos/{repo_name}/contents/{rel_path}"

        sha = None
        get_res = requests.get(api_url, headers=headers, params={"ref": BRANCH})
        if get_res.status_code == 200:
            sha = get_res.json().get("sha")

        with open(full_path, "rb") as f:
            content_b64 = base64.b64encode(f.read()).decode("utf-8")

        payload = {
            "message": f"feat(init): add {os.path.basename(rel_path)}",
            "content": content_b64,
            "branch": BRANCH
        }
        if sha:
            payload["sha"] = sha

        put_res = requests.put(api_url, headers=headers, json=payload)
        if put_res.status_code in [200, 201]:
            print(f"  [OK] Uploaded {rel_path}")
            success_count += 1
        else:
            print(f"  [FAIL] {rel_path}: {put_res.status_code} {put_res.text[:100]}")

    print(f"\n[DONE] Successfully uploaded {success_count}/{len(all_files)} files to https://github.com/{repo_name}!")
    return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_REPO
    push_project_to_repo(target)
