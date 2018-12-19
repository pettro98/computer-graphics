var canvas = document.getElementById("lab08"),
  ctx = canvas.getContext("2d"),
  buffer = [];
var B = 'rgb(30,89,69)', A = 'rgb(192,192,192)';

var rectListener = function (event) {
  mouseClick(event, 0);
}
var pixelListener = function (event) {
  if (!event.shiftKey) return;
  mouseClick(event, 1);
}
function mouseClick(event, type) {
  var x, y;
  var rect = canvas.getBoundingClientRect(),
  x = event.clientX - rect.left,
    y = event.clientY - rect.top;
    event.preventDefault();
    if (type == 0) {
      if (event.which == 1) {
        if (event.shiftKey) return;
        buffer.push([x, y]);
        ctx.fillStyle = B;
        ctx.strokeStyle = B;
      if (buffer.length == 1) drawPixel([x, y]);
      if (buffer.length > 1) drawLine(buffer[buffer.length - 2], buffer[buffer.length - 1]);
    }
    else if (event.which == 3) {
      drawLine(buffer[buffer.length - 1], buffer[0]);
      buffer = [];
    }
  }
  else if (type == 1) {
    ctx.fillStyle = A;
    ctx.strokeStyle = A;
    drawPixel([x, y]);
    fill([x, y]);
  }

}
function drawPixel(pt) {
  ctx.fillRect(pt[0], pt[1], 1, 1);
}
function drawLine(pt1, pt2) {
  var x0 = pt1[0], x1 = pt2[0], y0 = pt1[1], y1 = pt2[1];
  var dX = Math.abs(x1 - x0);
  var dY = Math.abs(y1 - y0);
  var signX = x0 < x1 ? 1 : -1;
  var signY = y0 < y1 ? 1 : -1;

  var error = dX - dY;
  ctx.fillRect(x1, y1, 1, 1);
  while (x0 != x1 || y0 != y1) {
    ctx.fillRect(x0, y0, 1, 1);
    var error2 = error * 2;

    if (error2 > -dY) {
      error -= dY;
      x0 += signX;
    }
    if (error2 < dX) {
      error += dX;
      y0 += signY;
    }
  }
}
function fill(pt) {
  var stack = [];
  stack.push(pt);
  while (stack.length > 0) {
    var p = stack.pop();
    var x_min = p[0];
    while (eq__B([x_min - 1, p[1]]) == false)
    x_min--;
    var x_max = p[0];
    while (eq__B([x_max + 1, p[1]]) == false)
    x_max++;
    drawLine([x_min, p[1]], [x_max, p[1]]);
    top1:
    for (let i = x_min; i <= x_max; i++) {
      if (eq__B([i, p[1] - 1]) == false && eq__A([i, p[1] - 1]) == false) {
        stack.push([i, p[1] - 1]);
        break top1;
      }
    }
    top2:
    for (let i = x_min; i <= x_max; i++) {
      if (eq__B([i, p[1] + 1]) == false && eq__A([i, p[1] + 1]) == false) {
        stack.push([i, p[1] + 1]);
        break top2;
      }
    }
  }
}

function color(pt) {
  var imageData = ctx.getImageData(pt[0], pt[1], 1, 1);
  return imageData.data;
}
function eq__B(pt) {
  if (color(pt)[0] == 30 && color(pt)[1] == 89 && color(pt)[2] == 69)
  return true;
  return false;
}
function eq__A(pt) {
  if (color(pt)[0] == 192 && color(pt)[1] == 192 && color(pt)[2] == 192)
    return true;
    return false;
  }

  canvas.addEventListener('click', rectListener, false);
  canvas.addEventListener('contextmenu', rectListener, false);
  canvas.addEventListener('click', pixelListener, false);
