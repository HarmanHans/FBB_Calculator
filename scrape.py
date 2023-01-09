import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from datetime import date 
from datetime import timedelta
import json
import pymongo
from pymongo import MongoClient

# needs to be until the last day of the NBA regular season

date = str(date.today() - timedelta(days = 1))
dateString = date.split("-")
year = dateString[0]
month = dateString[1]
day = dateString[2]

url = f"https://www.basketball-reference.com/boxscores/?month={month}&day={day}&year={year}"

def open_page(url):
    browser = webdriver.Chrome()
    browser.get(url)
    time.sleep(5)
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')
    return soup

def scrape_game_links():
    soup = open_page(url)
    linkBoxes = soup.find_all("p", {"class": "links"})
    for linkBox in linkBoxes:
        link = "https://www.basketball-reference.com" + linkBox.find("a").get("href")
        print(link)

scrape_game_links()

# update valid positions
# how to append this data to the right place in mongoDB
# how to hide api keys and still be able to publish website