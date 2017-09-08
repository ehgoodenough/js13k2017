var DEFAULT_SIZE = 8
var DEFAULT_ANCHOR = 0.5
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
    this.context.clearRect(0, 0, this.element.width, this.element.height)
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
        Math.floor(entity.position.x + (entity.width * (entity.anchor && entity.anchor.x) || DEFAULT_ANCHOR) * -1),
        Math.floor(entity.position.y + (entity.height * (entity.anchor && entity.anchor.y) || DEFAULT_ANCHOR) * -1),
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
