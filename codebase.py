from pathlib import Path

# Define the root directory and output file
ROOT = Path(__file__).parent  # Assumes the script is in the project root
OUTPUT_FILE = ROOT / 'project_structure.txt'

# Specify subdirectories to include in the scan
SUBDIRS_TO_SCAN = ['actions', 'app', 'components', 'lib', 'hooks']  # Adjust these as needed

# Open the output file in write mode
with open(OUTPUT_FILE, 'w') as f:
    # Walk through each specified subdirectory
    for subdir in SUBDIRS_TO_SCAN:
        subdir_path = ROOT / subdir
        for file_path in subdir_path.rglob('*.js*'):  # Matches .js and .jsx files
            if file_path.suffix in {'.js', '.jsx'}:  # Ensure the file has the correct extension
                # Get the relative path
                relative_path = file_path.relative_to(ROOT)
                # Write the relative path as a header
                f.write(f'\n\n# {relative_path}\n\n')
                # Read and write the file content
                with file_path.open('r') as content_file:
                    f.write(content_file.read())
