//TRPG BASE
//GAME
var game_name = "trpg";
var game_layeramnt = 7;
var game_player;
var game_playerX = 0;
var game_playerY = 0;
var game_playerX_axs = 64;
var game_playerY_axs = 64;
var game_tilesize = 16;
var game_originX = 0;
var game_originY = 0;
var game_last_mov;
var game_playerstr = 1;
var game_envcollisions = [];
var game_playerWidth = 16;
var game_assetssrc = [
    [ //sprites
        "X_idle_left", //0
        "X_idle_right", //1
        "X_walk_left", //2
        "X_walk_right", //3
        "Y_idle_top", //4
        "Y_walk_top_L", //5
        "Y_walk_top_R", //6
        "Y_idle_bottom", //7
        "Y_walk_bottom_L", //8
        "Y_walk_bottom_R" //9
    ],
    ["tileset"], //tiles
    [
        "topbar"
    ],
    ["maptest"] //map
];

function On_GameLoad() {
    game_player = document.getElementById(game_assetssrc[0][0]);
    game_last_mov = document.getElementById(game_assetssrc[0][0]);
    //Load a save here
    const save = JSON.parse(App_readCookie(game_name)) != null ? JSON.parse(App_readCookie(game_name)) : [0, 0];
    game_playerX = save[0];
    game_playerY = save[1];
    game_playerX_axs = Math.floor(game_playerX * game_tilesize);
    game_playerY_axs = Math.floor(game_playerY * game_tilesize);
}

function On_GameFrame() {
    game_playerstr = 1;
    App_clear(1);
    App_clear(2);
    App_clear(3);
    //Sprite Layer - Layer 1
    App_image(1, 64, 64, game_player);

    //Background Layer - Layer 0
    App_interpretimagetomap("maptest", game_playerX, game_playerY, document.getElementById(game_assetssrc[1][0]), 16, 1, 0);

    //Sprite Layer - Layer 2
    //App_rect(2, 80, 80, 50, 50, 200, 0, 0, 100);
    //UI Layer - Layer 6
    App_rect(6, 144, 0, 16, 144, 234, 217, 143, 200);
    //Saving player position
    //console.log(`${game_playerX}, ${game_playerY} / ${game_playerX_axs}, ${game_playerY_axs} / ${originX}, ${originY}`);
    document.cookie = `${game_name} =[${game_playerX},${game_playerY}]; max-age=31536000; SameSite=None; Secure`;
}

function On_keydown() {
    game_playerX = Math.ceil(game_playerX_axs / game_tilesize);
    game_playerY = Math.ceil(game_playerY_axs / game_tilesize);
    App_interpretimagetomap("maptest", game_playerX, game_playerY, document.getElementById(game_assetssrc[1][0]), 16, 1, 0);
}

function On_keydown_double() {
    game_playerstr = 0.75;
}

function On_keydown_arrowkeyleft() {
    game_playerX_axs = game_playerX_axs - game_playerstr;
    game_last_mov = document.getElementById(game_assetssrc[0][0]);
}

function On_keydown_arrowkeyright() {
    game_playerX_axs = game_playerX_axs + game_playerstr;
    game_last_mov = document.getElementById(game_assetssrc[0][1]);
}

function On_keydown_arrowkeytop() {
    game_playerY_axs = game_playerY_axs - game_playerstr;
    game_last_mov = document.getElementById(game_assetssrc[0][4]);
}

function On_keydown_arrowkeybottom() {
    game_playerY_axs = game_playerY_axs + game_playerstr;
    game_last_mov = document.getElementById(game_assetssrc[0][7]);
}

function On_AnimatonFrame() {
    if (game_keys[37] == true && game_keys[39] != true) { //left
        game_player = game_player != document.getElementById(game_assetssrc[0][2]) ? document.getElementById(game_assetssrc[0][2]) : document.getElementById(game_assetssrc[0][0]);
    } else if (game_keys[39] == true && game_keys[37] != true) { //right
        game_player = game_player != document.getElementById(game_assetssrc[0][3]) ? document.getElementById(game_assetssrc[0][3]) : document.getElementById(game_assetssrc[0][1]);
    } else if (game_keys[38] == true && game_keys[40] != true) { //top
        game_player = game_player != document.getElementById(game_assetssrc[0][6]) ? document.getElementById(game_assetssrc[0][6]) : document.getElementById(game_assetssrc[0][5]);
    } else if (game_keys[40] == true && game_keys[38] != true) { //down
        game_player = game_player != document.getElementById(game_assetssrc[0][9]) ? document.getElementById(game_assetssrc[0][9]) : document.getElementById(game_assetssrc[0][8]);
    } else { game_player = game_last_mov; }
}