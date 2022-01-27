//ENGINE



//SCREEN
var screen = {
    width: window.innerWidth,
    height: window.innerHeight
};

//GAME
var game = {
    width: 0,
    height: 0,
    width_STD: 160,
    height_STD: 140,
    pixelsize: 1,
    keys: [],
    isLoaded: false,
    map: undefined,
    gname: "Game Name",
    layeramnt: 3
};

var On_Load = window.onload = function() {
    //Game Engine Instructions
    App_addgamelayer(game.layeramnt);
    App_ScreenChange();
    // Frame Functions
    setInterval(On_EngineFrame, 12); //60fps = 100 / 6
    setInterval(On_AnimatonFrame, 150); //this can be called inside engine frame
    //Keydown event, might be a good idea to switch to a not deprecated code
    document.onkeydown = document.onkeyup = function(e) {
        var e = e || event;
        game.keys[e.keyCode] = e.type == 'keydown';
    };;
    //loads every graphic to memory
    App_loadgfx();

};

function printg() {

}

function On_EngineFrame() {
    //Width Height Check
    if (screen.width != window.innerWidth || screen.height != window.innerHeight) {
        //this means screen changed
        App_ScreenChange()
    }
    //Init Game
    if (game.isLoaded == true) {
        On_GameFrame();
    }

    //Keys
    if (game.keys.filter(item => item == true).length > 1 == true) { //checks if two actions at same time and lowers speed
        On_keydown_double();
    }
    if (game.keys.some(Boolean)) { //if key pressed
        On_keydown();
    }
    if (game.keys[37] == true && game.keys[39] != true) { //left
        On_keydown_arrowkeyleft();
    }
    if (game.keys[39] == true && game.keys[37] != true) { //right
        On_keydown_arrowkeyright();
    }
    if (game.keys[38] == true && game.keys[40] != true) { //top
        On_keydown_arrowkeytop();
    }
    if (game.keys[40] == true && game.keys[38] != true) { //down
        On_keydown_arrowkeybottom();
    }
    if (game.keys[32] == true) { //Space
        On_keydown_space();
    }
    if (game.keys[13] == true) { //Enter
        On_keydown_enter();
    }
}

//these are left empty so it doesnt produce errors with no games
function On_keydown() {}

function On_keydown_double() {}

function On_GameLoad() {}

function On_GameFrame() {}

function On_AnimatonFrame() {}

function App_loadgfx() {
    var loaded_images = 0;
    var ttllength = game_assetssrc[0].length + game_assetssrc[1].length + game_assetssrc[2].length;
    for (var i = 0; i < game_assetssrc[0].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game.gname}/assets/sprites/${game_assetssrc[0][i]}.png`;
        img.id = game_assetssrc[0][i];
        img.onload = function() {
            img.width = img.width;
            img.height = img.height;
            loaded_images++;
            App_clear(0);
            App_text(0, 25, 72, `Loading ${Math.round((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
        }
        document.getElementById("assets").append(img);
    }
    for (var i = 0; i < game_assetssrc[1].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game.gname}/assets/tiles/${game_assetssrc[1][i]}.png`;
        img.id = game_assetssrc[1][i];
        img.onload = function() {
            img.width = img.width;
            img.height = img.height;
            loaded_images++;
            App_clear(0);
            App_text(0, 25, 72, `Loading ${Math.round((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
        }
        document.getElementById("assets").append(img);
    }
    for (var i = 0; i < game_assetssrc[2].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game.gname}/assets/interface/${game_assetssrc[2][i]}.png`;
        img.id = game_assetssrc[2][i];
        img.width = img.width;
        img.height = img.height;
        img.onload = function() {
            loaded_images++;
            img.width = img.width;
            img.height = img.height;
            if (loaded_images <= ttllength) {
                On_GameLoad();
                game.isLoaded = true;
            } else {
                App_clear(0);
                App_text(0, 25, 72, `Loading ${Math.floor((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
            }
        }
        document.getElementById("assets").append(img);
    }
}

function App_addgamelayer(amount) {
    //adds a game layer
    for (var i = 0; i < amount; i++) {
        var layer = document.createElement("canvas");
        layer.className = "canvas";
        layer.width = 160;
        layer.height = 144;
        layer.id = "layer" + i;
        document.querySelector("alphaville").append(layer);
    }
}

function App_addmaplayer(amount, x, y) {
    for (var i = 0; i < amount; i++) {
        var layer = document.createElement("canvas");
        layer.className = "maplayer";
        layer.width = x;
        layer.height = y;
        layer.id = "map" + i;
        document.getElementById("maploader").append(layer);
    }
}

function App_ScreenChange() {
    var el_gamecanvas = document.querySelectorAll(".canvas");
    //This function will change the game canvas based on screen resolution
    //Getting New Values
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
    //Applying Canvas Change
    if (screen.width < game.width_STD || screen.height < game.height_STD) {
        game.width = 160;
        game.height = 144;
        el_gamecanvas.forEach(el => el.width = 160);
        el_gamecanvas.forEach(el => el.height = 144);
        game.pixelsize = 1;
    } else {
        if (window.innerWidth / window.innerHeight > game.width_STD / game.height_STD) {
            const temp_a = Math.floor(window.innerHeight / game.height_STD);
            game.width = game.width_STD * temp_a;
            game.height = game.height_STD * temp_a;
            game.pixelsize = temp_a;
        } else {
            const temp_a = Math.floor(window.innerWidth / game.width_STD);
            game.width = game.width_STD * temp_a;
            game.height = game.height_STD * temp_a;
            game.pixelsize = temp_a;
        }
        el_gamecanvas.forEach(el => el.width = game.width);
        el_gamecanvas.forEach(el => el.height = game.height);
    }
    //console.log(`${game.width} and ${game.height} px ${game.pixelsize}`);
}

function Math_ratio(num_1, num_2) { //finds ratio
    for (num = num_2; num > 1; num--) {
        if ((num_1 % num) == 0 && (num_2 % num) == 0) {
            num_1 = num_1 / num;
            num_2 = num_2 / num;
        }
    }
    return [num_1, num_2];
}

function App_rect(layer, x, y, xsize, ysize, r, g, b, a) {
    //Draws a rectangle
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    x = x * game.pixelsize;
    y = y * game.pixelsize;
    xsize = game.pixelsize * xsize;
    ysize = game.pixelsize * ysize;
    if (a == undefined) {
        pen.fillStyle = `rgb(${r},${g},${b})`;
        pen.fillRect(x, y, xsize, ysize);
    } else {
        //a = a == undefined ? a = 255 : a;
        var img = pen.createImageData(xsize, ysize); // only do this once per page
        for (let i = 0; i < img.data.length; i += 4) {
            // Modify pixel data
            img.data[i + 0] = r; // R value
            img.data[i + 1] = g; // G value
            img.data[i + 2] = b; // B value
            img.data[i + 3] = a; // A value
        }
        pen.putImageData(img, x, y);
    }
}

function App_image(layer, x, y, img, w, h, sx, sy, sw, sh) {
    //Draws a image
    layer = Number.isInteger(layer) ? `#layer${layer}` : layer;
    var el_gamecanvas = document.querySelector(layer);
    var pen = el_gamecanvas.getContext("2d");
    w = w == undefined ? img.width : w;
    h = h == undefined ? img.height : h;
    sx = sx == undefined ? 0 : sx;
    sy = sy == undefined ? 0 : sy;
    sw = sw == undefined ? img.width : sw;
    sh = sh == undefined ? img.height : sh;
    pen.imageSmoothingEnabled = false;
    pen.drawImage(img, sx, sy, sw, sh, x * game.pixelsize, y * game.pixelsize, w * game.pixelsize, h * game.pixelsize);
}

function App_text(layer, x, y, text, size, r, g, b) {
    //Draws a text
    r = r == undefined ? r = 0 : r;
    g = g == undefined ? g = 0 : g;
    b = b == undefined ? b = 0 : b;
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    size = size * game.pixelsize;
    pen.font = `normal ${size}px PStart2P`;
    pen.fillStyle = `rgb(${r},${g},${b})`;
    pen.fillText(text, x * game.pixelsize, y * game.pixelsize);
}

function App_clear(layer) {
    //Clears screen
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    pen.clearRect(0, 0, el_gamecanvas.width, el_gamecanvas.height);
}

function App_tile(layer, x, y, img, tile, size, margin) {
    //Draws a tile
    size = size == undefined ? 16 : size;
    margin = margin == undefined ? 1 : margin;
    const w = img.width;
    //const h = img.height;
    const row = (w + margin) / (size + margin);
    //const col = (h + margin) / (size + margin);
    const sx = ((tile % row) - 1) * (margin + size);
    const sy = Math.floor(tile / row) * (size + margin);
    App_image(layer, x, y, img, size, size, sx, sy, size, size);
}



//Tile System Functionality


function Read_image(img) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `./games/${game.gname}/assets/maps/${img}.png`, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        if (this.status == 200) {
            var engine_pngreader = new PNGReader(this.response);
            engine_pngreader.parse(function(err, png) {
                if (err) throw err;
                game.map = png;
            });
        }
    };
    xhr.send();
}


function App_rgbtoindex(r, g, b) {
    //gets rgb value and turns it to a index value
    //This interprets data from values (3 different values here) to singular index system
    //Can also be turned to dynamic 
    //a or alpha is absent because alpha being zero can have 4 different interpretations
    const e = 255; //digit value
    return (r * 1) + (g * (e + 1)) + (b * (e + (e * (e + 1) + 1))); //.... + (a * (e + (e * (e + 1) + (e * (e + (e * (e + 1) + 1))) + 1)))
}

function App_indextorgb(a) {
    //gets index value and turns it to a rgb value
    const e = 255; //digit value
    const b = Math.floor(a / (e + (e * (e + 1) + 1)));
    a = a - (b * (e + (e * (e + 1) + 1))); //subtract b
    const g = Math.floor(a / (e + 1));
    a = a - (g * (e + 1)); //subtract g
    const r = Math.floor(a);
    return [r, g, b];
}

function App_tiletocolor(ttl, id) {
    //turns a tile system to rgb
    const max = App_rgbtoindex(255, 255, 255); //all the colors
    return App_indextorgb(Math.floor(max / ttl) * id);
}

function App_colortotile(ttl, r, g, b) {
    //turns a rgb to tile
    const max = App_rgbtoindex(255, 255, 255); //all the colors
    const u = App_rgbtoindex(r, g, b); //our color
    return Math.ceil(u * ttl / max);
}


function App_interpretimagetomap(map, x, y, tileset, tilesize, margin, gamelayer) {
    if (game.map == undefined) {
        Read_image(map);
    }
    var checkExist = setInterval(function() {
        if (game.map != undefined) {
            //console.log(game.map);
            clearInterval(checkExist);
            const row = (tileset.width + margin) / (tilesize + margin);
            const col = (tileset.height + margin) / (tilesize + margin);
            const ttl = row * col;
            var ax, ay, attl;
            ax = Math.ceil((game.width_STD * 2) / tilesize); //10
            ay = Math.ceil((game.height_STD * 2) / tilesize); //9
            attl = ax * ay;
            for (var i = 1; i < attl + 1; i++) {
                var ind = (i - 1).toString().split('').map(Number);
                var curx = ind.length > 1 ? ind[1] + x : ind[0] + x;
                var cury = ind.length > 1 ? ind[0] + y : y;
                var relx = ind.length > 1 ? ind[1] : ind[0];
                var rely = ind.length > 1 ? ind[0] : 0;
                //console.log(`${curx}, ${cury}`);
                var r, g, b;
                const resp = game.map["getPixel"](curx, cury)
                r = resp[0];
                g = resp[1];
                b = resp[2];
                //console.log(`${r}, ${g}, ${b}`);
                var tileid = App_colortotile(ttl, r, g, b);
                App_tile(gamelayer, relx * tilesize, rely * tilesize, tileset, tileid, tilesize, margin);
            }
        }
    }, 100);
}

function App_readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}