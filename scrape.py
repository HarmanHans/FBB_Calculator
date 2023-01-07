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
print(url)