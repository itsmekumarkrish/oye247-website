import os
import re

old_footer_links = """                <div class="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Legal</h4>
                    <ul>"""

new_footer_links = """                <div class="footer-links">
                    <h4>Support & Legal</h4>
                    <ul>
                        <li><a href="/contact">Contact Us</a></li>"""

files_to_update = [
    'index.html',
    'privacy-policy.html',
    'terms-of-service.html',
    'refund-policy.html',
    'disclaimer.html',
    'contact.html',
    'gen_legal.py'
]

for filepath in files_to_update:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace(old_footer_links, new_footer_links)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
