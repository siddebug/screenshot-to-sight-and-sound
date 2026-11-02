"""
Static Web Scraping Example using requests and BeautifulSoup4
"""
import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_quotes():
    # Target URL: Free web scraping sandbox
    url = "http://quotes.toscrape.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    # Parse HTML
    soup = BeautifulSoup(response.text, "lxml")
    quote_elements = soup.find_all("div", class_="quote")

    data = []
    for quote in quote_elements:
        text = quote.find("span", class_="text").get_text(strip=True)
        author = quote.find("small", class_="author").get_text(strip=True)
        tags = [tag.get_text(strip=True) for tag in quote.find_all("a", class_="tag")]
        data.append({"quote": text, "author": author, "tags": ", ".join(tags)})

    df = pd.DataFrame(data)
    print("\n--- Scraped Results (First 3) ---")
    print(df.head(3))
    
    output_file = "quotes.csv"
    df.to_csv(output_file, index=False)
    print(f"\nSaved {len(df)} quotes to {output_file}")

if __name__ == "__main__":
    scrape_quotes()
