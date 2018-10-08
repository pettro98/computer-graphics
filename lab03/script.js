var canvas = document.getElementById("lab03");
var ctx = canvas.getContext("2d");
var gridSize = 10;

var waiting = null;
var prevX = 0;
var prevY = 0;

function lineTo(x, y) {
    x = Math.floor(x / gridSize);
    y = Math.floor(y / gridSize);
    var dx = Math.abs(x - prevX);
    var dy = Math.abs(y - prevY);
    var err = 0;
    var derr = dy / dx;
    var cy = prevY;
    var dir = (y - prevY > 0) ? 1 : -1;
    for (var cx = prevX; cx <= x; ++cx) {
        ctx.fillRect(cx * gridSize, cy * gridSize, gridSize, gridSize);
        err = err + derr;
        if (err >= 0.5) {
            cy = cy + dir;
            err = err - 1;
        }
    }
}

function circleTo(x, y) {
    x = Math.floor(x / gridSize);
    y = Math.floor(y / gridSize);
    var R = Math.floor(Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)));
    var cx = 0;
    var cy = R;
    var d = 1 - 2 * R;
    var err = 0;
    while (cy >= 0) {
        ctx.fillRect((prevX + cx) * gridSize, (prevY + cy) * gridSize, gridSize, gridSize);
        ctx.fillRect((prevX + cx) * gridSize, (prevY - cy) * gridSize, gridSize, gridSize);
        ctx.fillRect((prevX - cx) * gridSize, (prevY + cy) * gridSize, gridSize, gridSize);
        ctx.fillRect((prevX - cx) * gridSize, (prevY - cy) * gridSize, gridSize, gridSize);
        err = 2 * (d + cy) - 1;
        if ((d < 0) && (err <= 0)) {
            d += 2 * ++cx + 1;
            continue;
        }
        if ((d > 0) && (err > 0)) {
            d -= 2 * --cy + 1;
            continue;
        }
        d += 2 * (++cx - cy--);
    }
}

canvas.addEventListener("click", function (event) {
    event.preventDefault();
    if (!waiting) {
        waiting = "LMB";
        prevX = Math.floor(event.offsetX/gridSize);
        prevY = Math.floor(event.offsetY/gridSize);
        return;
    }
    if (waiting === "LMB") {
        lineTo(event.offsetX, event.offsetY);
        waiting = null;
    }
});

canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    if (!waiting) {
        waiting = "RMB";
        prevX = Math.floor(event.offsetX / gridSize);
        prevY = Math.floor(event.offsetY / gridSize);
        return;
    }
    if (waiting === "RMB") {
        circleTo(event.offsetX, event.offsetY);
        waiting = null;
    }
});
