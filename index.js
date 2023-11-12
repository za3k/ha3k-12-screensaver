function rand(min, max) {
    return Math.random() * (max-min) + min;
}
function randInt(min, max) {
    return Math.floor(rand(min, max+1));
}
function randChoice(arr) {
    return arr[randInt(0, arr.length-1)];
}

function tickScreen() {
    var x = this.data("x");
    var y = this.data("y");
    var h = this.data("h");
    var w = this.data("w");
    const xVel = this.data("xVel");
    const yVel = this.data("yVel");
    x += xVel;
    y += yVel;
    this.data("x", x).data("y", y);
    if (x < 0 || x > w) this.data("xVel", -xVel);
    if (y < 0 || y > h) this.data("yVel", -yVel);
    this.css("--x", x + "px").css("--y", y + "px");
}

$.fn.addScreensaver = function () {
    // Size correctly
    const depth = this.parents(".screen").length + 1;
    const s = makeScreen()
    const baseHeight = Math.min($("body").height(), $("body").width()/16*10);
    s.css("height", baseHeight*Math.pow(2, -depth)+ "px");
    s.css("--border-size", 20*Math.pow(2, -depth) + "px");
    s.css("z-index", depth);
    this.prepend(s);

    // Make the smaller screen bounce
    if (!this.is("body")) {
        const h = s.parent().height()-s.outerHeight(),
              w = s.parent().width()-s.outerWidth();
        s.data("h", h).data("w", w);
        const x = rand(0, w), y = rand(0, h);
        s.css("--x", x);
        s.css("--y", y);
        s.data("x", x).data("y", y);
        s.data("xVel", randChoice([-1, 1])*Math.pow(2, 1-depth));
        s.data("yVel", randChoice([-1, 1])*Math.pow(2, 1-depth));
    }
    s.css("animation-duration", rand(0.4, 2.2) + "s");
    return this;
}

function tick() {
    $(".screen-border").each((i, e) => {
        tickScreen.bind($(e))();
    });
}

function main() {
    $("body").prepend(makeScreen())
    do {
      s = $(".screen:empty")
      if (s.width() < 50) break;
      s.addScreensaver();
    } while(1);
    setInterval(tick, 10);
}

function makeScreen() {
    return $('<div class="screen-border"><div class="screen"></div></div>');
}

$(document).ready((ev) => {
    main();
});
