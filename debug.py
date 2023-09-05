import os
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv

# number of players to sort by in table
filters = [50, 100, 120, 150, 200, 300, 1000]

metrics = ['minutes', 'fg3', 'pts', 'reb', 'ast', 'stl', 'blk', 'turnovers', 'attempts', 'ft_attempts', 'fg_pct', 'ft_pct']
CATEGORIES = 9
# inverse weight on attempts for 'other stats' metrics
SCALER = 3
# for rate stats, helps set minimum volume to be counted
THRESH_SCALER = 1.75
# helps set min minutes requirement when accounting for turnovers
TO_SCALER = 1.25
# the limit at which we cap z scores when adjusting for outlying categories
OUTLIER_LIMIT = 2

load_dotenv()

username = os.getenv("USERNAME_MONGO")
password = os.getenv("PASSWORD_MONGO")
#username = os.environ["USERNAME_MDB"]
#password = os.environ["PASSWORD_MDB"]
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

def cap_categories(score):
        if (score < -(OUTLIER_LIMIT)):
            return -OUTLIER_LIMIT
        elif (score > OUTLIER_LIMIT):
            return OUTLIER_LIMIT
        else:
            return score
        
def is_empty_rate_stat(item, metric):
        if (metric == 'fg_pct'):
            if (item['season_averages']['attempts'] == 0):
                return True
        if (metric == 'ft_pct'):
            if (item['season_averages']['ft_attempts'] == 0):
                return True
        return False

# fixing bug where higher turnovers were being considered positive
def fix_turnovers():
    for item in complete_data:
        if (item['season_averages']['games'] > 0):
            count = 1
            index = 0
            for comp in item['z-positional_value']:
                value = 0
                capped_value = 0
                if (count % 8 == 0):
                    index += 1
                pos = item['pos'][index]
                comp['pos'] = pos
                for mean_set in position_stats:
                    if (mean_set['key'] == comp['pos'] and mean_set['filter'] == comp['key']):
                        if (mean_set['filter'] == comp['key']):
                            for key in mean_set:
                                if (key== 'turnovers'):
                                    if (key == 'turnovers'):
                                        comp[key] = mean_set[key] - item['season_averages'][key]
                for dev_set in st_dev_positions:
                    if(dev_set['key'] == comp['pos'] and dev_set['filter'] < 301 and dev_set['filter'] == comp['key']):
                        for key in dev_set:
                            if (key == 'turnovers'):
                                if (is_empty_rate_stat(item, key)):
                                    comp[key] = 0
                                else:
                                    if (dev_set[key] == 0):
                                        comp[key] = 0
                                    else:
                                        comp[key] = comp[key] / dev_set[key]
                                if (key != 'attempts' and key != 'ft_attempts' and key != 'minutes' and key == 'turnovers'):
                                    value += comp[key]
                                    capped_value += cap_categories(comp[key])
                comp['value'] = value / CATEGORIES
                comp['capped_value'] = capped_value / CATEGORIES
                count += 1
        collection.replace_one({'_id': item['_id']}, item)