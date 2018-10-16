var before = document.getElementById("before");
var after = document.getElementById("after");

var beforeCtx = before.getContext("2d");
var afterCtx = after.getContext("2d");

var img = new Image();
шьп.crossOrigin = "Anonymous";
img.src = './image.png';
img.onload = processImage;

function processImage() {
    var W = img.naturalWidth;
    var H = img.naturalHeight;

    before.width = W;
    before.height = H;

    after.width = W;
    after.height = H;

    beforeCtx.drawImage(img, 0, 0);

    var beforeImData = beforeCtx.getImageData(0, 0, W, H);
    var afterImData = afterCtx.createImageData(W, H);

    function coord(x, y, c) {
        return (y * H + x) * 4 + c;
    }

    function filter(x, y, oldData, newData) {
        if (x == 0 || x == W - 1 || y == 0 || y == H - 1) {
            for (var ch = 0; ch < 4; ++ch) {
                var c = coord(x, y, ch)
                newData[c] = 0;
            }
            return;
        }

        var matrix = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        var sumX = [0, 0, 0];
        var sumY = [0, 0, 0];
        for (var ch = 0; ch < 3; ++ch) {
            for (var dy = -1; dy <= 1; ++dy) {
                for (var dx = -1; dx <= 1; ++dx) {
                    var c = coord(x + dx, y + dy, ch);
                    sumX[ch] += oldData[c] * matrix[dx + 1][dy + 1];
                    sumY[ch] += oldData[c] * matrix[dy + 1][dx + 1];
                }
            }
        }
        var sum = Math.sqrt(sumX[0] * sumX[0] + sumY[0] * sumY[0]) +
            Math.sqrt(sumX[1] * sumX[1] + sumY[1] * sumY[1]) +
            Math.sqrt(sumX[2] * sumX[2] + sumY[2] * sumY[2]);
        sum /= 10; // brightness

        var c2 = coord(x, y, 0);
        newData[c2] = sum;
        newData[c2 + 1] = sum;
        newData[c2 + 2] = sum;
        newData[c2 + 3] = 255;
    }
    for (var y = 0; y < H; ++y) {
        for (var x = 0; x < W; ++x) {
            filter(x, y, beforeImData.data, afterImData.data);
        }
    }
    afterCtx.putImageData(afterImData, 0, 0);
}
