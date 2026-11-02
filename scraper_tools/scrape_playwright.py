"""
Playwright Web Scraping Guide & Examples
---------------------------------------
Playwright handles dynamic, single-page applications (React, Vue, Angular)
that require JavaScript execution, scrolling, and user interactions.
"""

from playwright.sync_api import sync_playwright
import pandas as pd
import json

def scrape_quotes_example(headless: bool = True):
    """Basic extraction of dynamically loaded content."""
    url = "https://quotes.toscrape.com/js/"
    print(f"--- Scraping {url} (Headless: {headless}) ---")

    with sync_playwright() as p:
        # Launch browser (set headless=False if you want to watch the browser work)
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()

        # Navigate and wait until network is idle
        page.goto(url, wait_until="networkidle")

        # Extract all quotes
        quote_cards = page.locator(".quote").all()
        results = []

        for card in quote_cards:
            text = card.locator(".text").inner_text()
            author = card.locator(".author").inner_text()
            tags = [tag.inner_text() for tag in card.locator(".tag").all()]
            results.append({
                "quote": text,
                "author": author,
                "tags": ", ".join(tags)
            })

        # Save to CSV using pandas
        df = pd.DataFrame(results)
        df.to_csv("quotes_playwright.csv", index=False)
        print(f"Successfully scraped {len(results)} quotes to quotes_playwright.csv")

        # Take a screenshot
        page.screenshot(path="page_screenshot.png")
        print("Saved screenshot to page_screenshot.png")

        browser.close()

def interact_and_scrape_example(headless: bool = True):
    """Example of filling forms and clicking buttons with Playwright."""
    url = "https://quotes.toscrape.com/login"
    print(f"\n--- Interaction Example: {url} ---")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()
        page.goto(url)

        # Fill in input fields
        page.fill('input[name="username"]', "sample_user")
        page.fill('input[name="password"]', "sample_password")

        # Click submit button
        page.click('input[type="submit"]')

        print("Logged in / submitted form. Current URL:", page.url)
        browser.close()

if __name__ == "__main__":
    # Change headless=False if you want to watch the browser open visually!
    scrape_quotes_example(headless=True)
    interact_and_scrape_example(headless=True)
