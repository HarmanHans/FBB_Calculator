import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from datetime import date 
from datetime import timedelta
import json
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv

# needs to be until the last day of the NBA regular season
links = []
data = []

load_dotenv()

currentDay = str(date.today() - timedelta(days = 1))
dateString = currentDay.split("-")
year = dateString[0]
month = dateString[1]
day = dateString[2]

intDate = date(int(year), int(month), int(day))
tipOff = date(2022, 10, 18)
diff = (intDate - tipOff).days

url = f"https://www.basketball-reference.com/boxscores/?month={month}&day={day}&year={year}"

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
def scrape_game_links():
    soup = open_page(url)
    linkBoxes = soup.find_all("p", {"class": "links"})
    for linkBox in linkBoxes:
        link = "https://www.basketball-reference.com" + linkBox.find("a").get("href")
        links.append(link)

# converts the date a game took place to how many days it was from tipoff day
# param: (heading) - the heading on the page that contains the date
# returns: (day) - the int representing distance from tipoff day
def convert_date(date_heading):
    day = 0
    date_header = date_heading.split(",")
    date_split = date_header[1].split(" ")
    day = day + date_split[1] + int(date_split[2]) - 1
    return day

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
    minute_side = str.split(':')[0]
    second_side = str.split(':')[1]

    min_side_num = float(minute_side)
    sec_side_num = round((float(second_side) / 60), 2)
    return(min_side_num + sec_side_num)

# given each players statline from the website, this method cleans the data 
# and divides it into separate stats
# param: (results) - a list of player data
def clean_player_data(results):
    for result in results:
        datum = {}

        nameBox = result.find("th", {"data-stat": "player"})
        name = nameBox.find("a").get_text()
        # if player did not play
        if (result.find("td", {"data-stat": "reason"})):
            minutes = -1
            fg = -1
            attempts = -1
            fg_pct = -1
            fg3 = -1
            fg3_attempts = -1
            fg3_pct = -1
            ft = -1
            ft_attempts = -1
            ft_pct = -1
            orb = -1
            drb = -1
            reb = -1
            ast = -1
            stl = -1
            blk = -1
            turnovers = -1
            fouls = -1
            pts = -1
            plus_minus = None

        else:
            minutes = convert_minutes(result.find("td", {"data-stat": "mp"}).get_text())
            fg = convert_string(result.find("td", {"data-stat": "fg"}).get_text())
            attempts = convert_string(result.find("td", {"data-stat": "fga"}).get_text())
            fg_pct = convert_string(result.find("td", {"data-stat": "fg_pct"}).get_text())
            fg3 = convert_string(result.find("td", {"data-stat": "fg3"}).get_text())
            fg3_attempts = convert_string(result.find("td", {"data-stat": "fg3a"}).get_text())
            fg3_pct = convert_string(result.find("td", {"data-stat": "fg3_pct"}).get_text())
            ft = convert_string(result.find("td", {"data-stat": "ft"}).get_text())
            ft_attempts = convert_string(result.find("td", {"data-stat": "fta"}).get_text())
            ft_pct = convert_string(result.find("td", {"data-stat": "ft_pct"}).get_text())
            orb = convert_string(result.find("td", {"data-stat": "orb"}).get_text())
            drb = convert_string(result.find("td", {"data-stat": "drb"}).get_text())
            reb = convert_string(result.find("td", {"data-stat": "trb"}).get_text())
            ast = convert_string(result.find("td", {"data-stat": "ast"}).get_text())
            stl = convert_string(result.find("td", {"data-stat": "stl"}).get_text())
            blk = convert_string(result.find("td", {"data-stat": "blk"}).get_text())
            turnovers = convert_string(result.find("td", {"data-stat": "tov"}).get_text())
            fouls = convert_string(result.find("td", {"data-stat": "pf"}).get_text())
            pts = convert_string(result.find("td", {"data-stat": "pts"}).get_text())
            plus_minus = convert_string(result.find("td", {"data-stat": "plus_minus"}).get_text())
        
        datum['day'] = diff
        datum['minutes'] = minutes
        datum['fg'] = fg
        datum['attempts'] = attempts
        datum['fg_pct'] = fg_pct
        datum['fg3'] = fg3
        datum['fg3_attempts'] = fg3_attempts
        datum['fg3_pct'] = fg3_pct
        datum['ft'] = ft
        datum['ft_attempts'] = ft_attempts
        datum['ft_pct'] = ft_pct
        datum['orb'] = orb
        datum['drb'] = drb
        datum['reb'] = reb
        datum['ast'] = ast
        datum['stl'] = stl
        datum['blk'] = blk
        datum['turnovers'] = turnovers
        datum['fouls'] = fouls
        datum['pts'] = pts
        datum['plus_minus'] = plus_minus

        #append_data(datum, name)
        data.append(datum)

# given a box score page, scrapes stats of each player who played
# param: (link) - A url (string form) to the box score we're extracting data from
def scrape_player_data(link):
    tables = []
    results = []
    soup = open_page(link)
    matchup = soup.find("table", {"id": "line_score"})
    team_boxes = matchup.find_all("th", {"data-stat": "team"})
    for team_box in team_boxes:
        if (team_box.find("a") is not None):
            name = team_box.find("a").get_text()
            tables.append(soup.find("table", {"id": "box-" + name + "-game-basic"}))
    for table in tables:
        body = table.find("tbody")
        rows = body.find_all("tr", {"class": None})
        results = results + rows
    clean_player_data(results)

#scrape_game_links()
#for link in links:
#    scrape_player_data(link)
scrape_player_data("https://www.basketball-reference.com/boxscores/202301050DAL.html")
print(data)
# update valid positions
# how to append this data to the right place in mongoDB
# how to hide api keys and still be able to publish website