var canvas = document.getElementById("lab03");
var ctx = canvas.getContext("2d");
var gridSize = 10;

var waiting = null;
var prevX = 0;
var prevY = 0;

// TERNARY OPERATOR CHAOS
function line(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var dx = deltaX / deltaY;
    var dy = deltaY / deltaX;
    var eps = 0;
    var horizontal = Math.abs(deltaX) >= Math.abs(deltaY);
    // just flowers, berries later :))
    var dcx = (horizontal) ? 0 : ((deltaX >= 0) ? 1 : -1);
    var dcy = (horizontal) ? ((deltaY >= 0) ? 1 : -1) : 0;
    var incX = (horizontal) ? ((deltaX >= 0) ? 1 : -1) : 0;
    var incY = (horizontal) ? 0 : ((deltaY >= 0) ? 1 : -1);
    // OHHH YEEEAH, BABY, CRY, I WANT TO SEE YOUR TEARS OF BLOOD XDDDD
    for (var cx = x1, cy = y1; (horizontal) ? ((incX > 0) ? cx <= x2 : cx >= x2) : ((incY > 0) ? cy <= y2 : cy >= y2); cx += incX, cy += incY) {
        if (Math.abs(eps) >= 0.5) {
            eps -= (eps >= 0) ? 1 : -1;
            cy += dcy;
            cx += dcx;
        }
        ctx.fillRect(cx * gridSize, cy * gridSize, gridSize, gridSize);
        eps += (horizontal) ? dy : dx;
    }
    // approx. 350 rubber ducklings were destroyed while debugging THIS
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
        circleTo(event.offsetX, event.offsetY);
        waiting = null;
    } else {
        waiting = "RMB";
        prevX = Math.floor(event.offsetX / gridSize);
        prevY = Math.floor(event.offsetY / gridSize);
        return;
    }
});
