import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from datetime import date 
from datetime import timedelta
import statistics
import json
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv

# needs to be until the last day of the NBA regular season
links = []
data = []
# number of players to sort by in table
filters = [50, 100, 120, 150, 200, 300, 1000]

metrics = ['fg_pct', 'ft_pct', 'fg3', 'pts', 'reb', 'ast', 'stl', 'blk', 'turnovers', 'attempts', 'ft_attempts']
CATEGORIES = 9

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
    st_dev_players_collection = db["st_dev_players"]
    mean_players_collection = db["mean_players"]
    median_players_collection = db["median_players"]
    st_dev_positions_collection = db["st_dev_positions"]
    mean_positions_collection = db["mean_positions"]
    median_positions_collection = db["median_positions"]

    complete_data = list(collection.find({}))
    average_stats = list(average_collection.find({}))
    position_stats = list(positional_collection.find({}))
    st_dev_players = list(st_dev_players_collection.find({}))
    mean_players = list(mean_players_collection.find({}))
    median_players = list(median_players_collection.find({}))
    st_dev_positions = list(st_dev_positions_collection.find({}))
    mean_positions = list(mean_positions_collection.find({}))
    median_positions = list(median_positions_collection.find({}))

    # updates the eligible positions of each player
    # param: (data) - database containing all players
    def update_positions(data):
        
        for player in data:
            print(player['name'])

    # checks if a metric is a rate stat, returns whether or not the rate stat has any attempts to make it valid
    # param: (item) - individual player's stats
    # param: (metric) - the stat being analyzed
    def is_empty_rate_stat(item, metric):
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
    def mean_data(stat_set, metric):
        limit = stat_set['key']
        sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][metric], reverse=True)
        sum = 0
        player_count = 0

        for item in sorted_list:
            if(is_empty_rate_stat(item, metric)):
                continue
            if (item['season_averages']['games'] > 0 and player_count < limit):
                player_count += 1
                sum += item['season_averages'][metric]
        stat_set['games'] = player_count
        stat_set[metric] = (sum / stat_set['games'])
        average_collection.replace_one({'_id': stat_set['_id']}, stat_set)
    
    # finds the average stats by position
    # param: (stat_set) - Dictionary. dictionary containing the stats of players.
    # param: (metric) - String. represents metric that we are comparing.
    def positional_mean(stat_set, metric):
        limit = stat_set['filter']
        sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][metric], reverse=True)
        sum = 0
        player_count = 0
        for item in sorted_list:
            if(is_empty_rate_stat(item, metric)):
                continue
            if (stat_set['key'] in item['pos'] and item['season_averages']['games'] > 0 and player_count < limit):
                player_count += 1
                sum += item['season_averages'][metric]
        stat_set['games'] = player_count
        stat_set[metric] = (sum / player_count)
        positional_collection.replace_one({'_id': stat_set['_id']}, stat_set)
    
    # calculates and stores the standard deviation of each category by position
    def update_positional_st_dev():
        for dev_set in st_dev_positions:
            limit = dev_set['filter']
            for stat_set in position_stats:
                if (limit == stat_set['filter'] and limit < 301):
                    curr = dev_set['key']
                    pos = stat_set['key']
                    if (curr != pos):
                        continue
                    for metric in stat_set:
                        player_count = 0
                        square_of_differences = 0.0
                        st_dev = 0.0
                        if(metric != '_id' and metric != 'key' and metric != 'filter' and metric != 'games'):
                            sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][metric], reverse=True)
                            for item in sorted_list:
                                if(is_empty_rate_stat(item, metric)):
                                    continue
                                if (pos in item['pos'] and item['season_averages']['games'] > 0 and player_count < limit):
                                    player_count += 1
                                    square_of_differences += (item['season_averages'][metric] - stat_set[metric]) ** 2
                            st_dev = (square_of_differences / (player_count - 1)) ** 0.5
                            dev_set[metric] = st_dev
            st_dev_positions_collection.replace_one({'_id': dev_set['_id']}, dev_set)
    
    # updates the z score of each player comparing only to others who play their position
    # some stats are really out there: percentages, blk, stl 
    def update_positional_z_score():
        for item in complete_data:
            if(item['season_averages']['games'] > 0):
                count = 1
                index = 0
                for comp in item['z-positional_value']:
                    value = 0
                    if (count % 8 == 0):
                        index += 1
                    pos = item['pos'][index]
                    comp['pos'] = pos
                    for mean_set in position_stats:
                        if (mean_set['key'] == comp['pos'] and mean_set['filter'] == comp['key']):
                            if (mean_set['filter'] == comp['key']):
                                for key in mean_set:
                                    if (key != '_id' and key != 'key' and key != 'games' and key != 'filter'):
                                        comp[key] = item['season_averages'][key] - mean_set[key]
                    for dev_set in st_dev_positions:
                        if(dev_set['key'] == comp['pos'] and dev_set['filter'] < 301 and dev_set['filter'] == comp['key']):
                            for key in dev_set:   
                                if (key != '_id' and key != 'key' and key != 'games' and key != 'filter'):
                                    if (is_empty_rate_stat(item, key)):
                                        comp[key] = 0
                                    else:
                                        comp[key] = comp[key] / dev_set[key]
                                    if (key != 'attempts' and key != 'ft_attempts'):
                                        value += comp[key]
                    comp['value'] = value / CATEGORIES
                    count += 1
            collection.replace_one({'_id': item['_id']}, item)

    # calculates and stores the median of each category
    def update_median_players():
        player_count = 0
        median = 0
        store_value = []
        for set in median_players:
            limit = set['key']
            for key in set:
                if (key != '_id' and key != 'key'):
                    sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][key], reverse=True)
                    for item in sorted_list:
                        if(is_empty_rate_stat(item, key)):
                            continue
                        if (item['season_averages']['games'] > 0 and player_count < limit):
                            player_count += 1
                            store_value.append(item['season_averages'][key])
                        elif (player_count >= limit):
                            break
                    median = statistics.median(store_value)
                    set[key] = median
                median = 0
                store_value = []
                player_count = 0
            median_players_collection.replace_one({'_id': set['_id']}, set)

    # calculates and stores the standard deviation of each category
    def update_st_dev_players():
        for set in st_dev_players:
            limit = set['key']
            for mean_set in average_stats:
                if (limit == mean_set['key']):
                    for key in mean_set:
                        player_count = 0
                        square_of_differences = 0.0
                        st_dev = 0.0
                        if (key != '_id' and key != 'key' and key != 'games'):
                            sorted_list = sorted(complete_data, key=lambda i : i['season_averages'][key], reverse=True)
                            for item in sorted_list:
                                if(is_empty_rate_stat(item, key)):
                                    continue
                                if (item['season_averages']['games'] > 0 and player_count < limit):
                                    player_count += 1
                                    square_of_differences += (item['season_averages'][key] - mean_set[key]) ** 2
                            st_dev = (square_of_differences / (player_count - 1)) ** 0.5
                            set[key] = st_dev
            st_dev_players_collection.replace_one({'_id': set['_id']}, set)

    # updates the z_scores for each category of each player
    def update_z_score_players():
        for item in complete_data:
            if(item['season_averages']['games'] > 0):
                for comp in item['z-value']:
                    value = 0
                    for mean_set in average_stats:
                        if(mean_set['key'] == comp['key']):
                            for key in mean_set:
                                if (key != '_id' and key != 'key' and key != 'games'):
                                    comp[key] = item['season_averages'][key] - mean_set[key] 
                    for dev_set in st_dev_players:
                        if(dev_set['key'] == comp['key']):
                            for key in dev_set:
                                if (key != '_id' and key != 'key' and key != 'games'):
                                    comp[key] = comp[key] / dev_set[key]
                                    if (key != '_id' and key != 'key' and key != 'games' and key != 'attempts' and key != 'ft_attempts'):
                                        value += comp[key]
                    comp['value'] = value / CATEGORIES
            collection.replace_one({'_id': item['_id']}, item)

    for stat_set in average_stats:
        for metric in metrics:
            mean_data(stat_set, metric)

    for stat_set in position_stats:
        for metric in metrics:
            positional_mean(stat_set, metric) 

    #print(average_stats)
    #update_st_dev_players()
    #update_z_score_players()
    #update_median_players()
    #update_positional_st_dev()
    update_positional_z_score()
    
    # update valid positions
    # how to append this data to the right place in mongoDB - DONE
    # how to hide api keys and still be able to publish website
    # might be better to do player averages here to see who the top 200, top 120, etc. are

    # every 12th person gets duplicated, maybe could have a variable and if variable % 13 == 0, then don't add to data - nothing to do with this, but solved!
    # calculate standard deviations for each metric and store them somewhere