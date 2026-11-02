import os
import sys
import zipfile
import io
import requests

REPO = "siddebug/screenshot-to-sight-and-sound"
TARGET_DIR = r"C:\Users\SIDDHARTH GAJJAR\.gemini\antigravity\scratch\Medicate"
TOKEN_PATH = r"C:\Users\SIDDHARTH GAJJAR\Downloads\gabru.txt"

def get_token():
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, "r", encoding="utf-8") as f:
            token = f.read().strip()
            if token:
                print(f"Read token from {TOKEN_PATH} (Length: {len(token)})")
                return token
    return None

def pull_repo():
    token = get_token()
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    else:
        print("[Warning] No token found in gabru.txt!")

    print(f"Checking repository {REPO} via GitHub API...")
    api_url = f"https://api.github.com/repos/{REPO}"
    res = requests.get(api_url, headers=headers)

    if res.status_code == 404:
        print(f"\n[Error] Repository {REPO} returned 404 Not Found.")
        print("Please check that the token has permission to access this repository.")
        return False
    elif res.status_code != 200:
        print(f"\n[Error] GitHub API returned status {res.status_code}: {res.text}")
        return False

    repo_data = res.json()
    default_branch = repo_data.get("default_branch", "main")
    print(f"Connected to repo successfully! Default branch: '{default_branch}'")

    zip_url = f"https://api.github.com/repos/{REPO}/zipball/{default_branch}"
    print(f"Downloading repository zipball from {zip_url}...")
    zip_res = requests.get(zip_url, headers=headers)

    if zip_res.status_code != 200:
        print(f"Failed to download archive: {zip_res.status_code}")
        return False

    print(f"Downloaded {len(zip_res.content)} bytes. Extracting to {TARGET_DIR}...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    extracted_files = []
    with zipfile.ZipFile(io.BytesIO(zip_res.content)) as z:
        namelist = z.namelist()
        if not namelist:
            print("[Warning] The repository zip is empty.")
            return False
            
        root_folder = namelist[0].split('/')[0]
        for member in z.infolist():
            if member.filename.startswith(root_folder + '/'):
                rel_path = member.filename[len(root_folder) + 1:]
                if not rel_path:
                    continue
                target_path = os.path.join(TARGET_DIR, rel_path.replace('/', os.sep))
                if member.is_dir():
                    os.makedirs(target_path, exist_ok=True)
                else:
                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                    with open(target_path, 'wb') as f:
                        f.write(z.read(member.filename))
                    extracted_files.append(rel_path)

    print(f"\n[SUCCESS] Successfully synced {len(extracted_files)} files into {TARGET_DIR}!")
    for f in extracted_files[:15]:
        print(f"  + {f}")
    if len(extracted_files) > 15:
        print(f"  ... and {len(extracted_files) - 15} more files.")
    return True

if __name__ == "__main__":
    pull_repo()
