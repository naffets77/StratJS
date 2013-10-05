var Game = {

    canvas: null,
    ctx: null,

    gameTime: 0,
    gameTicRate: 250, // 4 times a second
    gameTicCount:0,
  
    activePlayer: null, // use this for now to know what to draw

    Players: [],
    Planets: [],
    Paths: [],

    Utilities: {
        Math: {},
        Management: {},
        GameObject: {},
    },
    InputHandler: {
        Mouse: {},
        Keyboard: {}
    }
}