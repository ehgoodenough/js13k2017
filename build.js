var gulp = require("gulp")
var pump = require("pump")
var chalk = require("chalk")
var moment = require("moment")
var filesize = require("filesize")
var mapstream = require("map-stream")
var browsersync = require("browser-sync")
var debounce = require("debounce")
var chokidar = require("chokidar")
var rimraf = require("rimraf")

gulp.if = require("gulp-if")
gulp.uglify = require("gulp-uglify")
gulp.report = function() {
    var uptime = process.uptime()
    return mapstream(function(file, callback) {

        // Compute the time.
        var time = new Date()
        time = moment().format("h:mma")

        // Compute the file size.
        var size = Buffer.byteLength(file.contents)
        size = filesize(size, {spacer: "", exponent: 1})

        // Compute the process duration.
        var duration = new Number(process.uptime() - uptime).toFixed(3) + "s"

        // Log it!!
        console.log(chalk.green([
            "[" + time + "]",
            "(" + size + ")",
            "(" + duration + ")",
        ].join(" ")))

        callback(null, file)
    })
}

var HOST = "127.0.0.1"
var PORT = 13312
var IS_JS = /.js$/
var UGLIFY = {
    mangle: {
        toplevel: true,
        // properties: true,
    },
    compress: {
        unsafe: true,
    }
}

var build = {}

rimraf("./builds", () => {
    chokidar.watch("./source").on("all", debounce((event) => {
        pump([
            gulp.src([
                "source/index.html",
                "source/index.css",
                "source/index.js",
            ]),
            gulp.if(IS_JS, gulp.uglify(UGLIFY)),
            gulp.if(IS_JS, gulp.report()),
            gulp.dest("./builds/web"),
        ], (error) => {
            if(error != undefined) {
                console.log(error)
            }

            if(build.server == undefined) {
                build.server = browsersync({
                    server: "./builds/web",
                    open: true, notify: false,
                    host: HOST, port: PORT,
                    logLevel: "silent"
                })
            } else {
                build.server.reload()
            }
        })
    }, 200, true))
})

// https://github.com/ehgoodenough/overclock/blob/6e695819d33c458322f7d24f7686ac1934a68b3d/build.js
