import React from 'react';

function Analysis() {
    return(
        <section>
            <h1>Fantasy Basketball Data Analysis</h1>
            <h2>Introduction</h2>
            <p>The structure of fantasy basketball is generally set up such that players compete between winning 9 categories. These categories are points, threes, assists, rebounds
               steals, blocks, field goal percentage, free throw percentage, and turnovers. In the regular season, each category that a player outscores another player in is counted
               as a win. In the playoffs, the player that wins a majority of the categories head-to-head advances to the next round.  
            </p>
            <p>In order to compete in these categories, each player has to draft and maintain a roster of players. Roster requirements are fully customizeable, but generally the 
               default roster requires: 1 PG, 1 SG, 1 Guard, 1 SF, 1 PF, 1 Forward, 2 C, 2 Util (no positional requirement), and 3 open bench spaces. There is also room to stash two
               injured players. This tool was developed to create a valuation for each player based on their cumulative z-score in each category. An alternate valuation was also
               created to account for players who were extreme outliers in specific categories, either masking or diminishing their actual cumulative value. For instance, Stephen Curry 
               is a massive outlier when it comes to making three pointers. Accounting for that one outlying z-score, his capped overall value is more reigned in.
            </p>
            

            <h2>Evaluation</h2>

            <img src='../frotend/assets/toptwenty' alt="Top 20 Rated Players"></img>
            
            <p>Of the top 20 players measured by this tool (relative to the top 150 players), 14 of them are being drafted in the Top 20 this upcoming year according to Yahoo.
               Fred Van Vleet narrowly misses out, being drafted at an average spot of 20.9. Players like Kawhi Leonard and Paul George miss out due to their extensive injury histories,
               something that a z-score cumulation of their contribution to categories doesn't account for. 
            </p>
            <p>At a ranking of 8th, the cumulative z-score likes Fred Van Vleet a lot more than Yahoo players do. It doesn't love Joel Embiid as much as his ADP (average draft position)
               suggests. While Joel is drafted on average at 2nd, his valuation falls at about 11th. The tool also rates Kristaps Porzingis very highly (18th), whereas, his ADP is 40.9.
            </p>

            <h2>Findings</h2>
            <p>Point Guards appear to be the most dominant when it comes to being well rounded players. 50% of the Top 20 players valuated play that position. They make up 7 of the
               top 10! It makes sense that Nikola Jokic is so coveted. He is the only center that can keep up when it comes to being well rounded. Joel Embiid is a step down from that,
               and then there is a big drop off when it comes to bigs. So being able to grab either of the two means having a player that no one else can really keep up with. With 7 of
               the top 10 being PGs, practically everyone will have an equal quality PG on their roster, cancelling each other out. A player with Jokic or Embiid has a player or rare 
               quality and gains that extra value. 
            </p>

            <h2>Comparing within Position</h2>

            <p>Picture of Within Position Comparison</p>

            <p>I also though it important to evaluate players within their position. In a default roster, every player is forced to play 3 guards, 2 centers, and so on. So, I feel 
               it's important to assess a roster within these restrictions. How do my two centers contribute compared to the other player's two centers? One of the reasons that 
               Nikola Jokic is drafted #1 overall is that he averages 10 assists per game. Only 4 players in the whole league average 10 or more assists and the other 3 are all 
               point guards. The top 10 centers in assists (which includes Jokic!) average only 1.93 assists per game. The next closest big in assists is Karl Anthony Towns, averaging
               5.29 per game. Each matchup in fantasy spans an entire week. So, if someone who owns Jokic goes against the next best center in terms of assists, Karl Anthony-Towns,
               they are still gaining about 5 more assists per game than their opponent. If Jokic and Towns each play 3 games in a week, this is a difference of about 15 assists. 
               Against another center, the difference could be about 24 assists or more in a week! 
            </p>
            <p>Kevin Durant and Jayson Tatum are players that contribute heavily relative to other small forwards. Doncic, Curry, Harden, and SGA are players that stand amongst
               the most saturated position in Fantasy Basketball.
            </p>
        </section>
    );
}

export default Analysis;