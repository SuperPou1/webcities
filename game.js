const gamemap = document.getElementById("gamemap");
gamemap.style.zoom = 1

var dragging = false;
var draginitialposx;


function startdragging(event){
    dragging = true;
    draginitialposx = event.pageX;
    draginitialposy = event.pageY;
    initialmarginx = Number(gamemap.style.marginLeft.replace("px", ""))
    initialmarginy = Number(gamemap.style.marginTop.replace("px", ""))
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
    mapx = Number((event.pageX/Number(gamemap.style.zoom))-Number(gamemap.style.marginLeft.replace("px", "")))
    mapy = Number((event.pageY/Number(gamemap.style.zoom))-Number(gamemap.style.marginTop.replace("px", "")))
    
    tilegridx = (Math.floor(mapx/20));
    tilegridy = (Math.floor(mapy/10));
    
    if (((tilegridx%2 == 1) && (tilegridy%2 == 1))||((tilegridx%2 == 0) && (tilegridy%2 == 0))){
        if (mapy - ((tilegridy+1)*10)>(mapx - (tilegridx*20))/-2) {
            tileposx = (tilegridx-1)*20
            tileposy = (tilegridy)*10
        } else {
            tileposx = (tilegridx-2)*20
            tileposy = (tilegridy-1)*10
        }
    } else {
        if (mapy - ((tilegridy)*10)>(mapx - (tilegridx*20))/2) {
            tileposx = (tilegridx-2)*20
            tileposy = (tilegridy)*10
        } else {
            tileposx = (tilegridx-1)*20
            tileposy = (tilegridy-1)*10
        }
    }
    

    const newtile = document.createElement("img");
    newtile.style.width = "40px"
    newtile.style.height = "20px"
    newtile.style.position = "absolute"
    newtile.style.marginLeft = `${tileposx-2.25}px`;
    newtile.style.marginTop = `${tileposy}px`;
    newtile.src = "house0.png";
    
    gamemap.appendChild(newtile);
    console.log(tileposx+" "+tileposy+" "+event.offsetX)
}

gamemap.addEventListener("contextmenu", (e) => {e.preventDefault()});
gamemap.addEventListener("mousedown", startdragging, false);
gamemap.addEventListener("mousemove", drag, false);
gamemap.addEventListener("mouseup", stopdragging, false);
gamemap.addEventListener("wheel", zoom, false);
gamemap.addEventListener("click", determinetile, false)