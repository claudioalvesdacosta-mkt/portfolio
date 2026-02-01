import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def migrate_html_file(legacy_html_path, migrated_html_path):
    # Read the legacy HTML file
    with open(legacy_html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all <img> tags and update their src attributes
    for img_tag in soup.find_all('img'):
        if img_tag.has_attr('src'):
            src = img_tag['src']
            if 'wixstatic.com' in src or 'parastorage.com' in src:
                # Extract filename from URL
                parsed_url = urlparse(src)
                filename = os.path.basename(parsed_url.path)
                
                # Check for ~mv2 in the filename and handle it
                if '~mv2' in filename:
                    base_filename = filename.split('~mv2')[0]
                    # Find the corresponding downloaded file (could be .png, .jpg, etc.)
                    legacy_dir = r"C:\Users\claudin viado\Documents\projetos\portifolio\assets\img\legacy"
                    found_file = None
                    for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
                        # The downloaded files have the ~mv2 part in their names
                        full_filename_to_check = filename
                        if os.path.exists(os.path.join(legacy_dir, full_filename_to_check)):
                            found_file = full_filename_to_check
                            break

                    if found_file:
                        new_src = f'assets/img/legacy/{found_file}'
                        print(f'Replacing {src} with {new_src}')
                        img_tag['src'] = new_src
                    else:
                        print(f"Warning: Could not find a match for {filename} in the legacy folder.")

    # Find elements with background-image styles and update them
    for element in soup.find_all(style=True):
        style = element['style']
        if 'background-image' in style and ('wixstatic.com' in style or 'parastorage.com' in style):
            # Extract the URL from the style attribute
            url_start = style.find('url(')
            if url_start != -1:
                url_end = style.find(')', url_start)
                if url_end != -1:
                    url = style[url_start + 4:url_end].strip('\'"')
                    
                    # Extract filename from URL
                    parsed_url = urlparse(url)
                    filename = os.path.basename(parsed_url.path)
                    
                    if '~mv2' in filename:
                        # Find the corresponding downloaded file
                        legacy_dir = r"C:\Users\claudin viado\Documents\projetos\portifolio\assets\img\legacy"
                        found_file = None
                        for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
                            full_filename_to_check = filename
                            if os.path.exists(os.path.join(legacy_dir, full_filename_to_check)):
                                found_file = full_filename_to_check
                                break
                        
                        if found_file:
                            new_url = f'assets/img/legacy/{found_file}'
                            print(f'Replacing background-image URL {url} with {new_url}')
                            element['style'] = style.replace(url, new_url)
                        else:
                            print(f"Warning: Could not find a match for background-image {filename} in the legacy folder.")


    # Save the modified HTML to a new file
    with open(migrated_html_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    print(f"Successfully migrated {legacy_html_path} to {migrated_html_path}")

if __name__ == "__main__":
    legacy_file = r"legancy/america-peliculas.html"
    migrated_file = r"america-peliculas-migrated.html"
    migrate_html_file(legacy_file, migrated_file)

    # Migrate all other HTML files in the legancy directory
    legacy_dir = "legancy"
    for filename in os.listdir(legacy_dir):
        if filename.endswith(".html") and filename != "america-peliculas.html":
            legacy_path = os.path.join(legacy_dir, filename)
            migrated_path = f"{os.path.splitext(filename)[0]}-migrated.html"
            migrate_html_file(legacy_path, migrated_path)

    # Migrate all HTML files in the legancy/cards directory
    legacy_cards_dir = "legancy/cards"
    if os.path.exists(legacy_cards_dir):
        for filename in os.listdir(legacy_cards_dir):
            if filename.endswith(".html"):
                legacy_path = os.path.join(legacy_cards_dir, filename)
                migrated_path = f"cards-{os.path.splitext(filename)[0]}-migrated.html"
                migrate_html_file(legacy_path, migrated_path)
