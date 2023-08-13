import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
// import {useTable} from 'react-table';
import '../Table.css';

function Calculator() {
    useEffect( () => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);

    const fetchItems = async() => {
        const data = await fetch('/calculator');
        const oldItems = await data.json();

        const items = oldItems.filter(function (a) {
            return a['season_averages']['games'] > 0;
        });

        items.sort(function(a,b) {
            return b["z-value"][3].value - a["z-value"][3].value;
        });

        setItems(items);
    }

    const [status, setStatus] = React.useState(1); 

    const radioHandler = (status) => {
        setStatus(status);
    };

    const [visible, setVisibility] = React.useState(4);

    const selectHandler = (visible) => {
        setVisibility(visible);
    }

    const [posVisible, setPosVisibility] = React.useState(3);

    const selectPosHandler = (posVisible) => {
        setPosVisibility(posVisible);
    }

    const [posStatus, setPosStatus] = React.useState(1);

    const radioPosHandler = (posStatus) => { 
        setPosStatus(posStatus);
    }

    /*
                possibly add at some point
                <div class='options'>
                    <label for="PG">
                        <input type="checkbox" id="PG" name="accept" checked="checked" />  PG
                    </label>
                    <label for="SG">
                        <input type="checkbox" id="SG" name="accept" checked="checked" />  SG
                    </label>
                    <label for="SF">
                        <input type="checkbox" id="SF" name="accept" checked="checked" />  SF
                    </label>
                    <label for="PF">
                        <input type="checkbox" id="PF" name="accept" checked="checked" />  PF
                    </label>
                    <label for="C">
                        <input type="checkbox" id="C" name="accept" checked="checked" />  C
                    </label>
                </div>
    */

    return(
        <section class = 'table'>
            <section class='options'>

                <div>
                <fieldset>
                    <legend>Select data to view:</legend>

                    <div>
                        <input checked={status == 1} type="radio" id="average-stats" name="data-view" value="ave"
                                 onClick={(e) => radioHandler(1)} />
                        <label for="ave">Average Stats</label>
                    </div>

                    <div>
                        <input checked={status == 2} type="radio" id="projected-stats" name="data-view" value="proj" onClick={(e) => radioHandler(2)} />
                        <label for="proj">Projected Stats</label>
                    </div>

                    <p>Compare Average Stats to:</p>
                    
                    <div>
                        <input checked={posStatus == 1} type="radio" id="all-players" name="all-view" value="all"
                                 onClick={(e) => radioPosHandler(1)} />
                        <label for="all">All Players</label>
                    </div>

                    <div>
                        <input checked={posStatus == 2} type="radio" id="positional" name="pos-view" value="pos" onClick={(e) => radioPosHandler(2)} />
                        <label for="pos">Within Position</label>
                    </div>

                    <div class="player dropdown">
                        <p class="select">Player Value Relative to:</p>
                        <div class='drop-content'>
                            <select onChange={(e) => selectHandler(Number(e.target.value))}>
                               <option value="1" selected={visible == 1}>Top 50</option>
                               <option value="2" selected={visible == 2}>Top 100</option>
                               <option value="3" selected={visible == 3}>Top 120</option>
                               <option value="4" selected={visible == 4}>Top 150</option>
                               <option value="5" selected={visible == 5}>Top 200</option>
                               <option value="6" selected={visible == 6}>Top 300</option>
                               <option value="7" selected={visible == 7}>All Players</option> 
                            </select>
                        </div>
                    </div>

                    <div class="positional dropdown">
                        <p class="select">Positional Value Relative to:</p>
                        <div class="drop-content">
                            <select onChange={(e) => selectPosHandler(Number(e.target.value))}>
                                <option value="1">Top 10</option>
                                <option value="2">Top 25</option>
                                <option value="3" selected='selected'>Top 50</option>
                                <option value="4">Top 75</option>
                                <option value="5">Top 100</option>
                                <option value="6">All Players</option>
                            </select>
                        </div>
                    </div>
                </fieldset>
                </div>
            </section>

            <table class='table'>
                <thead>
                    <th class='header rank'>Rank</th>
                    <th class='header basic'>Name</th>
                    <th class='header basic'>Pos</th>
                    <th class='header basic'>Games</th>
                    {status===1 && <th id='ave' class='header season_average'>MPG</th>}
                    {status===1 && <th id='ave' class='header season_average'>PPG</th>}
                    {status===1 && <th id='ave' class='header season_average'>3PG</th>}
                    {status===1 && <th id='ave' class='header season_average'>APG</th>}
                    {status===1 && <th id='ave' class='header season_average'>RPG</th>}
                    {status===1 && <th id='ave' class='header season_average'>SPG</th>}
                    {status===1 && <th id='ave' class='header season_average'>BPG</th>}
                    {status===1 && <th id='ave' class='header season_average'>FG%</th>}
                    {status===1 && <th id='ave' class='header season_average'>Att</th>}
                    {status===1 && <th id='ave' class='header season_average'>FT%</th>}
                    {status===1 && <th id='ave' class='header season_average'>FT</th>}
                    {status===1 && <th id='ave' class='header season_average'>TO</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>PV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>3V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>AV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>RV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>SV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>BV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>TOV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>Val</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>AST V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>REB V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>STL V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>TO V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>AST V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>REB V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>STL V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>TO V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>AST V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>REB V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>STL V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>TO V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>AST V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>REB V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>STL V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>TO V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>AST V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>REB V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>STL V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>TO V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>PTS V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>FG3 V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>AST V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>REB V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>STL V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>BLK V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>FG% V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>FT% V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>TO V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>Capped V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>PTS Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>FG3 Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>AST Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>REB Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>STL Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>BLK Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>FG% Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>FT% Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>TO Val</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>Capped V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header other_fifty'>SV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header other_fifty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header other_hundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header other_hundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header other_onetwenty'>SV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header other_onetwenty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header other_onefifty'>SV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header other_onefifty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header other_twohundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header other_twohundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header other_threehundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header other_threehundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header other_all'>SV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header other_all'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header other_pos_ten'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header other_pos_ten'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header other_pos_twentyfive'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header other_pos_twentyfive'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header other_pos_fifty'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header other_pos_fifty'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header other_pos_seventyfive'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header other_pos_seventyfive'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header other_pos_hundred'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header other_pos_hundred'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header other_pos_all'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header other_pos_all'>FTV</th>}
                    {status===2 && <th class='header proj'>MPG</th>}
                    {status===2 && <th class='header proj'>PPG</th>}
                    {status===2 && <th class='header proj'>3PPG</th>}
                    {status===2 && <th class='header proj'>APG</th>}
                    {status===2 && <th class='header proj'>RPG</th>}
                    {status===2 && <th class='header proj'>SPG</th>}
                    {status===2 && <th class='header proj'>BPG</th>}
                    {status===2 && <th class='header proj'>AV FG%</th>}
                    {status===2 && <th class='header proj'>Att. PG</th>}
                    {status===2 && <th class='header proj'>AV FT%</th>}
                    {status===2 && <th class='header proj'>FT Att. PG</th>}
                    {status===2 && <th class='header proj'>TOPG</th>}
                </thead>
            {
                items.map(item => (
                    <tr key={item.name} id={item.pos[0]}>
                        <td class='rank'>1</td>
                        <td class='basic name'>{item.name}</td>
                        <td class='basic' id = {item.pos[0]}>{item.pos[0]}</td>
                        <td id='games' class='basic'>{item.season_averages.games}</td>
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.minutes * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.pts * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.fg3 * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.ast * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.reb * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.stl * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.blk * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.fg_pct * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.attempts * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.ft_pct * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.ft_attempts * 100) / 100}</td>}
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty'>{Math.round(item["z-value"][0].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred'>{Math.round(item["z-value"][1].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty'>{Math.round(item["z-value"][2].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty'>{Math.round(item["z-value"][3].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred'>{Math.round(item["z-value"][4].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred'>{Math.round(item["z-value"][5].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all'>{Math.round(item["z-value"][6].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten'>{Math.round(item["z-positional_value"][0].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive'>{Math.round(item["z-positional_value"][1].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty'>{Math.round(item["z-positional_value"][2].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive'>{Math.round(item["z-positional_value"][3].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred'>{Math.round(item["z-positional_value"][4].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all'>{Math.round(item["z-positional_value"][5].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='other_fifty'>{Math.round(item["other-stats"][0]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='other_fifty'>{Math.round(item["other-stats"][0]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='other_hundred'>{Math.round(item["other-stats"][1]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='other_hundred'>{Math.round(item["other-stats"][1]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='other_onetwenty'>{Math.round(item["other-stats"][2]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='other_onetwenty'>{Math.round(item["other-stats"][2]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='other_onefifty'>{Math.round(item["other-stats"][3]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='other_onefifty'>{Math.round(item["other-stats"][3]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='other_twohundred'>{Math.round(item["other-stats"][4]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='other_twohundred'>{Math.round(item["other-stats"][4]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='other_threehundred'>{Math.round(item["other-stats"][5]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='other_threehundred'>{Math.round(item["other-stats"][5]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='other_all'>{Math.round(item["other-stats"][6]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='other_all'>{Math.round(item["other-stats"][6]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='other_pos_ten'>{Math.round(item["other-stats-pos"][0]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='other_pos_ten'>{Math.round(item["other-stats-pos"][0]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='other_pos_twentyfive'>{Math.round(item["other-stats-pos"][1]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='other_pos_twentyfive'>{Math.round(item["other-stats-pos"][1]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='other_pos_fifty'>{Math.round(item["other-stats-pos"][2]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='other_pos_fifty'>{Math.round(item["other-stats-pos"][2]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='other_pos_seventyfive'>{Math.round(item["other-stats-pos"][3]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='other_pos_seventyfive'>{Math.round(item["other-stats-pos"][3]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='other_pos_hundred'>{Math.round(item["other-stats-pos"][4]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='other_pos_hundred'>{Math.round(item["other-stats-pos"][4]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='other_pos_all'>{Math.round(item["other-stats-pos"][5]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='other_pos_all'>{Math.round(item["other-stats-pos"][5]["ft-value"] * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.minutes * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.pts * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.fg3 * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.ast * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.reb * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.stl * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.blk * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.fg_pct * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.attempts * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.ft_pct * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.ft_attempts * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.turnovers * 100) / 100}</td>}
                    </tr>
                ))
            }
            </table>
        </section>
    );
}

export default Calculator;