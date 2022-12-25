import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import pymongo
from pymongo import MongoClient

#cluster = pymongo.MongoClient("mongodb+srv://hans:rupwTH9cVbCgGZht@nodecluster.gknsvxa.mongodb.net/?retryWrites=true&w=majority")

links = []

# retrieves the link to every box score of games played so far
def scrape_game_links(month):
    print(month)
    url = f"https://www.basketball-reference.com/leagues/NBA_2023_games-{month}.html"
    browser = webdriver.Chrome()
    browser.get(url)
    time.sleep(5)
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')
    linkBox = soup.find_all("td", {"data-stat": "box_score_text"})
    for box in linkBox:
        link = "https://www.basketball-reference.com" + box.find("a").get("href")
        links.append(link)
    

MONTHS = ["october", "november", "december"]
scrape_game_links(MONTHS)
print(links)
#for month in MONTHS:
#    scrape_month(month)





    