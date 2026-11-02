# Web Scraping Starter Kit

This environment is fully configured for Python web scraping.

## Installed Tools & Libraries

- **Static Scraping & HTTP Clients**:
  - `requests` & `httpx` (HTTP request handling, headers, sessions)
  - `beautifulsoup4` & `lxml` (Fast HTML/XML parsing)
- **Dynamic & Browser Automation**:
  - `playwright` (with Chromium headless browser pre-installed)
  - `selenium` (Web browser automation)
- **Frameworks & Data Processing**:
  - `scrapy` (Production web crawling framework)
  - `pandas` (Exporting to CSV, Excel, or JSON)

## Running the Examples

Open your terminal in this directory:

### 1. Static Scraping (BeautifulSoup4 + Requests):
```powershell
python scrape_bs4.py
```

### 2. Dynamic / JavaScript Scraping (Playwright):
```powershell
python scrape_playwright.py
```

### 3. Running Scrapy (Interactive Shell / Spiders):
```powershell
scrapy shell "http://quotes.toscrape.com"
```
