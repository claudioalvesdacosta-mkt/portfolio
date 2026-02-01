
import os
import requests
from urllib.parse import urlparse

def download_images(image_urls_file, download_dir):
    os.makedirs(download_dir, exist_ok=True)
    
    with open(image_urls_file, 'r', encoding='utf-8') as f:
        image_urls = [line.strip() for line in f if line.strip()]

    print(f"Attempting to download {len(image_urls)} images to {download_dir}...")

    for url in image_urls:
        try:
            # Extract filename from URL
            a = urlparse(url)
            filename = os.path.basename(a.path)
            if not filename: # Fallback if path is just a / or something unexpected
                filename = url.split('/')[-1]

            local_filepath = os.path.join(download_dir, filename)

            if os.path.exists(local_filepath):
                print(f"Skipping {filename}: already exists.")
                continue

            print(f"Downloading {url} to {local_filepath}...")
            response = requests.get(url, stream=True)
            response.raise_for_status() # Raise an exception for HTTP errors

            with open(local_filepath, 'wb') as out_file:
                for chunk in response.iter_content(chunk_size=8192):
                    out_file.write(chunk)
            print(f"Successfully downloaded {filename}")

        except requests.exceptions.RequestException as e:
            print(f"Error downloading {url}: {e}")
        except Exception as e:
            print(f"An unexpected error occurred for {url}: {e}")

if __name__ == "__main__":
    image_urls_file = r"C:\Users\claudin viado\Documents\projetos\portifolio\.gemini\tmp\3ae8e8441e7022fa4916e81c20cfad542ef5e43ec3932ae7623411c1f3f9f39c\unique_base_image_urls.txt"
    download_directory = r"C:\Users\claudin viado\Documents\projetos\portifolio\assets\img\legacy"

    if not os.path.exists(image_urls_file):
        print(f"Error: The file '{image_urls_file}' was not found.")
        exit(1)

    download_images(image_urls_file, download_directory)
    print("\nImage download process completed.")
