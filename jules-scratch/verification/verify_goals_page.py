from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:4000/goals")
    page.screenshot(path="jules-scratch/verification/goals_page.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
