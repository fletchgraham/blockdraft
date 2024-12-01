from pathlib import Path

# Define the root directory and output file
ROOT = Path(__file__).parent  # Assumes the script is in the project root
OUTPUT_FILE = ROOT / 'project_structure.txt'

# Specify subdirectories to include in the scan
SUBDIRS_TO_SCAN = ['actions', 'app', 'components', 'hooks', 'lib', 'public']  # Adjust these as needed

# Open the output file in write mode
with open(OUTPUT_FILE, 'w') as f:
    # Walk through each specified subdirectory
    for subdir in SUBDIRS_TO_SCAN:
        subdir_path = ROOT / subdir
        if subdir_path.exists():
            f.write(f"\n{subdir.upper()}:\n")  # Header for the subdirectory
            for file_path in subdir_path.rglob('*'):  # Matches all files and folders
                relative_path = file_path.relative_to(ROOT)
                if file_path.is_file():
                    f.write(f"  [F] {relative_path}\n")  # Indicate it's a file
                elif file_path.is_dir():
                    f.write(f"  [D] {relative_path}/\n")  # Indicate it's a directory
