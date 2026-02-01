
import re
import os

def extract_image_urls(html_file_paths):
    image_urls = set()
    # Regex to find URLs from static.wixstatic.com/media/ or static.parastorage.com/services/
    # that end with common image extensions
    # It also captures the full URL within the src or url attribute
    pattern = re.compile(r'(?:src|url)=["\'](https?:\/\/(?:static\.wixstatic\.com\/media\/|static\.parastorage\.com\/services\/[^\/]+\/media\/)[^"\\]+\.(?:png|jpg|jpeg|gif|svg|webp))["\']')

    for file_path in html_file_paths:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = pattern.findall(content)
                for url in matches:
                    image_urls.add(url)
        except Exception as e:
            print(f"Error reading file {file_path}: {e}")
    return sorted(list(image_urls))

if __name__ == "__main__":
    # The list of HTML files obtained from the previous step
    html_files = [
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\cards\\01.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\cards\\02.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\cards\\04.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\america-peliculas.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\barber-shop.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\prenomental.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\proeduca.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\servicos.html",
        r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\legancy\\sobre.html"
    ]

    extracted_urls = extract_image_urls(html_files)
    if extracted_urls:
        print("Extracted Image URLs:")
        for url in extracted_urls:
            print(url)
    else:
        print("No image URLs found.")

    # Save the extracted URLs to a file for later use
    output_dir = r"C:\\Users\\claudin viado\\Documents\\projetos\\portifolio\\.gemini\\tmp\\3ae8e8441e7022fa4916e81c20cfad542ef5e43ec3932ae7623411c1f3f9f39c"
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "extracted_image_urls.txt"), "w", encoding="utf-8") as f:
        for url in extracted_urls:
            f.write(url + "\n")
    print(f"\nExtracted URLs saved to {os.path.join(output_dir, 'extracted_image_urls.txt')}")
