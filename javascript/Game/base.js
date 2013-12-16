var Game = {

    AIDebug : true,

    canvas: null,
    ctx: null,

    gameTime: 0,
    gameTicRate: 250, // Game production occurs 4 times a second
    gameTicCount:0,
  
    activePlayer: null, // use this for now to know what to draw

    AIManagers:[],
    Players: [],
    Planets: [],
    Paths: [],

    Utilities: {
        Math: {},
        Management: {},
        GameObject: {},
        Canvas: {}
    },
    InputHandler: {
        Mouse: {},
        Keyboard: {}
    },
    LayoutManager:null
}