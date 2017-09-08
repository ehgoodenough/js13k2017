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

////////////
// Input //
//////////

var isDown = false

window.addEventListener("keydown", function(event) {
    if(!isDown) {
        isDown = Date.now()
    }
})

window.addEventListener("keyup", function(event) {
    isDown = false
})

///////////////
// Entities //
/////////////

var player = {
    position: {x: 64, y: FRAME_HEIGHT},
    anchor: {x: 0.5, y: 1},
    width: 32, height: 32,
    distance: 0,
    velocity: {y: 0},
}

var badguy = {
    position: {x: FRAME_WIDTH - 64, y: FRAME_HEIGHT},
    anchor: {x: 0.5, y: 1},
    width: 32, height: 32,
    color: "black",
}

function getDistance(a, b) {
    var x = a.x - b.x
    var y = a.y - b.y
    
    return Math.sqrt(x*x + y*y)
}

//////////////
// Looping //
////////////

var GRAVITY = 1

var loop = function(func) {
    
    var speed = 1.5
    var delta = 1000 / 60
    
    //////////////////////
    // Updating Player //
    ////////////////////
    
    player.distance += speed
    
    if(isDown) {
        // if(Date.now() - isDown < delta) {
            if(player.position.y == FRAME_HEIGHT) {
                player.velocity.y = -15
            }
        //  }
    }
    
    // Translation for Jumping
    player.position.y += player.velocity.y
    
    if(player.position.y > FRAME_HEIGHT) {
        player.position.y = FRAME_HEIGHT
        player.velocity.y = 0
    }
    
    // Deceleration via Gravity
    player.velocity.y += GRAVITY
    
    ///////////////////////
    // Updating Bad Guy //
    /////////////////////
    
    badguy.position.x -= 10
    
    if(getDistance(badguy.position, player.position) < 32) {
        throw "Game Over"
    }
    
    if(badguy.position.x < -10) {
        badguy.position.x = FRAME_WIDTH + 32
    }
    
    ////////////////
    // Rendering //
    //////////////
    
    canvas.clear()
    canvas.render(badguy)
    canvas.render(player)
    
    //////////////
    // Looping //
    ////////////
    
    window.requestAnimationFrame(function() {
        loop()
    })
}

loop()
