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
# number of players to sort by in table
filters = [50, 100, 120, 150, 200, 300, 1000]

metrics = ['fg_pct', 'ft_pct', 'fg3', 'pts', 'reb', 'ast', 'stl', 'blk', 'turnovers']

load_dotenv()

currentDay = str(date.today() - timedelta(days = 1))
dateString = currentDay.split("-")
year = dateString[0]
month = dateString[1]
day = dateString[2]

intDate = date(int(year), int(month), int(day))
tipOff = date(2022, 10, 18)
lastDay = date(2023, 4, 9)
if ((intDate - lastDay).days <= 0):
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
    #scrape_player_data("https://www.basketball-reference.com/boxscores/202301050DAL.html")
    #print(data)

    # replace with github secret later probably
    username = os.getenv("USERNAME_MONGO")
    password = os.getenv("PASSWORD_MONGO")
    cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@nodecluster.gknsvxa.mongodb.net/?retryWrites=true&w=majority")
    db = cluster["basketball-data"]
    collection = db["stats"]
    average_collection = db["player-averages"]
    positional_collection = db["positional-averages"]
    complete_data = list(collection.find({}))
    average_stats = list(average_collection.find({}))
    position_stats = list(positional_collection.find({}))

    # checks if a metric is a rate stat, returns whether or not the rate stat has any attempts to make it valid
    # param: (item) - individual player's stats
    # param: (metric) - the stat being analyzed
    def is_rate_stat(item, metric):
        if (metric == 'fg_pct'):
                if (item['season_averages']['attempts'] == 0):
                    return True
        if (metric == 'ft_pct'):
            if (item['season_averages']['ft_attempts'] == 0):
                return True
        return False
    
    # finds the average of a given metric based on how many players are compared
    # param: (stat_set) - Dictionary. dictionary containing averages of top X players.
    # param: (metric) - String. represents metric that we are comparing.
    def average_data(stat_set, metric):
        limit = stat_set['key']
        sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][metric], reverse=True)
        sum = 0
        player_count = 0

        for item in sorted_list:
            if(is_rate_stat(item, metric)):
                continue
            if (item['season_averages']['games'] > 0 and player_count < limit):
                player_count += 1
                sum += item['season_averages'][metric]
        stat_set['games'] = player_count
        stat_set[metric] = (sum / stat_set['games'])
    
    # finds the average stats by position
    # param: (stat_set) - Dictionary. dictionary containing the stats of players.
    # param: (metric) - String. represents metric that we are comparing.
    def positional_averaging(stat_set, metric):
        limit = stat_set['filter']
        sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][metric], reverse=True)
        sum = 0
        player_count = 0
        for item in sorted_list:
            if(is_rate_stat(item, metric)):
                continue
            if (stat_set['key'] in item['pos'] and item['season_averages']['games'] > 0 and player_count < limit):
                player_count += 1
                sum += item['season_averages'][metric]
        stat_set['games'] = player_count
        stat_set[metric] = (sum / player_count)
    # need to update these two items, not create them fresh


    for stat_set in average_stats:
        for metric in metrics:
            average_data(stat_set, metric)

    for stat_set in position_stats:
        for metric in metrics:
            positional_averaging(stat_set, metric)  
    print(position_stats)

    # update valid positions
    # how to append this data to the right place in mongoDB
    # how to hide api keys and still be able to publish website
    # might be better to do player averages here to see who the top 200, top 120, etc. are

    # every 12th person gets duplicated, maybe could have a variable and if variable % 13 == 0, then don't add to data
    # how to actually do averages. this current method won't work past the first use. need to consistently monitor the amount of games we are dividing by.