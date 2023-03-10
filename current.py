import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
import chromedriver_autoinstaller as chromedriver
from unidecode import unidecode

chromedriver.install()

MONTHS = ["october", "november", "december", "january", "february", "march"]
filters = [50, 100, 120, 150, 200, 300, 1000]
pos_filters = [10, 25, 50, 75, 100, 300]
positions = ["PG", "SG", "SF", "PF", "C"]
metrics = ['fg_pct', 'ft_pct', 'fg3', 'pts', 'reb', 'ast', 'st', 'blk', 'to']
player_averages = []
positional_averages = []
st_dev_players = []
st_dev_positions = []
median_players = []
links = []
all_data = {}
data = []
convert_days = {
    "October": 0,
    "November": 14,
    "December": 44,
    "January": 75,
    "February": 106,
    "March": 134
}

general_stats = {
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
# creates average datasets based on either top players or positions
# param: (qualifier) - whether this average set is sorted by position or top X players.
# param: (list) - the specific list we are storing this data in
def create_average_set(qualifier, list):
    for i in qualifier:
        average_stats = {}

        average_stats['key'] = i
        average_stats['games'] = 0
        average_stats['fg_pct'] = 0
        average_stats['ft_pct'] = 0
        average_stats['fg3'] = 0
        average_stats['pts'] = 0
        average_stats['reb'] = 0
        average_stats['ast'] = 0
        average_stats['stl'] = 0
        average_stats['blk'] = 0
        average_stats['turnovers'] = 0

        average_stats['attempts'] = 0
        average_stats['ft_attempts'] = 0
        list.append(average_stats) 

create_average_set(filters, player_averages)
create_average_set(filters, st_dev_players)
create_average_set(filters, median_players)

create_average_set(positions, st_dev_positions)

# creates data set to see value of volume + efficiency compared to other players
# param: (qualifier) - whether this average set is sorted by position or top X players.
# param: (list) - the specific list we are storing this data in
def create_other_stats(qualifier, list):
    for i in qualifier:
        other_stats = {}

        other_stats['key'] = i
        other_stats['pts-value'] = 0
        other_stats['ft-value'] = 0
        list.append(other_stats)

for i in range(0, len(pos_filters)):
    create_average_set(positions, positional_averages)

for i in range(1, len(pos_filters)):
    create_average_set(positions, st_dev_positions)

# adds filters to each positional doc in a dataset
# param: (list) - the dataset we're appending filters to
# param: (repetitions) - 
def filterize_dataset(list, repetitions):
    count = 1
    index = 0
    for dict in list:
        dict['filter'] = pos_filters[index]
        if (count == repetitions):
            count = 0
            index += 1
        count += 1


filterize_dataset(positional_averages, 5)
filterize_dataset(st_dev_positions, 5)

# access database
load_dotenv()
username = os.getenv("USERNAME_MONGO")
password = os.getenv("PASSWORD_MONGO")
cluster = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@nodecluster.gknsvxa.mongodb.net/?retryWrites=true&w=majority")

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
    time.sleep(2)
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

# replaces games key in player value dictionaries to an overall value key
# param: (dictionary) - the specific dictionary we're making the change in
# param: (location) - the location in the dictionary where the change is applied
def replace_key(dictionary, location):
    for dict in dictionary[location]:
        del dict['games']
        dict['value'] = 0

# creates initial player profile with name and position
def get_player_position():
    url = "https://hashtagbasketball.com/fantasy-basketball-rankings"
    
    player_list_element = '//*[@id="ContentPlaceHolder1_DDSHOW"]'
    all_player_option = '/html/body/form/div[3]/div/div[3]/div[2]/div/div[1]/div[1]/table/tbody/tr/td[1]/select/option[6]'
    sort_alphabetical = '//*[@id="ContentPlaceHolder1_GridView1"]/tbody/tr[1]/th[2]'
    
    browser = webdriver.Chrome()
    browser.get(url)
    browser.maximize_window()
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
            name = unidecode(name)
            posTab = nameRow.findNext("td").findNext("td").findNext("td").contents[0]
            posEligibility = posTab.split(',')
            if (name != 'PLAYER'):
                profile['name'] = name
                profile['pos'] = posEligibility
                profile['games'] = []
                profile['z-value'] = []
                profile['z-positional_value'] = []
                profile['season_averages'] = season_averages
                profile['projections'] = general_stats
                profile['other-stats'] = []
                profile['other-stats-pos'] = []
                create_average_set(filters, profile['z-value'])
                create_other_stats(filters, profile['other-stats'])
                for i in range(0, len(profile['pos'])):
                    create_average_set(pos_filters, profile['z-positional_value'])
                for i in range(0, len(profile['pos'])):
                    create_other_stats(pos_filters, profile['other-stats-pos'])
                replace_key(profile, 'z-value')
                replace_key(profile, 'z-positional_value')
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
    for dict in complete_data:
        if (name == dict['name']):
            dict['games'].append(datum)
            if (datum['minutes'] > -1):
                old_games = dict['season_averages']['games']
                dict['season_averages']['games'] = dict['season_averages']['games'] + 1
                games = dict['season_averages']['games']
                dict['season_averages']['minutes'] = ((old_games * dict['season_averages']['minutes']) + datum['minutes']) / games
                dict['season_averages']['fg'] = ((old_games * dict['season_averages']['fg']) + datum['fg']) / games
                dict['season_averages']['attempts'] = ((old_games * dict['season_averages']['attempts']) + datum['attempts']) / games
                if (datum['fg'] > 0):
                    dict['season_averages']['fg_pct'] = (dict['season_averages']['fg'] / dict['season_averages']['attempts'])
                dict['season_averages']['fg3'] = ((old_games * dict['season_averages']['fg3']) + datum['fg3']) / games
                dict['season_averages']['fg3_attempts'] = ((old_games * dict['season_averages']['fg3_attempts']) + datum['fg3_attempts']) / games
                if (datum['fg3_attempts'] > 0):
                    dict['season_averages']['fg3_pct'] = (dict['season_averages']['fg3'] / dict['season_averages']['fg3_attempts'])
                dict['season_averages']['ft'] = ((old_games * dict['season_averages']['ft']) + datum['ft']) / games
                dict['season_averages']['ft_attempts'] = ((old_games * dict['season_averages']['ft_attempts']) + datum['ft_attempts']) / games
                if (datum['ft_attempts'] > 0):
                    dict['season_averages']['ft_pct'] = (dict['season_averages']['ft'] / dict['season_averages']['ft_attempts'])
                dict['season_averages']['orb'] = ((old_games * dict['season_averages']['orb']) + datum['orb']) / games
                dict['season_averages']['drb'] = ((old_games * dict['season_averages']['drb']) + datum['drb']) / games
                dict['season_averages']['reb'] = ((old_games * dict['season_averages']['reb']) + datum['reb']) / games
                dict['season_averages']['ast'] = ((old_games *dict['season_averages']['ast']) + datum['ast']) / games
                dict['season_averages']['stl'] = ((old_games * dict['season_averages']['stl']) + datum['stl']) / games
                dict['season_averages']['blk'] = ((old_games * dict['season_averages']['blk']) + datum['blk']) / games
                dict['season_averages']['turnovers'] = ((old_games * dict['season_averages']['turnovers']) + datum['turnovers']) / games
                dict['season_averages']['fouls'] = ((old_games *  dict['season_averages']['fouls']) + datum['fouls']) / games
                dict['season_averages']['pts'] = ((old_games *  dict['season_averages']['pts']) + datum['pts']) / games
                if (datum['plus_minus'] is not None):
                    dict['season_averages']['plus_minus'] = ((old_games *  dict['season_averages']['plus_minus']) + datum['plus_minus']) / games
                collection.replace_one({'_id': dict['_id']}, dict)

# retrieves the box score of every single NBA game played in the months given to it.
# param: (month) - the month we are getting data from
def scrape_game_links(month):
    url = f"https://www.basketball-reference.com/leagues/NBA_2023_games-{month}.html"
    soup = open_page(url)
    linkBox = soup.find_all("td", {"data-stat": "box_score_text"})
    for box in linkBox:
        if (box.find("a") is not None):
            link = "https://www.basketball-reference.com" + box.find("a").get("href")
            links.append(link)

# given each players statline from the website, this method cleans the data 
# and divides it into separate stats
# param: (results) - a list of player data
# param: (day) - distance from tip off day that game took place
def clean_player_data(results, day):
    for result in results:
        datum = {}

        nameBox = result.find("th", {"data-stat": "player"})
        name = nameBox.find("a").get_text()
        name = unidecode(name)
        print(name)
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

db = cluster["basketball-data"]

collection = db["stats"]
average_collection = db["player-averages"]
pos_collection = db["positional-averages"]
st_dev_players_collection = db["st_dev_players"]
median_players_collection = db["median_players"]
st_dev_positions_collection = db["st_dev_positions"]

get_player_position()

collection.insert_many(data)
average_collection.insert_many(player_averages)
pos_collection.insert_many(positional_averages)
st_dev_players_collection.insert_many(st_dev_players)
median_players_collection.insert_many(median_players)
st_dev_positions_collection.insert_many(st_dev_positions)

complete_data = list(collection.find({}))

# testing scraping below
#scrape_player_data("https://www.basketball-reference.com/boxscores/202210270SAC.html")
#scrape_player_data("https://www.basketball-reference.com/boxscores/202212230PHO.html")
#scrape_player_data("https://www.basketball-reference.com/boxscores/202301130DET.html")

for month in MONTHS:
    scrape_game_links(month)

for link in links:
    scrape_player_data(link)
    # if data scraping fails at some point, I can figure out which game it stops
    print(link)

