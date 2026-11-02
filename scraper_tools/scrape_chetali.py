import asyncio
import json
import os
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

BASE_URL = "https://chetali-care-and-consult.lovable.app"
OUTPUT_DIR = r"C:\Users\SIDDHARTH GAJJAR\.gemini\antigravity\scratch\web_scraping_starter\scraped_data"

os.makedirs(OUTPUT_DIR, exist_ok=True)

async def scrape_site():
    print(f"Starting crawl on: {BASE_URL}")
    visited_urls = set()
    to_visit = [BASE_URL]
    site_data = {
        "base_url": BASE_URL,
        "pages": []
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 900}
        )
        page = await context.new_page()

        while to_visit:
            url = to_visit.pop(0)
            if url in visited_urls:
                continue

            visited_urls.add(url)
            print(f"\n[Visiting] {url}")

            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
            except Exception as e:
                print(f"Failed to load {url} with networkidle: {e}. Trying domcontentloaded...")
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                except Exception as e2:
                    print(f"Could not load {url}: {e2}")
                    continue

            # Wait a few seconds for hydration/animations
            await page.wait_for_timeout(3000)

            # Screenshot
            parsed_path = urlparse(url).path.strip("/").replace("/", "_") or "home"
            screenshot_path = os.path.join(OUTPUT_DIR, f"{parsed_path}.png")
            await page.screenshot(path=screenshot_path, full_page=True)

            title = await page.title()
            
            # Extract textual content and structure
            page_text = await page.evaluate("() => document.body.innerText")
            
            # Extract buttons, links, inputs, and headings
            extracted = await page.evaluate('''() => {
                const getItems = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim()).filter(Boolean);
                
                const links = Array.from(document.querySelectorAll("a[href]")).map(a => ({
                    text: a.innerText.trim(),
                    href: a.getAttribute("href")
                }));

                const buttons = Array.from(document.querySelectorAll("button")).map(b => b.innerText.trim()).filter(Boolean);
                
                const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(h => ({
                    tag: h.tagName.toLowerCase(),
                    text: h.innerText.trim()
                })).filter(h => h.text.length > 0);

                const forms = Array.from(document.querySelectorAll("form")).map(f => {
                    const inputs = Array.from(f.querySelectorAll("input, select, textarea")).map(i => ({
                        type: i.type || i.tagName.toLowerCase(),
                        placeholder: i.placeholder || "",
                        name: i.name || "",
                        id: i.id || "",
                        label: i.labels && i.labels[0] ? i.labels[0].innerText.trim() : ""
                    }));
                    return { inputs };
                });

                return { links, buttons, headings, forms };
            }''')

            page_info = {
                "url": url,
                "title": title,
                "screenshot": screenshot_path,
                "headings": extracted["headings"],
                "buttons": list(set(extracted["buttons"])),
                "forms": extracted["forms"],
                "text_summary": page_text,
                "raw_links": extracted["links"]
            }

            site_data["pages"].append(page_info)
            print(f"Scraped {url} | Found {len(extracted['headings'])} headings, {len(extracted['buttons'])} buttons.")

            # Discover internal links to crawl
            base_domain = urlparse(BASE_URL).netloc
            for link in extracted["links"]:
                href = link.get("href")
                if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
                    continue
                full_url = urljoin(url, href)
                parsed_full = urlparse(full_url)
                # Keep only same host, exclude assets
                if parsed_full.netloc == base_domain and not any(full_url.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".css", ".js"]):
                    clean_url = f"{parsed_full.scheme}://{parsed_full.netloc}{parsed_full.path}"
                    if clean_url not in visited_urls and clean_url not in to_visit:
                        to_visit.append(clean_url)

        await browser.close()

    # Save all scraped data to JSON
    json_path = os.path.join(OUTPUT_DIR, "crawl_results.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(site_data, f, indent=2, ensure_ascii=False)

    print(f"\n[DONE] Crawled {len(visited_urls)} pages. Results saved to {json_path}")

if __name__ == "__main__":
    asyncio.run(scrape_site())

