var canvas = document.getElementById('lab06');
var rect = canvas.getBoundingClientRect();
var offsetX = rect.left;
var offsetY = rect.top
var ctx = canvas.getContext('2d');
var buffer = [];
var bufferRect = [];
var countBuffer = 0;
var countBufferRect = 0;

function getMousePos(event) {
  var vvx = event.clientX - offsetX
  var vvy = event.clientY - offsetY
  ctx.fillRect(vvx, vvy, 3, 3);
  return {
    x: vvx,
    y: vvy
  };
}
var plot = function (x, y) {
  if (isFinite(x) && isFinite(y)) {
    setPixel(x, y, plot.color);
  }
};

function setPixel(x, y, c) {
  var p = ctx.createImageData(1, 1);
  p.data[0] = c.r;
  p.data[1] = c.g;
  p.data[2] = c.b;
  p.data[3] = c.a;
  var data = ctx.getImageData(x, y, 1, 1).data;
  if (data[3] <= p.data[3])
    ctx.putImageData(p, x, y);
}

function drawLine(x1, y1, x2, y2) {

  plot.color = { r: 0, g: 0, b: 0, a: 255 };
  var deltaX = Math.abs(x2 - x1);
  var deltaY = Math.abs(y2 - y1);
  var signX = x1 < x2 ? 1 : -1;
  var signY = y1 < y2 ? 1 : -1;
  var error = deltaX - deltaY;

  plot(x2, y2);
  while (x1 != x2 || y1 != y2) {
    plot(x1, y1);
    var error2 = error * 2;
    if (error2 > -deltaY) {
      error -= deltaY;
      x1 += signX;
    }
    if (error2 < deltaX) {
      error += deltaX;
      y1 += signY;
    }
  }
}

function vector__product(pt1, pt2) {
  return pt1[0] * pt2[1] - pt2[0] * pt1[1];
}
function scalar(pt1, pt2) {
  return pt1[0] * pt2[0] + pt1[1] * pt2[1];
}
function delta(pt1, pt2) {
  return [pt2[0] - pt1[0], pt2[1] - pt1[1]];
}
function normal(pt1, pt2) {
  return [pt2[1] - pt1[1], pt1[0] - pt2[0]];
}
function p_s(pt1, pt2, t) {
  return [pt1[0] + t * (pt2[0] - pt1[0]), pt1[1] + t * (pt2[1] - pt1[1])];
}

function cyrus_beck() {
  ctx.clearRect(0, 0, 1000, 1000);
  var orient = orientation();
  var tmpBuffer = [];
  var tmpCount = 0;
  console.log(orient);
  for (var i = 0; i < buffer.length; i += 2) {
    var t0 = 0, t1 = 1;
    var flag = true;
    for (var j = 0; j < bufferRect.length; j++) {
      var n;
      if (orient == 'anticlockwise') {
        if (j == bufferRect.length - 1) n = normal(bufferRect[0], bufferRect[j]);
        else n = normal(bufferRect[j + 1], bufferRect[j]);
      }
      else if (orient == 'clockwise') {
        if (j == bufferRect.length - 1) n = normal(bufferRect[j], bufferRect[0]);
        else n = normal(bufferRect[j], bufferRect[j + 1]);
      }
      else {
        alert('ERROR');
        return;
      }
      var pn = scalar(delta(buffer[i], buffer[i + 1]), n);
      var qn = scalar(delta(bufferRect[j], buffer[i]), n);
      if (pn != 0) {
        var t = -qn / pn;
        if (pn < 0) {
          if (t < t1) t1 = t;
        }
        else {
          if (t > t0) t0 = t;
        }
      }
      else if (qn < 0) flag = false;
    }
    if (t0 > t1) flag = false;
    if (flag) {
      var tmpBuffer1, tmpBuffer2;
      tmpBuffer1 = p_s(buffer[i], buffer[i + 1], t0);
      tmpBuffer2 = p_s(buffer[i], buffer[i + 1], t1);
      tmpBuffer.push([parseInt(tmpBuffer1[0]), parseInt(tmpBuffer1[1])]);
      tmpBuffer.push([parseInt(tmpBuffer2[0]), parseInt(tmpBuffer2[1])]);
      drawLine(parseInt(tmpBuffer1[0]), parseInt(tmpBuffer1[1]), parseInt(tmpBuffer2[0]), parseInt(tmpBuffer2[1]));
    }
  }

  for (var j = 0; j < bufferRect.length - 1; j++) {
    drawLine(bufferRect[j][0], bufferRect[j][1], bufferRect[j + 1][0], bufferRect[j + 1][1]);
  }
  drawLine(bufferRect[0][0], bufferRect[0][1], bufferRect[bufferRect.length - 1][0], bufferRect[bufferRect.length - 1][1]);
  buffer = [];
  buffer = tmpBuffer;
  console.log(buffer);
  tmpBuffer = [];
  bufferRect = [];
}
function orientation() {
  var product = [],
    count = 0;
  for (let i = 0; i < bufferRect.length - 2; i++) {
    product.push(vector__product(delta(bufferRect[i], bufferRect[i + 1]), delta(bufferRect[i], bufferRect[i + 2])));
  }
  product.push(vector__product(delta(bufferRect[bufferRect.length - 2], bufferRect[bufferRect.length - 1]), delta(bufferRect[bufferRect.length - 2], bufferRect[0])));
  product.push(vector__product(delta(bufferRect[bufferRect.length - 1], bufferRect[0]), delta(bufferRect[bufferRect.length - 1], bufferRect[1])));
  for (let j = 0; j < product.length; j++) {
    if (product[j] < 0) count--;
    else if (product[j] > 0) count++;
  }
  if (count == product.length) return 'anticlockwise';
  else if (count == -product.length) return 'clockwise';
  else return 'error';
}

var lineListener = function (event) {
  if (event.shiftKey) return;
  var mousePos = getMousePos(canvas);
  buffer.push([mousePos.x, mousePos.y]);
  console.log(buffer);
  if (buffer.length % 2 == 0) {
    drawLine(buffer[countBuffer][0], buffer[countBuffer][1], buffer[countBuffer + 1][0], buffer[countBuffer + 1][1]);
    countBuffer += 2;
    console.log(buffer);
  }
}

var rectListener = function (event) {
  event.preventDefault();
  var mousePos = getMousePos(event);
  bufferRect.push([mousePos.x, mousePos.y]);
}
var drawListener = function (event) {
  if (!event.shiftKey) return;
  cyrus_beck();
}

canvas.addEventListener('click', lineListener, false);
canvas.addEventListener('contextmenu', rectListener, false);
canvas.addEventListener('click', drawListener, false);
