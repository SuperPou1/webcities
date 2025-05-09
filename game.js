const gamemap = document.getElementById("gamemap");
gamemap.style.zoom = 1

var dragging = false;
var draginitialposx;
var tileimage;

class TileTypeMenu {
    constructor(id, image, desc, price)
    {
        this.table = document.getElementById("types")
        this.row = document.createElement("tr")
        this.cell = document.createElement("td")
        this.cell.colSpan = 3
        this.row.setAttribute("onclick", `setimg('${image}')`)
        this.image = document.createElement("img")
        this.image.src = image
        this.cell.appendChild(this.image)
        this.desc = document.createTextNode(desc)
        this.cell.appendChild(this.desc)
        this.row.appendChild(this.cell)
        this.table.appendChild(this.row)
}
}

function startdragging(event){
    console.log(event.button)
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
        console.log("dragged "+draginitialposx+" "+event.pageX);
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
function determinetile(event){
    if (tileimage==null){
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
    

    const newtile = document.createElement("div");
    newtile.style.width = "40px"
    newtile.style.height = "20px"
    newtile.style.position = "absolute"
    newtile.style.marginLeft = `${tileposx}px`;
    newtile.style.marginTop = `${tileposy}px`;
    newtile.style.background = `url(${tileimage})`;
    newtile.draggable = false
    newtile.style.userSelect = "none"
    
    gamemap.appendChild(newtile);
    console.log(tileposx+" "+tileposy+" "+event.offsetX)
}
function fillopts(id){
    const row = document.getElementById("types");
    row.innerHTML = "";
    if (id == 0){
        house = new TileTypeMenu(0, "house0.png", "a residential house.", 690)
    } else if (id == 1) {
        road1 = new TileTypeMenu(1, "road0.png", "a road.", 3423423)
        road2 = new TileTypeMenu(2, "road1.png", "a different road.", 3423423)
        road3 = new TileTypeMenu(3, "road2.png", "a turning road.", 3423423)
        road4 = new TileTypeMenu(4, "road3.png", "a different turning road.", 3423423)
    }
}

function setimg(image){
    tileimage = image
}
gamemap.addEventListener("contextmenu", (e) => {e.preventDefault()});
gamemap.addEventListener("mousedown", startdragging, false);
gamemap.addEventListener("mousemove", drag, false);
gamemap.addEventListener("mouseup", stopdragging, false);
gamemap.addEventListener("wheel", zoom, false);
gamemap.addEventListener("click", determinetile, false)