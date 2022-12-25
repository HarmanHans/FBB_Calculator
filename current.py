import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import pymongo
from pymongo import MongoClient

#cluster = pymongo.MongoClient("mongodb+srv://hans:rupwTH9cVbCgGZht@nodecluster.gknsvxa.mongodb.net/?retryWrites=true&w=majority")

MONTHS = ["october", "november", "december"]
links = []
data = []

# converts strings that should be numbers into floats
# param: A string that represents an individual stat
# returns: returns the string converted into a float
def convert_string(str):
    if not str:
        return -1
    else:
        num = float(str)
        return num

# converts players minutes from time form into a double, i.e (38:30 becomes 38.5)
# param: The players minutes in string form
# returns: the players minutes in double form
def convert_minutes(str):
    num = float(str)

# opens a webpage to extract its url
# param: a string that represents a url
# returns: an html of the given page to process
def open_page(url):
    browser = webdriver.Chrome()
    browser.get(url)
    time.sleep(5)
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')
    return soup

# retrieves the box score of every single NBA game played in the months given to it.
# param: the month we are getting data from
def scrape_game_links(month):
    print(month)
    url = f"https://www.basketball-reference.com/leagues/NBA_2023_games-{month}.html"
    soup = open_page(url)
    linkBox = soup.find_all("td", {"data-stat": "box_score_text"})
    for box in linkBox:
        link = "https://www.basketball-reference.com" + box.find("a").get("href")
        links.append(link)

# given a box score page, scrapes stats of each player who played
# param: A url (string form) to the box score we're extracting data from
def scrape_player_data(link):
    soup = open_page(link)
    tables = soup.find_all("table", {"class": "sortable stats_table now_sortable"})
    for table in tables:
        body = table.find("tbody")
        results = body.find_all("tr", {"class": None})
    return results

# given each players statline from the website, this method cleans the data 
# and divides it into separate stats
# param: a list of player data
def clean_player_data(results):
    for result in results:
        datum = {}

        # if player did not play condition goes here

        nameBox = result.find("th", {"data-stat": "player"})
        name = nameBox.find("a").get_text()

        minutes = convert_minutes(result.find("td", {"data-stat": "mp"}).get_text())

#scrape_game_links("october")
# for month in MONTHS:
#    scrape_game_links(month)

results = scrape_player_data("https://www.basketball-reference.com/boxscores/202210180BOS.html")
clean_player_data(results)
#for link in links:
#    scrape_player_data(link)

# TODO: get every box-score (DONE!)
# TODO: get player stats from each box score
# TODO: every player needs to have their stats from each game
# TODO: every player needs to have season averages based on each game
    #TODO: for averages, a game where they score 0 bc they didn't play is different than a 0 point game. 
    #      same for other stats.




    