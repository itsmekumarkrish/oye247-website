import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False

    # Perform replacements
    new_content = content.replace('NexAI', 'Oye247')
    new_content = new_content.replace('nexai', 'oye247')
    new_content = new_content.replace('NEXAI', 'OYE247')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    skip_dirs = {'.git', 'node_modules'}
    skip_exts = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pyc'}
    
    updated_files = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in skip_exts:
                continue
                
            filepath = os.path.join(root, file)
            # Skip this script itself
            if 'rename.py' in filepath:
                continue
                
            if replace_in_file(filepath):
                updated_files.append(filepath)
                
    for f in updated_files:
        print(f"Updated: {f}")

if __name__ == '__main__':
    main()
