//ENGINE
var engine_debugging = false;
var engine_lastcalledtime;
var engine_fps;
var engine_fpsmin = 60;

//SCREEN
var screen_width = window.innerWidth;
var screen_height = window.innerHeight;

//GAME
var game_width_std = 160;
var game_height_std = 144;
// changing values
var game_width = 0;
var game_height = 0;
var game_pixelsize = 1;
var game_keys = [];
var game_loaded = false;

function On_Load() {
    //engine_debugging = true;
    //Game Engine Instructions
    App_addlayer(game_layeramnt);
    App_ScreenChange();
    // Frame Functions
    setInterval(On_EngineFrame, 100 / 6); //60fps = 100 / 6
    if (engine_debugging == true) {
        setInterval(DEB_frame, 150); //debug}
    }
    setInterval(On_AnimatonFrame, 150); //this can be called inside engine frame
    //Keydown event, might be a good idea to switch to a not deprecated code
    document.onkeydown = document.onkeyup = function(e) {
        var e = e || event;
        game_keys[e.keyCode] = e.type == 'keydown';
    };;
    //loads every graphic to memory
    App_loadgfx();

}


function DEB_frame() {
    document.getElementById("debug").textContent = "Framerate: " + parseInt(engine_fps);
    if (engine_fps < engine_fpsmin && engine_fps != 0) {
        engine_fpsmin = engine_fps;
        console.log("Min Fps: " + engine_fpsmin);
    }
}

function On_EngineFrame() {
    //Width Height Check
    if (screen_width != window.innerWidth || screen_height != window.innerHeight) {
        //this means screen changed
        App_ScreenChange()
    }
    //Init Game
    if (game_loaded == true) {
        On_GameFrame();
    }
    //Debug
    if (engine_debugging == true) {
        if (!engine_lastcalledtime) {
            engine_lastcalledtime = Date.now();
            engine_fps = 0;
            return;
        }
        var delta = (Date.now() - engine_lastcalledtime) / 1000;
        engine_lastcalledtime = Date.now();
        engine_fps = 1 / delta;
        document.getElementById("debug").style.display = "unset";
    }
    //Keys
    if (game_keys.filter(item => item == true).length > 1 == true) { //checks if two actions at same time and lowers speed
        On_keydown_double();
    }
    if (game_keys.some(Boolean)) { //if key pressed
        On_keydown();
    }
    if (game_keys[37] == true && game_keys[39] != true) { //left
        On_keydown_arrowkeyleft();
    }
    if (game_keys[39] == true && game_keys[37] != true) { //right
        On_keydown_arrowkeyright();
    }
    if (game_keys[38] == true && game_keys[40] != true) { //top
        On_keydown_arrowkeytop();
    }
    if (game_keys[40] == true && game_keys[38] != true) { //down
        On_keydown_arrowkeybottom();
    }
    if (game_keys[32] == true) { //Space
        On_keydown_space();
    }
    if (game_keys[13] == true) { //Enter
        On_keydown_enter();
    }
}

//these are left empty so it doesnt produce errors with no games
function On_keydown() {}

function On_GameLoad() {}

function On_GameFrame() {}

function On_AnimatonFrame() {}

function App_loadgfx() {
    var loaded_images = 0;
    var ttllength = game_assetssrc[0].length + game_assetssrc[1].length + game_assetssrc[2].length;
    for (var i = 0; i < game_assetssrc[0].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game_name}/assets/sprites/${game_assetssrc[0][i]}`;
        img.id = game_assetssrc[0][i];
        img.onload = function() {
            img.width = img.width;
            img.height = img.height;
            loaded_images++;
            App_clear(0);
            App_text(0, 16, 72, `Loading ${Math.round((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
        }
        document.getElementById("assets").append(img);
    }
    for (var i = 0; i < game_assetssrc[1].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game_name}/assets/tiles/${game_assetssrc[1][i]}`;
        img.id = game_assetssrc[1][i];
        img.onload = function() {
            img.width = img.width;
            img.height = img.height;
            loaded_images++;
            App_clear(0);
            App_text(0, 16, 72, `Loading ${Math.round((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
        }
        document.getElementById("assets").append(img);
    }
    for (var i = 0; i < game_assetssrc[2].length; i++) {
        var img = document.createElement('img');
        img.src = `./games/${game_name}/assets/interface/${game_assetssrc[2][i]}`;

        img.id = game_assetssrc[0][i];
        img.onload = function() {
            loaded_images++;
            img.width = img.width;
            img.height = img.height;
            if (loaded_images == ttllength) {
                On_GameLoad();
                game_loaded = true;
            } else {
                App_clear(0);
                App_text(0, 16, 72, `Loading ${Math.round((100*loaded_images/ttllength))}%`, 10, 255, 255, 255);
            }
        }
        document.getElementById("assets").append(img);
    }
}

function App_addlayer(amount) {
    for (var i = 0; i < amount; i++) {
        var layer = document.createElement("canvas");
        layer.className = "canvas";
        layer.width = 160;
        layer.height = 144;
        layer.id = "layer" + i;
        document.body.append(layer);
    }
}

function App_ScreenChange() {
    var el_gamecanvas = document.querySelectorAll("canvas");
    //This function will change the game canvas based on screen resolution
    //Getting New Values
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;
    //Applying Canvas Change
    if (screen_width < game_width_std || screen_height < game_height_std) {
        game_width = 160;
        game_height = 144;
        el_gamecanvas.forEach(el => el.width = 160);
        el_gamecanvas.forEach(el => el.height = 144);
        game_pixelsize = 1;
    } else {
        if (window.innerWidth / window.innerHeight > game_width_std / game_height_std) {
            const temp_a = Math.floor(window.innerHeight / game_height_std);
            game_width = game_width_std * temp_a;
            game_height = game_height_std * temp_a;
            game_pixelsize = temp_a;
        } else {
            const temp_a = Math.floor(window.innerWidth / game_width_std);
            game_width = game_width_std * temp_a;
            game_height = game_height_std * temp_a;
            game_pixelsize = temp_a;
        }
        el_gamecanvas.forEach(el => el.width = game_width);
        el_gamecanvas.forEach(el => el.height = game_height);
    }
    //console.log(`${game_width} and ${game_height} px ${game_pixelsize}`);
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

function App_px(layer, x, y, xsize, ysize, r, g, b, a) {
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    x = x * game_pixelsize;
    y = y * game_pixelsize;
    xsize = game_pixelsize * xsize;
    ysize = game_pixelsize * ysize;
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

function App_spr(layer, x, y, img, w, h) {
    //Draws a sprite
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    w = w == undefined ? w = img.width : w;
    h = h == undefined ? h = img.height : h;
    pen.imageSmoothingEnabled = false;
    pen.drawImage(img, x * game_pixelsize, y * game_pixelsize, w * game_pixelsize, h * game_pixelsize);
}

function App_text(layer, x, y, text, size, r, g, b) {
    //Draws a font
    r = r == undefined ? r = 0 : r;
    g = g == undefined ? g = 0 : g;
    b = b == undefined ? b = 0 : b;
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    size = size * game_pixelsize;
    pen.font = `normal ${size}px PStart2P`;
    pen.fillStyle = `rgb(${r},${g},${b})`;
    pen.fillText(text, x * game_pixelsize, y * game_pixelsize);
}

function App_clear(layer) {
    //Clears screen
    var el_gamecanvas = document.querySelector(`#layer${layer}`);
    var pen = el_gamecanvas.getContext("2d");
    pen.clearRect(0, 0, el_gamecanvas.width, el_gamecanvas.height);
}