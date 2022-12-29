import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import pymongo
from pymongo import MongoClient


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

# adds player's position if it's not listed already
# param: (pos) - list containing positions played by player
# param: (pos_value) - String representing position played in a given year
def contains_position(pos, pos_value):
    if not pos_value:
        return pos 
    if pos_value not in pos:
            pos.append(pos_value)
    return pos

# creates list of positions played by player
# param: link to individual player page
# returns: list containing positions played by player in each season of career
def get_player_position(name):
    pos = []
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
    names = table.find_all("a", {"target": "_blank"})
    for i in names:
        print(i.get_text())
    #for tag in position_tags:
    #    pos_value = tag.get_text()
    #    individual = pos_value.split(',')
    #    for i in individual:
    #        contains_position(pos, i)
    #return(pos)
        

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
# returns: stat lines of all players on both teams in a list
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
        rows = body.find_all("tr", {"class": None}) # gets overwritten!!
        results = results + rows
    return results

# given each players statline from the website, this method cleans the data 
# and divides it into separate stats
# param: a list of player data
def clean_player_data(results):
    for result in results:
        datum = {}

        nameBox = result.find("th", {"data-stat": "player"})
        name = nameBox.find("a").get_text()

        
        pos_list = get_player_position(name)



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
        
        datum['name'] = name
        datum['minutes'] = minutes
        datum['fg'] = fg
        datum['attempts'] = attempts
        datum['fg_pct'] = fg_pct
        datum['fg3'] = fg3
        datum['fg3'] = fg3_attempts
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

        data.append(datum)
        data.append(pos_list)

#for month in MONTHS:
#    scrape_game_links(month)
#for link in links:
#    results = scrape_player_data(link)
#    clean_player_data(results)
#print(data)

# Testing:
#results = scrape_player_data("https://www.basketball-reference.com/boxscores/202210180BOS.html")
#clean_player_data(results)
#print(data)
get_player_position("james harden")
# TODO: get every box-score (DONE!)
# TODO: get player stats from each box score
# TODO: every player needs to have their stats from each game
# TODO: every player needs to have season averages based on each game
    #TODO: for averages, a game where they score 0 bc they didn't play is different than a 0 point game. 
    #      same for other stats.




    