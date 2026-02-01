import re
import os

def get_base_image_urls(url_list):
    base_urls = set()
    for url in url_list:
        # Corrected regex to extract the base part of the URL before /v1/ or any query parameters
        # Ensure the pattern is on a single line and correctly escaped
        match = re.search(r'(https?://(?:static.wixstatic.com/media/|static.parastorage.com/services/[^/]+/media/)([^?/]+))', url)
        if match:
            # The base URL is match.group(1) + filename
            base_filename = match.group(2)
            # Reconstruct a cleaner base URL without the /v1/ and parameters
            clean_url_match = re.search(r'(https?://(?:static.wixstatic.com/media/|static.parastorage.com/services/[^/]+/media/)[^/]+/)([^?/]+(?:.png|.jpg|.jpeg|.gif|.svg|.webp))', url)
            if clean_url_match:
                base_urls.add(clean_url_match.group(1) + clean_url_match.group(2))
            else:
                base_urls.add(match.group(0)) # Fallback to the full match if clean_url_match fails
        else:
            # If the URL doesn't fit the pattern, add the original URL to avoid losing it
            base_urls.add(url.split('?')[0].split('/v1/')[0]) # Attempt to clean up common Wix/Parastorage patterns
    return sorted(list(base_urls))

if __name__ == "__main__":
    extracted_urls_file = r"C:\Users\claudin viado\Documents\projetos\portifolio\.gemini\tmp\3ae8e8441e7022fa4916e81c20cfad542ef5e43ec3932ae7623411c1f3f9f39c\extracted_image_urls.txt"
    
    # Check if the file exists before attempting to open it
    if not os.path.exists(extracted_urls_file):
        print(f"Error: The file '{extracted_urls_file}' was not found.")
        exit(1)

    with open(extracted_urls_file, 'r', encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip()]

    base_image_urls = get_base_image_urls(urls)

    if base_image_urls:
        print("Unique Base Image URLs:")
        for url in base_image_urls:
            print(url)
    else:
        print("No unique base image URLs found.")

    # Save the unique base URLs to a new file
    output_dir = r"C:\Users\claudin viado\Documents\projetos\portifolio\.gemini\tmp\3ae8e8441e7022fa4916e81c20cfad542ef5e43ec3932ae7623411c1f3f9f39c"
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "unique_base_image_urls.txt"), "w", encoding="utf-8") as f:
        for url in base_image_urls:
            f.write(url + "\n")
    print(f"\nUnique base URLs saved to {os.path.join(output_dir, 'unique_base_image_urls.txt')}")