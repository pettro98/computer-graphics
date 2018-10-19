var canvas = document.getElementById("lab03");
var ctx = canvas.getContext("2d");
var gridSize = 10;

var waiting = null;
var prevX = 0;
var prevY = 0;

function line(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var dx = deltaX / deltaY;
    var dy = deltaY / deltaX;
    var eps = 0;
    var horizontal = Math.abs(deltaX) >= Math.abs(deltaY);
    var dcx = (horizontal) ? 0 : ((deltaX >= 0) ? 1 : -1);
    var dcy = (horizontal) ? ((deltaY >= 0) ? 1 : -1) : 0;
    var incX = (horizontal) ? ((deltaX >= 0) ? 1 : -1) : 0;
    var incY = (horizontal) ? 0 : ((deltaY >= 0) ? 1 : -1);
    for (var cx = x1, cy = y1; (horizontal) ? ((incX > 0) ? cx <= x2 : cx >= x2) : ((incY > 0) ? cy <= y2 : cy >= y2); cx += incX, cy += incY) {
        if (Math.abs(eps) >= 0.5) {
            eps -= (eps >= 0) ? 1 : -1;
            cy += dcy;
            cx += dcx;
        }
        ctx.fillRect(cx * gridSize, cy * gridSize, gridSize, gridSize);
        eps += (horizontal) ? dy : dx;
    }
}

function circle(x0, y0, x1, y1) {
    var r = Math.floor(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
    function draw(x, y) {
        ctx.fillRect((x + x0) * gridSize, (y + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((x + x0) * gridSize, (-y + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((-x + x0) * gridSize, (-y + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((-x + x0) * gridSize, (y + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((y + x0) * gridSize, (x + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((y + x0) * gridSize, (-x + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((-y + x0) * gridSize, (-x + y0) *gridSize, gridSize, gridSize);
        ctx.fillRect((-y + x0) * gridSize, (x + y0) *gridSize, gridSize, gridSize);
    }
    var cy = r;
    var d = 3 - 2 * cy;
    for (var cx = 0; cx <= cy; ++cx) {
        draw(cx, cy);
        if (d < 0) {
            d = d + 4 * cx + 6;
        } else {
            d = d + 4 * (cx - cy) + 10;
            --cy;
        }
    }
}

canvas.addEventListener("click", function (event) {
    event.preventDefault();
    if (waiting === "LMB") {
        line(prevX, prevY, Math.floor(event.offsetX / gridSize), Math.floor(event.offsetY / gridSize));
        waiting = null;
    } else {
        waiting = "LMB";
        prevX = Math.floor(event.offsetX / gridSize);
        prevY = Math.floor(event.offsetY / gridSize);
        return;
    }

});

canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    if (waiting === "RMB") {
        circle(prevX, prevY, Math.floor(event.offsetX / gridSize), Math.floor(event.offsetY / gridSize));
        waiting = null;
    } else {
        waiting = "RMB";
        prevX = Math.floor(event.offsetX / gridSize);
        prevY = Math.floor(event.offsetY / gridSize);
        return;
    }
});
