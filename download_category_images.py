import os
import requests
import time

# Set your Unsplash Access Key here (register for free at https://unsplash.com/developers)
UNSPLASH_ACCESS_KEY = os.getenv('UNSPLASH_ACCESS_KEY') or 'YOUR_UNSPLASH_ACCESS_KEY'

CATEGORIES = {
    'electronics': 'electronics gadgets technology',
    'sports-fitness': 'sports fitness gym',
    'books-stationery': 'books stationery reading',
    'home-appliances': 'home appliances kitchen',
    'furniture': 'furniture home decor',
    'vehicles': 'vehicles cars bikes',
    'tools-equipment': 'tools equipment hardware',
    'services': 'service people working',
}

IMAGES_PER_CATEGORY = 50
OUTPUT_BASE = '../frontend/public/assets/products/'

HEADERS = {
    'Accept-Version': 'v1',
    'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'
}

SEARCH_URL = 'https://api.unsplash.com/search/photos'

def download_images_for_category(category, query, count=50):
    os.makedirs(os.path.join(OUTPUT_BASE, category), exist_ok=True)
    downloaded = 0
    page = 1
    while downloaded < count:
        params = {
            'query': query,
            'per_page': min(30, count - downloaded),
            'page': page,
            'orientation': 'landscape',
        }
        resp = requests.get(SEARCH_URL, headers=HEADERS, params=params)
        if resp.status_code != 200:
            print(f"Error fetching images for {category}: {resp.text}")
            break
        data = resp.json()
        results = data.get('results', [])
        if not results:
            print(f"No more results for {category} on page {page}.")
            break
        for i, img in enumerate(results):
            url = img['urls']['regular']
            ext = '.jpg'
            filename = f"{category}-{downloaded+1}{ext}"
            out_path = os.path.join(OUTPUT_BASE, category, filename)
            try:
                img_data = requests.get(url).content
                with open(out_path, 'wb') as f:
                    f.write(img_data)
                print(f"Downloaded {filename}")
                downloaded += 1
                if downloaded >= count:
                    break
            except Exception as e:
                print(f"Failed to download {url}: {e}")
        page += 1
        time.sleep(1)  # To avoid hitting rate limits

if __name__ == '__main__':
    if 'YOUR_UNSPLASH_ACCESS_KEY' in UNSPLASH_ACCESS_KEY:
        print("Please set your Unsplash Access Key in the script or as the UNSPLASH_ACCESS_KEY environment variable.")
        exit(1)
    for cat, query in CATEGORIES.items():
        print(f"Downloading images for {cat}...")
        download_images_for_category(cat, query, IMAGES_PER_CATEGORY)
    print("All downloads complete.") 