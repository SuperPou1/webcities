const gamemap = document.getElementById("gamemap");
const moneytag = document.getElementById("money")
const pause = document.getElementById("pause")
const timebar = document.getElementById("timebar");
const daydisplay = document.getElementById("day");
const incomedisplay = document.getElementById("income")

gamemap.style.zoom = 1

/*
Tiletype properties:
0 - tile image
1 - default tile sell price
2 - tile options (not added yet)
3 - which tiletypes the tile can be placed next to (all if empty)
4 - tile display name (for the menu)
5 - tile cost
6 - tile height, in tiles (1 tile = 20 pixels)
7 - tile upkeep cost (negative is income)
8 - tile category in the menu
*/

var tiletypes = [
    ["house0.png", 20, [], [1,2,3,4,6,7,8,9,10,11,12], "a residential house", 20, 1, -9, 0],
    ["road0.png", 20, [], [], "Road R", 40, 1, 0.20, 1],
    ["road1.png", 20, [], [], "Road L", 40, 1, 0.20, 1],
    ["road2.png", 20, [], [], "Upward turning road", 40, 1, 0.20, 1],
    ["road3.png", 20, [], [], "Downward turning road", 40, 1, 0.20, 1],
    ["talltiles.png", 500, [], [], "some skyscrapers", 130, 2, 0, 0],
    ["road4.png", 20, [], [], "Leftward turning road", 40, 1, 0.20, 1],
    ["road5.png", 20, [], [], "Rightward turning road", 40, 1, 0.20, 1],
    ["road6.png", 20, [], [], "4-way Intersection", 40, 1, 0.20, 1],
    ["road7.png", 20, [], [], "T road South-East", 40, 1, 0.20, 1],
    ["road8.png", 20, [], [], "T road North-West", 40, 1, 0.20, 1],
    ["road9.png", 20, [], [], "T road North-East", 40, 1, 0.20, 1],
    ["road10.png", 20, [], [], "T road South-West", 40, 1, 0.20, 1],
]

var dragging = false;
var draginitialposx;
var tileid;
var placedtiles = [];
var money = 50000
var income = 0
moneytag.innerHTML = `$${money.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

class TileTypeMenu {
    constructor(id)
    {
        this.table = document.getElementById("types")
        this.row = document.createElement("tr")
        this.cell = document.createElement("td")
        this.cell.colSpan = 3
        this.row.setAttribute("onclick", `tileid = ${id}`)
        this.image = document.createElement("img")
        this.image.src = "assets/"+tiletypes[id][0]
        this.image.style.marginRight = "10px"
        this.cell.appendChild(this.image)
        this.desc = document.createTextNode(tiletypes[id][4])
        this.price = document.createElement("p")
        this.price.innerHTML = `$${tiletypes[id][5]}`
        this.cell.appendChild(this.desc)
        this.cell.appendChild(this.price)
        this.row.appendChild(this.cell)
        this.table.appendChild(this.row)
    }
}

class placedTile {
    constructor(id, tilepos, tilegridpos){
        this.type = id
        if (placedtiles.length > 0){
            this.uid = placedtiles[placedtiles.length - 1].uid + 1
        } else {
            this.uid = 0
        }
        this.sellprice = tiletypes[id][1]
        this.tilepos = tilepos
        this.tilegridpos = tilegridpos
        this.options = tiletypes[id][1]
        this.upkeep = tiletypes[id][7]
        this.tile = document.createElement("div");
        this.tile.style.background = `url("assets/${tiletypes[id][0]}")`;
        this.tile.style.width = "40px"
        this.tile.style.height = `${tiletypes[id][6]*20}px`
        this.tile.style.position = "absolute"
        this.tile.style.marginLeft = `${tilepos[0]}px`;
        this.tile.style.marginTop = `${tilepos[1]-((tiletypes[id][6]-1)*20)}px`;
        this.tile.draggable = false
        this.tile.style.zIndex = tileposy
        gamemap.appendChild(this.tile);
        placedtiles.push(this)
    }
}

function determinetile(event){
    if (tileid==null){
        return;
    }
    mapx = Number((event.pageX/Number(gamemap.style.zoom))-Number(gamemap.style.marginLeft.replace("px", "")))
    mapy = Number((event.pageY/Number(gamemap.style.zoom))-Number(gamemap.style.marginTop.replace("px", "")))
    
    tilegridx = (Math.floor(mapx/20));
    tilegridy = (Math.floor(mapy/10));
    
    if (((tilegridx%2 == 1) && (tilegridy%2 == 1))||((tilegridx%2 == 0) && (tilegridy%2 == 0))){
        if (mapy - ((tilegridy+1)*10)>(mapx - (tilegridx*20))/-2) {
            tileposx = (tilegridx)*20
            tileposy = (tilegridy)*10
        } else {
            tileposx = (tilegridx-1)*20
            tileposy = (tilegridy-1)*10
        }
    } else {
        if (mapy - ((tilegridy)*10)>(mapx - (tilegridx*20))/2) {
            tileposx = (tilegridx-1)*20
            tileposy = (tilegridy)*10
        } else {
            tileposx = (tilegridx)*20
            tileposy = (tilegridy-1)*10
        }
    }
    tilewontfit = false;
    
    
    if (tiletypes[tileid][3].length != 0) {
        if (placedtiles.length == 0) {
            console.log("no tiles yet, no way there is a compatible tile!")
            
        }
        tilewontfit = true
        console.log("tile has special requirements")
        for (let i = 0; i < placedtiles.length; i++) {
            for (let j = 0; j < tiletypes[tileid][3].length; j++){
                if (tiletypes[tileid][3][j] == placedtiles[i].type){
                    if ((placedtiles[i].tilepos[0] == tileposx - 20 || placedtiles[i].tilepos[0] == tileposx + 20) && (placedtiles[i].tilepos[1] == tileposy - 10 || placedtiles[i].tilepos[1] == tileposy + 10)){
                        console.log("hey! tile compatible!")
                        tilewontfit = false
                    }
                }
            }
        }
    } else {
        tilewontfit = false;
    }
    for (let i = 0; i < placedtiles.length; i++) {
        if (placedtiles[i].tilepos[0] == tileposx && placedtiles[i].tilepos[1] == tileposy){
            console.log("detected another tile!")
            tilewontfit = true;
            deletetile(placedtiles[i].uid)
        } 
        
    }
    if (!tilewontfit) {
        newtile = new placedTile(tileid, [tileposx, tileposy], [tilegridx, tilegridy])
        money = (money - tiletypes[tileid][5])
        updateincome();
    }
        
    
}

function startdragging(event){
    if (event.button == 2 || event.button == 1){    
        dragging = true;
        gamemap.style.cursor = "all-scroll"
        draginitialposx = event.pageX;
        draginitialposy = event.pageY;
        initialmarginx = Number(gamemap.style.marginLeft.replace("px", ""))
        initialmarginy = Number(gamemap.style.marginTop.replace("px", ""))
    }
}
function drag(event){
    if (dragging == true){
        newx = (((draginitialposx - event.pageX)/Number(gamemap.style.zoom)) * -1) + initialmarginx
        newy = (((draginitialposy - event.pageY )/Number(gamemap.style.zoom)) * -1) + initialmarginy
        if (newx <= 0) {
            gamemap.style.marginLeft = `${newx}px`;
            
        } else {
            gamemap.style.marginLeft = `0px`;
        }
        if (newy <= 0) {
            gamemap.style.marginTop = `${newy}px`;
            
        } else {
            gamemap.style.marginTop = `0px`;
        }
        
    }
}
function stopdragging(){
    dragging = false;
    gamemap.style.cursor = "unset"
}

function zoom(event){
    initialmarginx = Number(gamemap.style.marginLeft.replace("px", ""))
    initialmarginy = Number(gamemap.style.marginTop.replace("px", ""))
    if (Number(event.deltaY) < 0){
        newscale = Number(gamemap.style.zoom) + 1
        gamemap.style.marginLeft = `${initialmarginx-((Number(event.pageX/(newscale-1)))/newscale)}px`
        gamemap.style.marginTop = `${initialmarginy-((Number(event.pageY/(newscale-1)))/newscale)}px`
    } else {
        newscale = Number(gamemap.style.zoom) - 1
        gamemap.style.marginLeft = `${initialmarginx+((Number(event.pageX/(newscale+1)))/newscale)}px`
        if (initialmarginx+((Number(event.pageX/(newscale+1)))/newscale)>0 && newscale >= 1) {
            gamemap.style.marginLeft = "0px"
        }
        gamemap.style.marginTop = `${initialmarginy+((Number(event.pageY/(newscale+1)))/newscale)}px`
        if (initialmarginy+((Number(event.pageY/(newscale+1)))/newscale)>0 && newscale >= 1) {
            gamemap.style.marginTop = "0px"
        }
    }
    if (newscale >= 1) {
        gamemap.style.zoom = newscale
    } 
}

function fillopts(id){
    const row = document.getElementById("types");
    row.innerHTML = "";
    for (let i = 0; i < tiletypes.length; i++) {
        if (tiletypes[i][8] == id){
            new TileTypeMenu(i)
        }
    
    }
}

function playpause(){
    if (gameloop){
        gameloop = false;
        pause.src = "pause.png"
        timebar.style.backgroundColor = "red"
    } else {
        gameloop = true;
        pause.src = "play.png"
        timebar.style.backgroundColor = "lightgreen"
    }
}

function updateincome(){
    income = 0;
    for (let i = 0; i < placedtiles.length; i++) {
        income = (income + placedtiles[i].upkeep);
        
    
    }
    incomedisplay.innerHTML = `Income: $${(-income).toFixed(2)}`
    if (income<0){
        incomedisplay.style.color = "lightgreen"
    } else if (income>0) {
        incomedisplay.style.color = "red"
    } else {
        incomedisplay.style.color = "white"
    }
    moneytag.innerHTML = `$${money.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

}

function deletetile(uid){
    for (let i = 0; i < placedtiles.length; i++) {
        if (placedtiles[i].uid == uid) {
            currenttile = i
        }
    }
    placedtiles[currenttile].tile.remove()
    money = (money + placedtiles[currenttile].sellprice)
    placedtiles.splice(currenttile, 1)
    updateincome();
}


gamemap.addEventListener("contextmenu", (e) => {e.preventDefault()});
gamemap.addEventListener("mousedown", startdragging, false);
gamemap.addEventListener("mousemove", drag, false);
gamemap.addEventListener("mouseup", stopdragging, false);
gamemap.addEventListener("wheel", zoom, false);
gamemap.addEventListener("click", determinetile, false)

var time = 0;
var gameloop = false;

var day = 0;

const timer = ms => new Promise(res => setTimeout(res, ms))


async function load () {
    while (true){
        await timer(1000);
        if (gameloop)
        {
            
            time++;
            timebar.style.width = `${(((time%10)/10)*100)+10}%`
            if (day<Math.ceil((time/10)+0.1)) {
                updateincome();
                
            }
            money = (money - income/10);
            day = Math.ceil((time/10)+0.1)
            daydisplay.innerHTML = `Day: ${day}`
            updateincome()
            
        }
    }
}
load();