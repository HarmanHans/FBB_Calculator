const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: String,
    pos: String,
    team: String,
    fg_pct: Number,
    ft_pct: Number,
    pts: Number,
    fg3_makes: Number,
    reb: Number,
    ast: Number,
    stl: Number,
    blk: Number,
    to: Number,
    age: Number, // int!
    games: Number, // int!
    games_started: Number, //int
    minutes: Number,
    makes: Number,
    attempts: Number,
    fg3_att: Number,
    fg3_pct: Number,
    fg2_makes: Number,
    fg2_att: Number,
    fg2_pct: Number,
    efg: Number,
    ft_makes: Number,
    ft_att: Number,
    orb: Number,
    drb: Number,
    fouls: Number
});
