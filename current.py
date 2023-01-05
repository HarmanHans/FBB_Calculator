import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
import pymongo
from pymongo import MongoClient


MONTHS = ["october", "november", "december", "january"]
links = []
data = []
convert_days = {
    "October": 0,
    "November": 14,
    "December": 44,
    "January": 75
}

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

# clicks on given element in html
# param: (browser) - controls the browser to open page, manipulate elements
# param: (xpath) - the location of a given element in the page
def click_element(browser, xpath):
    element = browser.find_element("xpath", xpath)
    element.click()
    time.sleep(5)

# creates initial player profile with name and position
def get_player_position():
    url = "https://hashtagbasketball.com/fantasy-basketball-rankings"
    
    player_list_element = '//*[@id="ContentPlaceHolder1_DDSHOW"]'
    all_player_option = '/html/body/form/div[3]/div/div[3]/div[2]/div/div[1]/div[1]/table/tbody/tr/td[1]/select/option[6]'
    sort_alphabetical = '//*[@id="ContentPlaceHolder1_GridView1"]/tbody/tr[1]/th[2]'
    
    browser = webdriver.Chrome()
    browser.get(url)
    time.sleep(3)
    click_element(browser, player_list_element)
    click_element(browser, all_player_option)
    for i in range(2):
        click_element(browser, sort_alphabetical)
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find("table", {"class": "table table-sm table-bordered table-striped table--statistics"})
    nameRows = table.find_all("tr")
    for nameRow in nameRows:
        profile = {}
        season_averages = {
            'games': 0,
            'minutes': 0,
            'fg': 0,
            'attempts': 0,
            'fg_pct': 0,
            'fg3': 0,
            'fg3_attempts': 0,
            'fg3_pct': 0,
            'ft': 0,
            'ft_attempts': 0,
            'ft_pct': 0,
            'orb': 0,
            'drb': 0,
            'reb': 0,
            'ast': 0,
            'stl': 0,
            'blk': 0,
            'turnovers': 0,
            'fouls': 0,
            'pts': 0,
            'plus_minus': 0
        }
        nameBox = nameRow.find("a")
        if (nameBox is not None):
            name = nameBox.get_text()
            # unfortunately had to hardcode, unicodedata seems to not replace š with s
            if (name == 'Aleksej Pokuševski'):
                name = 'Aleksej Pokusevski'
            posTab = nameRow.findNext("td").findNext("td").findNext("td").contents[0]
            posEligibility = posTab.split(',')
        if (name != 'PLAYER'):
            profile['name'] = name
            profile['pos'] = posEligibility
            profile['games'] = []
            profile['season_averages'] = season_averages
            data.append(profile)

# converts the date a game took place to how many days it was from tipoff day
# param: (heading) - the heading on the page that contains the date
# returns: (day) - the int representing distance from tipoff day
def convert_date(date_heading):
    day = 0
    date_header = date_heading.split(",")
    date_split = date_header[1].split(" ")
    if (date_split[1] == "October"):
        day = day + convert_days[date_split[1]] + int(date_split[2]) - 18
    else:
        day = day + convert_days[date_split[1]] + int(date_split[2]) - 1
    return day

# adds data for a particular game into entire database
# param: (datum) - the stats set for an entire game
# param: (name) - the name of the given player
def append_data(datum, name):
    for dict in data:
            if (name == dict['name']):
                dict['games'].append(datum)
                if (datum['minutes'] > -1):
                    dict['season_averages']['games'] = dict['season_averages']['games'] + 1
                    games = dict['season_averages']['games']
                    dict['season_averages']['minutes'] = (dict['season_averages']['minutes'] + datum['minutes']) / games
                    dict['season_averages']['fg'] = (dict['season_averages']['fg'] + datum['fg']) / games
                    dict['season_averages']['attempts'] = (dict['season_averages']['attempts'] + datum['attempts']) / games
                    if (datum['fg_pct'] > -1):
                        dict['season_averages']['fg_pct'] = (dict['season_averages']['fg_pct'] + datum['fg_pct']) / games
                    dict['season_averages']['fg3'] = (dict['season_averages']['fg3'] + datum['fg3']) / games
                    dict['season_averages']['fg3_attempts'] = (dict['season_averages']['fg3_attempts'] + datum['fg3_attempts']) / games
                    if (datum['fg3_pct'] > -1):
                        dict['season_averages']['fg3_pct'] = (dict['season_averages']['fg3_pct'] + datum['fg3_pct']) / games
                    dict['season_averages']['ft'] = (dict['season_averages']['ft'] + datum['ft']) / games
                    dict['season_averages']['ft_attempts'] = (dict['season_averages']['ft_attempts'] + datum['ft_attempts']) / games
                    if (datum['ft_pct']):
                        dict['season_averages']['ft_pct'] = (dict['season_averages']['ft_pct'] + datum['ft_pct']) / games
                    dict['season_averages']['orb'] = (dict['season_averages']['orb'] + datum['orb']) / games
                    dict['season_averages']['drb'] = (dict['season_averages']['drb'] + datum['drb']) / games
                    dict['season_averages']['reb'] = (dict['season_averages']['reb'] + datum['reb']) / games
                    dict['season_averages']['ast'] = (dict['season_averages']['ast'] + datum['ast']) / games
                    dict['season_averages']['stl'] = (dict['season_averages']['stl'] + datum['stl']) / games
                    dict['season_averages']['blk'] = (dict['season_averages']['blk'] + datum['blk']) / games
                    dict['season_averages']['turnovers'] = (dict['season_averages']['turnovers'] + datum['turnovers']) / games
                    dict['season_averages']['fouls'] = (dict['season_averages']['fouls'] + datum['fouls']) / games
                    dict['season_averages']['pts'] = (dict['season_averages']['pts'] + datum['pts']) / games
                    if (datum['plus_minus'] is not None):
                        dict['season_averages']['plus_minus'] = (dict['season_averages']['plus_minus'] + datum['plus_minus']) / games


# retrieves the box score of every single NBA game played in the months given to it.
# param: (month) - the month we are getting data from
def scrape_game_links(month):
    print(month)
    url = f"https://www.basketball-reference.com/leagues/NBA_2023_games-{month}.html"
    soup = open_page(url)
    linkBox = soup.find_all("td", {"data-stat": "box_score_text"})
    for box in linkBox:
        link = "https://www.basketball-reference.com" + box.find("a").get("href")
        links.append(link)

# given each players statline from the website, this method cleans the data 
# and divides it into separate stats
# param: (results) a list of player data
# param: (day) distance from tip off day that game took place
def clean_player_data(results, day):
    for result in results:
        datum = {}

        nameBox = result.find("th", {"data-stat": "player"})
        name = nameBox.find("a").get_text()
        day_key = str(day)
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
        
        datum['day'] = day
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

        append_data(datum, name)

# given a box score page, scrapes stats of each player who played
# param: A url (string form) to the box score we're extracting data from
def scrape_player_data(link):
    tables = []
    results = []
    soup = open_page(link)
    matchup = soup.find("table", {"id": "line_score"})
    team_boxes = matchup.find_all("th", {"data-stat": "team"})
    date_heading = soup.find("h1").get_text()
    day = convert_date(date_heading)
    for team_box in team_boxes:
        if (team_box.find("a") is not None):
            name = team_box.find("a").get_text()
            tables.append(soup.find("table", {"id": "box-" + name + "-game-basic"}))
    for table in tables:
        body = table.find("tbody")
        rows = body.find_all("tr", {"class": None})
        results = results + rows
    clean_player_data(results, day)

#for month in MONTHS:
#    scrape_game_links(month)
#for link in links:
#    results = scrape_player_data(link)
#    clean_player_data(results)
#print(data)

# Testing:
get_player_position()
scrape_player_data("https://www.basketball-reference.com/boxscores/202210270SAC.html")
print(data)

#print(data)
# TODO: get every box-score (DONE!)
# TODO: get player stats from each box score (DONE!)
# TODO: every player needs to have their stats from each game (probably done, either that or simple to do)
# TODO: every player needs to have season averages based on each game
    #TODO: for averages, a game where they score 0 bc they didn't play is different than a 0 point game. 
    #      same for other stats.
# TODO: find out how to scroll down in webpage, so position scraper doesn't crash
# TODO: find way to store players and their positions. then when we find a player in a box score, we add their game stats to the players identity (DONE!)
    # probably in JSON form




    