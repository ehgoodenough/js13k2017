var DEFAULT_SIZE = 8
var DEFAULT_ANCHOR = 0
var DEFAULT_POSITION = 0
var DEFAULT_COLOR = "hotpink"

var FRAME_WIDTH = 640
var FRAME_HEIGHT = 360

/////////////
// Canvas //
///////////

var canvas = document.createElement("canvas")
document.getElementById("frame").appendChild(canvas)
canvas.context = canvas.getContext("2d")
canvas.width = FRAME_WIDTH
canvas.height = FRAME_HEIGHT

canvas.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height)
}

canvas.render = function(entity) {
    if(entity.type == "circle") {
        this.renderCircle(entity)
    } else {
        this.renderRectangle(entity)
    }
}

canvas.renderRectangle = function(entity) {
    this.context.fillStyle = entity.color || DEFAULT_COLOR
    this.context.fillRect(
        Math.floor(entity.position.x + (entity.width * ((entity.anchor && entity.anchor.x) || DEFAULT_ANCHOR) * -1) ),
        Math.floor(entity.position.y + (entity.height * ((entity.anchor && entity.anchor.y) || DEFAULT_ANCHOR) * -1) ),
        entity.width || DEFAULT_SIZE,
        entity.height || DEFAULT_SIZE
    )
}

canvas.renderCircle = function(entity) {
    this.context.fillStyle = entity.color || DEFAULT_COLOR
    this.context.beginPath()
    this.context.arc(
        entity.position.x || DEFAULT_POSITION,
        entity.position.y || DEFAULT_POSITION,
        entity.size / 2 || DEFAULT_SIZE,
        0,
        Math.PI * 2,
        false
    )
    this.context.fill()
}

// canvas.render({width: 32, height: 32, position: {x: 32, y: 32}, anchor: {x: 0.5, y: 0.5}})
// canvas.render({type: "circle", position: {x: 32, y: 32}, size: 32})

///////////////
// pianokeys //
/////////////

var pianokeys = []
var NUM_OF_KEYS = 22

// White keys
for(var k = 1; k < NUM_OF_KEYS; k += 1) {
    pianokeys.push({
        anchor: {x: 0.5, y: 0},
        position: {x: k * (32 + 2), y: 120},
        width: 32,
        height: 32 * 4,
        color: "#FFF"
    })
}

// Black keys
for(var k = 1; k < NUM_OF_KEYS; k += 1) {
    if((k % 7) % 4 == 0) {
        continue
    }
    pianokeys.push({
        anchor: {x: 0.5, y: 0},
        position: {x: k * (32 + 2) + 16, y: 128},
        width: 16, height: 32 * 2,
        color: "#000"
    })
}

var player = {
    position: {x: 64, y: 220},
    anchor: {x: 0.5, y: 0.5},
    width: 32, height: 32,
    distance: 0
}

var loop = function(func) {
    
    var speed = 1.5
    
    ///////////////
    // Updating //
    /////////////
    
    pianokeys.forEach(function(pk) {
        pk.position.x -= speed
        if(pk.position.x + (pk.width * pk.anchor.x) < 0) {
            pk.position.x += (NUM_OF_KEYS - 1) * (32+2)
        }
    })
    
    player.distance += speed
    // player.position.y = 220 + (Math.sin(player.distance / 9) * 10)
    
    ////////////////
    // Rendering //
    //////////////
    
    canvas.clear()

    pianokeys.forEach(function(entity) {
        canvas.render(entity)
    })
    
    canvas.render(player)
    
    //////////////
    // Looping //
    ////////////
    
    window.requestAnimationFrame(function() {
        loop()
    })
}

loop()
