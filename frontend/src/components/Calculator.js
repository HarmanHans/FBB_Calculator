import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
// import {useTable} from 'react-table';
import '../Table.css';

function Calculator() {
    useEffect( () => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);

    const count = 1;

    const fetchItems = async() => {
        const data = await fetch('/calculator');
        const oldItems = await data.json();

        const items = oldItems.filter(function (a) {
            return a['season_averages']['games'] > 0;
        });

        items.sort(function(a,b) {
            return b["z-value"][3].value - a["z-value"][3].value;
        });

        for (var i=0; i < items.length; i++) {
            items[i].rank = i + 1;
        }

        console.log(items);

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
    
    function toggleFunction() {
        console.log("test");
        const rest = document.querySelectorAll(".full");

        for (let i = 0; i < rest.length; i++) {
            rest[i].classList.toggle('hidden');
        }
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
        <section class = 'table-hold'>
            <section class='options'>
                <div>
                <fieldset>
                    <legend>Display Settings</legend>

                    <div class="radio">
                        <input label="Average Stats" checked={status == 1} type="radio" id="average-stats" name="data-view" value="ave"
                                 onClick={(e) => radioHandler(1)} />
                        
                        <input label="Projected Stats" checked={status == 2} type="radio" id="projected-stats" name="data-view" value="proj" onClick={(e) => radioHandler(2)} />
                    </div>

                    <p>Compare Average Stats to:</p>
                    
                    <div class="radio">
                        <input label="All Players" checked={posStatus == 1} type="radio" id="all-players" name="all-view" value="all"
                                 onClick={(e) => radioPosHandler(1)} />

                        <input label="Within Position" checked={posStatus == 2} type="radio" id="positional" name="pos-view" value="pos" onClick={(e) => radioPosHandler(2)} />
                    </div>
                    <span class="drop-container">
                        <div class="player dropdown">
                            <p class="select-text">Player Value Relative to:</p>
                            <div class='drop-content'>
                                <select class="select" onChange={(e) => selectHandler(Number(e.target.value))}>
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
                            <p class="select-text">Positional Value Relative to:</p>
                            <div class="drop-content">
                                <select class="select" onChange={(e) => selectPosHandler(Number(e.target.value))}>
                                    <option value="1">Top 10</option>
                                    <option value="2">Top 25</option>
                                    <option value="3" selected='selected'>Top 50</option>
                                    <option value="4">Top 75</option>
                                    <option value="5">Top 100</option>
                                    <option value="6">All Players</option>
                                </select>
                            </div>
                        </div>

                        <div class="show-count">
                            <p>Show all players?</p>
                            <input type="checkbox" onClick={(e) => toggleFunction()}></input>
                        </div>
                    </span>
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
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header top_fifty'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>PV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>3V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>AV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>RV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>BV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>TOV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>V</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header top_hundred'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>PV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>3V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>AV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>RV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>SV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>BV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>TOV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>V</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header top_onetwenty'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>PV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>3V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>AV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>RV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>SV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>BV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>TOV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>V</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header top_onefifty'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>PV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>3V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>AV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>RV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>BV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>TOV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>V</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header top_twohundred'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>PV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>3V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>AV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>RV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>SV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>BV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>TOV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>V</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header top_threehundred'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>PV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>3V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>AV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>RV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>SV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>BV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>FG%V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>FT%V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>TOV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>V</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header top_all'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>V</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header top_pos_ten'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>V</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header top_pos_twentyfive'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>V</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header top_pos_fifty'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>V</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header top_pos_seventyfive'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>V</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header top_pos_hundred'>Cap V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>PV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>3V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>AV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>RV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>SV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>BV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>FG%V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>FT%V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>TOV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>V</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header top_pos_all'>Cap V</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header other_fifty'>ScV</th>}
                    {status===1 && posStatus===1 && visible===1 && <th class='header other_fifty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header other_hundred'>ScV</th>}
                    {status===1 && posStatus===1 && visible===2 && <th class='header other_hundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header other_onetwenty'>ScV</th>}
                    {status===1 && posStatus===1 && visible===3 && <th class='header other_onetwenty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header other_onefifty'>ScV</th>}
                    {status===1 && posStatus===1 && visible===4 && <th class='header other_onefifty'>FTV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header other_twohundred'>ScV</th>}
                    {status===1 && posStatus===1 && visible===5 && <th class='header other_twohundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header other_threehundred'>ScV</th>}
                    {status===1 && posStatus===1 && visible===6 && <th class='header other_threehundred'>FTV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header other_all'>ScV</th>}
                    {status===1 && posStatus===1 && visible===7 && <th class='header other_all'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header other_pos_ten'>ScV</th>}
                    {status===1 && posStatus===2 && posVisible===1 && <th class='header other_pos_ten'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header other_pos_twentyfive'>ScV</th>}
                    {status===1 && posStatus===2 && posVisible===2 && <th class='header other_pos_twentyfive'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header other_pos_fifty'>ScV</th>}
                    {status===1 && posStatus===2 && posVisible===3 && <th class='header other_pos_fifty'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header other_pos_seventyfive'>ScV</th>}
                    {status===1 && posStatus===2 && posVisible===4 && <th class='header other_pos_seventyfive'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header other_pos_hundred'>ScV</th>}
                    {status===1 && posStatus===2 && posVisible===5 && <th class='header other_pos_hundred'>FTV</th>}
                    {status===1 && posStatus===2 && posVisible===6 && <th class='header other_pos_all'>ScV</th>}
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
                    <tr key={item.name} id={item.pos[0]} class={item.rank > 175 ? 'full hidden' : 'short'}>
                        <td class='rank'>{item.rank}</td>
                        <td class='basic name'>{item.name}</td>
                        <td class='basic' id = {item.pos[0]}>{item.pos[0]}</td>
                        <td id='games' class='basic'>{item.season_averages.games}</td>
                        {status===1 && <td id='ave' class='season_average'>{Math.round(item.season_averages.minutes * 10) / 10}</td>}
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
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].pts > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].fg3 > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].ast > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].reb > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].stl > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].blk > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].fg_pct > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].ft_pct > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["z-value"][0].turnovers > 0 ? 'top_fifty green' : 'top_fifty red'}>{Math.round(item["z-value"][0].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty val'>{Math.round(item["z-value"][0].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class='top_fifty val'>{Math.round(item["z-value"][0].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].pts > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].fg3 > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].ast > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].reb > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].stl > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].blk > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].fg_pct > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].ft_pct > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["z-value"][1].turnovers > 0 ? 'top_hundred green' : 'top_hundred red'}>{Math.round(item["z-value"][1].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred val'>{Math.round(item["z-value"][1].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class='top_hundred val'>{Math.round(item["z-value"][1].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].pts > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].fg3 > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].ast > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].reb > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].stl > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].blk > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].fg_pct > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].ft_pct > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["z-value"][2].turnovers > 0 ? 'top_onetwenty green' : 'top_onetwenty red'}>{Math.round(item["z-value"][2].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty val'>{Math.round(item["z-value"][2].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class='top_onetwenty val'>{Math.round(item["z-value"][2].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].pts > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].fg3 > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].ast > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].reb > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].stl > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].blk > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].fg_pct > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].ft_pct > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["z-value"][3].turnovers > 0 ? 'top_onefifty green' : 'top_onefifty red'}>{Math.round(item["z-value"][3].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty val'>{Math.round(item["z-value"][3].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class='top_onefifty val'>{Math.round(item["z-value"][3].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].pts > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].fg3 > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].ast > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].reb > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].stl > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].blk > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].fg_pct > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].ft_pct > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["z-value"][4].turnovers > 0 ? 'top_twohundred green' : 'top_twohundred red'}>{Math.round(item["z-value"][4].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred val'>{Math.round(item["z-value"][4].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class='top_twohundred val'>{Math.round(item["z-value"][4].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].pts > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].fg3 > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].ast > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].reb > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].stl > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].blk > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].fg_pct > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].ft_pct > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["z-value"][5].turnovers > 0 ? 'top_threehundred green' : 'top_threehundred red'}>{Math.round(item["z-value"][5].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred val'>{Math.round(item["z-value"][5].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class='top_threehundred val'>{Math.round(item["z-value"][5].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].pts > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].pts * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].fg3 > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].ast > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].ast * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].reb > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].reb * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].stl > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].stl * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].blk > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].blk * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].fg_pct > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].ft_pct > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["z-value"][6].turnovers > 0 ? 'top_all green' : 'top_all red'}>{Math.round(item["z-value"][6].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all val'>{Math.round(item["z-value"][6].value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class='top_all val'>{Math.round(item["z-value"][6].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].pts > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].fg3 > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].ast > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].reb > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].stl > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].blk > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].fg_pct > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].ft_pct > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["z-positional_value"][0].turnovers > 0 ? 'top_pos_ten green' : 'top_pos_ten red'}>{Math.round(item["z-positional_value"][0].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten val'>{Math.round(item["z-positional_value"][0].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class='top_pos_ten val'>{Math.round(item["z-positional_value"][0].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].pts > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].fg3 > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].ast > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].reb > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].stl > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].blk > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].fg_pct > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].ft_pct > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["z-positional_value"][1].turnovers > 0 ? 'top_pos_twentyfive green' : 'top_pos_twentyfive red'}>{Math.round(item["z-positional_value"][1].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive val'>{Math.round(item["z-positional_value"][1].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class='top_pos_twentyfive val'>{Math.round(item["z-positional_value"][1].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].pts > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].fg3 > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].ast > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].reb > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].stl > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].blk > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].fg_pct > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].ft_pct > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["z-positional_value"][2].turnovers > 0 ? 'top_pos_fifty green' : 'top_pos_fifty red'}>{Math.round(item["z-positional_value"][2].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty val'>{Math.round(item["z-positional_value"][2].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class='top_pos_fifty val'>{Math.round(item["z-positional_value"][2].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].pts > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].fg3 > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].ast > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].reb > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].stl > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].blk > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].fg_pct > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].ft_pct > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["z-positional_value"][3].turnovers > 0 ? 'top_pos_seventyfive green' : 'top_pos_seventyfive red'}>{Math.round(item["z-positional_value"][3].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive val'>{Math.round(item["z-positional_value"][3].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class='top_pos_seventyfive val'>{Math.round(item["z-positional_value"][3].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].pts > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].fg3 > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].ast > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].reb > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].stl > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].blk > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].fg_pct > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].ft_pct > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["z-positional_value"][4].turnovers > 0 ? 'top_pos_hundred green' : 'top_pos_hundred red'}>{Math.round(item["z-positional_value"][4].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred val'>{Math.round(item["z-positional_value"][4].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class='top_pos_hundred val'>{Math.round(item["z-positional_value"][4].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].pts > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].pts * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].fg3 > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].fg3 * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].ast > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].ast * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].reb > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].reb * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].stl > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].stl * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].blk > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].blk * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].fg_pct > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].fg_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].ft_pct > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].ft_pct * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["z-positional_value"][5].turnovers > 0 ? 'top_pos_all green' : 'top_pos_all red'}>{Math.round(item["z-positional_value"][5].turnovers * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all val'>{Math.round(item["z-positional_value"][5].value * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class='top_pos_all val'>{Math.round(item["z-positional_value"][5].capped_value * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["other-stats"][0]["pts-value"] > 0 ? 'other_fifty green' : 'other_fifty red'}>{Math.round(item["other-stats"][0]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===1 && <td class={item["other-stats"][0]["ft-value"] > 0 ? 'other_fifty green' : 'other_fifty red'}>{Math.round(item["other-stats"][0]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["other-stats"][1]["pts-value"] > 0 ? 'other_hundred green' : 'other_hundred red'}>{Math.round(item["other-stats"][1]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===2 && <td class={item["other-stats"][1]["ft-value"] > 0 ? 'other_hundred green' : 'other_hundred red'}>{Math.round(item["other-stats"][1]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["other-stats"][2]["pts-value"] > 0 ? 'other_onetwenty green' : 'other_onetwenty red'}>{Math.round(item["other-stats"][2]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===3 && <td class={item["other-stats"][2]["ft-value"] > 0 ? 'other_onetwenty green' : 'other_onetwenty red'}>{Math.round(item["other-stats"][2]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["other-stats"][3]["pts-value"] > 0 ? 'other_onefifty green' : 'other_onefifty red'}>{Math.round(item["other-stats"][3]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===4 && <td class={item["other-stats"][3]["ft-value"] > 0 ? 'other_onefifty green' : 'other_onefifty red'}>{Math.round(item["other-stats"][3]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["other-stats"][4]["pts-value"] > 0 ? 'other_twohundred green' : 'other_twohundred red'}>{Math.round(item["other-stats"][4]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===5 && <td class={item["other-stats"][4]["ft-value"] > 0 ? 'other_twohundred green' : 'other_twohundred red'}>{Math.round(item["other-stats"][4]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["other-stats"][5]["pts-value"] > 0 ? 'other_threehundred green' : 'other_threehundred red'}>{Math.round(item["other-stats"][5]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===6 && <td class={item["other-stats"][5]["ft-value"] > 0 ? 'other_threehundred green' : 'other_threehundred red'}>{Math.round(item["other-stats"][5]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["other-stats"][6]["pts-value"] > 0 ? 'other_all green' : 'other_all red'}>{Math.round(item["other-stats"][6]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===1 && visible===7 && <td class={item["other-stats"][6]["ft-value"] > 0 ? 'other_all green' : 'other_all red'}>{Math.round(item["other-stats"][6]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["other-stats-pos"][0]["pts-value"] > 0 ? 'other_pos_ten green' : 'other_pos_ten red'}>{Math.round(item["other-stats-pos"][0]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===1 && <td class={item["other-stats-pos"][0]["ft-value"] > 0 ? 'other_pos_ten green' : 'other_pos_ten red'}>{Math.round(item["other-stats-pos"][0]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["other-stats-pos"][1]["pts-value"] > 0 ? 'other_pos_twentyfive green' : 'other_pos_twentyfive red'}>{Math.round(item["other-stats-pos"][1]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===2 && <td class={item["other-stats-pos"][1]["ft-value"] > 0 ? 'other_pos_twentyfive green' : 'other_pos_twentyfive red'}>{Math.round(item["other-stats-pos"][1]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["other-stats-pos"][2]["pts-value"] > 0 ? 'other_pos_fifty green' : 'other_pos_fifty red'}>{Math.round(item["other-stats-pos"][2]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===3 && <td class={item["other-stats-pos"][2]["ft-value"] > 0 ? 'other_pos_fifty green' : 'other_pos_fifty red'}>{Math.round(item["other-stats-pos"][2]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["other-stats-pos"][3]["pts-value"] > 0 ? 'other_pos_seventyfive green' : 'other_pos_seventyfive red'}>{Math.round(item["other-stats-pos"][3]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===4 && <td class={item["other-stats-pos"][3]["ft-value"] > 0 ? 'other_pos_seventyfive green' : 'other_pos_seventyfive red'}>{Math.round(item["other-stats-pos"][3]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["other-stats-pos"][4]["pts-value"] > 0 ? 'other_pos_hundred green' : 'other_pos_hundred red'}>{Math.round(item["other-stats-pos"][4]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===5 && <td class={item["other-stats-pos"][4]["ft-value"] > 0 ? 'other_pos_hundred green' : 'other_pos_hundred red'}>{Math.round(item["other-stats-pos"][4]["ft-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["other-stats-pos"][5]["pts-value"] > 0 ? 'other_pos_all green' : 'other_pos_all red'}>{Math.round(item["other-stats-pos"][5]["pts-value"] * 100) / 100}</td>}
                        {status===1 && posStatus===2 && posVisible===6 && <td class={item["other-stats-pos"][5]["ft-value"] > 0 ? 'other_pos_all green' : 'other_pos_all red'}>{Math.round(item["other-stats-pos"][5]["ft-value"] * 100) / 100}</td>}
                        {status===2 && <td id='proj' class='proj'>{Math.round(item.projections.minutes * 10) / 10}</td>}
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

            <div class="explanation">
                <p class='hding'>Average Stats</p>
                <p><strong>MPG - </strong> minutes per game</p>
                <p><strong>PPG - </strong> points per game</p>
                <p><strong>3PG - </strong> three pointers made per game</p>
                <p><strong>RPG - </strong> rebounds per game</p>
                <p><strong>SPG - </strong> steals per game</p>
                <p><strong>BPG - </strong> blocks per game</p>
                <p><strong>FG% - </strong> player's average field goal percentage</p>
                <p><strong>Att - </strong> attempts per game</p>
                <p><strong>FT% - </strong> player's average free throw percentage</p>
                <p><strong>FT - </strong> free throw attempts per game</p>
                <p><strong>TO - </strong> turnovers per game</p>

                <p class='hding'>Value Stats - based on z-score value (player's average stat compared to the options selected in settings)</p>
                <p><strong>PV - </strong> z-score value for points per game</p>
                <p><strong>3V - </strong> z-score value for 3s made per game</p>
                <p><strong>AV - </strong> z-score value for assists per game</p>
                <p><strong>RV - </strong> z-score value for rebounds per game</p>
                <p><strong>SV - </strong> z-score value for steals per game</p>
                <p><strong>BV - </strong> z-score value for blocks per game</p>
                <p><strong>FG%V - </strong> z-score value for player's average field goal percentage</p>
                <p><strong>FT%V - </strong> z-score value for player's average free throw percentage</p>
                <p><strong>TOV - </strong> z-score value for turnover's per game</p>
                <p><strong>V - </strong> Overall Value based on player's distance from average in each category</p>
                <p><strong>Cap V - </strong> Capped Overall Value. Same as overall value except limits outlier z-scores so individual categories can't overly influence overall value</p>
                
                <p class='hding'>Other Stats</p>
                <p><strong>ScV - </strong>Scoring value. Weights FG% with attempts per game as players with higher attempts influence FG% more</p>
                <p><strong>FTV - </strong>Free Throw value. Weights FT% with free throw attempts per game as players with higher attempts influence FT% more</p>
            </div>
        </section>
    );
}

export default Calculator;