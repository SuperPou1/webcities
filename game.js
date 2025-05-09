const gamemap = document.getElementById("gamemap");
gamemap.style.zoom = 1

var tiletypes = [
    ["house0.png", 400, [], [1,2,3,4], "a residential house", 500, 1],
    ["road0.png", 200, [], [], "a road", 300, 1],
    ["road1.png", 200, [], [], "a different road", 300, 1],
    ["road2.png", 200, [], [], "a turning road", 300, 1],
    ["road3.png", 200, [], [], "a different turning road", 300, 1],
    ["talltiles.png", 500, [], [], "some skyscrapers", 600, 2]
]

var dragging = false;
var draginitialposx;
var tileid;
var placedtiles = [];



class TileTypeMenu {
    constructor(id)
    {
        this.table = document.getElementById("types")
        this.row = document.createElement("tr")
        this.cell = document.createElement("td")
        this.cell.colSpan = 3
        this.row.setAttribute("onclick", `tileid = ${id}`)
        this.image = document.createElement("img")
        this.image.src = tiletypes[id][0]
        this.cell.appendChild(this.image)
        this.desc = document.createTextNode(tiletypes[id][4])
        this.cell.appendChild(this.desc)
        this.row.appendChild(this.cell)
        this.table.appendChild(this.row)
    }
}

class placedTile {
    constructor(id, image, sellprice, makesplacable, tilepos, tilegridpos, options){
        this.tile = document.createElement("div");
        this.tile.style.background = `url("${image}")`;
        this.tile.style.width = "40px"
        this.tile.style.height = `${tiletypes[id][6]*20}px`
        this.tile.style.position = "absolute"
        this.tile.style.marginLeft = `${tilepos[0]}px`;
        this.tile.style.marginTop = `${tilepos[1]-((tiletypes[id][6]-1)*20)}px`;
        this.tile.draggable = false
        this.tile.style.userSelect = "none"
        placedtiles.push([id, image, sellprice, makesplacable, tilepos, tilegridpos, options])
        this.tile.id = placedtiles.length - 1
        gamemap.appendChild(this.tile);
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
    for (let i = 0; i < placedtiles.length; i++) {
        if (placedtiles[i][4][0] == tileposx && placedtiles[i][4][1] == tileposy){
            tilewontfit = true;
            console.log("detected another tile!")
            
        }
        
    }
    if (tiletypes[tileid][3].length != 0) {
        tilewontfit = true
        console.log("no compatible tile to place next to.")
    }
    if (!tilewontfit) {
        newtile = new placedTile(tileid, tiletypes[tileid][0], tiletypes[tileid][1], tiletypes[tileid][2], [tileposx, tileposy], [tilegridx, tilegridy], tiletypes[tileid][3])
    }
    
}

function startdragging(event){
    if (event.button == 2 || event.button == 1){    
        dragging = true;
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
}

function zoom(event){
    
    newscale = Number(gamemap.style.zoom) + (Number(event.deltaY)/1000*-1)
    if (Number(event.deltaY) < 0){
        newscale = Number(gamemap.style.zoom) + 1
    } else {
        newscale = Number(gamemap.style.zoom) - 1
    }
    if (newscale >= 1) {
        gamemap.style.zoom = newscale
    } 
}

function fillopts(id){
    const row = document.getElementById("types");
    row.innerHTML = "";
    if (id == 0){
        new TileTypeMenu(0)
        new TileTypeMenu(5)
    } else if (id == 1) {
        new TileTypeMenu(1)
        new TileTypeMenu(2)
        new TileTypeMenu(3)
        new TileTypeMenu(4)
    }
}


gamemap.addEventListener("contextmenu", (e) => {e.preventDefault()});
gamemap.addEventListener("mousedown", startdragging, false);
gamemap.addEventListener("mousemove", drag, false);
gamemap.addEventListener("mouseup", stopdragging, false);
gamemap.addEventListener("wheel", zoom, false);
gamemap.addEventListener("click", determinetile, false)