var before = document.getElementById("before");
var after = document.getElementById("after");

var beforeCtx = before.getContext("2d");
var afterCtx = after.getContext("2d");

var img = new Image();
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
                newData[c] = oldData[c];
            }
            return;
        }
        for (var ch = 0; ch < 4; ++ch) {
            var sum = 0;
            for (var dy = -1; dy <= 1; ++dy) {
                for (var dx = -1; dx <= 1; ++dx) {
                    sum += oldData[coord(x + dx, y + dy, ch)];
                }
            }
            newData[coord(x, y, ch)] = sum / 9;
        }
    }

    for (var y = 0; y < H; ++y) {
        for (var x = 0; x < W; ++x) {
            filter(x, y, beforeImData.data, afterImData.data);
        }
    }

    afterCtx.putImageData(afterImData, 0, 0);
}
