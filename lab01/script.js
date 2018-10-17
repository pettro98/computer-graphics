var canvas = document.getElementById("lab01");
var ctx2d = canvas.getContext("2d");
ctx2d.fillStyle = "#0b0";
ctx2d.strokeStyle = "#080";
var rect = { x: 200, y: 200, h: 40, w: 40 };
var center = { x: 200, y: 200 };
var direction = "left";
function anim() {
    ctx2d.clearRect(center.x - rect.w, center.y - rect.h, rect.w * 2, rect.h * 2);
    ctx2d.strokeRect(center.x - rect.w / 2, center.y - rect.h / 2, rect.w, rect.h)
    ctx2d.fillRect(rect.x, rect.y, rect.w, rect.h, true);
    switch (direction) {
        case "left":
            rect.x--;
            if (rect.x + rect.w <= center.x) {
                direction = "up";
            }
            break;
        case "up":
            rect.y--;
            if (rect.y + rect.h <= center.y) {
                direction = "right";
            }
            break;
        case "right":
            rect.x++;
            if (rect.x >= center.x) {
                direction = "down";
            }
            break;
        case "down":
            rect.y++;
            if (rect.y >= center.y) {
                direction = "left";
            }
            break;
    }
}
setInterval(anim, 10);
canvas.addEventListener("mousemove", function (ev) {
    if (ev.buttons & 1 == 1) {
        ctx2d.clearRect(center.x - rect.w, center.y - rect.h, rect.w * 2, rect.h * 2);
        var dx = (center.x + ev.movementX > 400 || center.x + ev.movementX < 0) ? 0 : ev.movementX;
        var dy = (center.y + ev.movementY > 400 || center.y + ev.movementY < 0) ? 0 : ev.movementY;
        center.x += dx;
        center.y += dy;
        rect.x += dx;
        rect.y += dy;
        ctx2d.strokeRect(center.x - rect.w / 2, center.y - rect.h / 2, rect.w, rect.h)
        ctx2d.fillRect(rect.x, rect.y, rect.w, rect.h, true);
    }
});
