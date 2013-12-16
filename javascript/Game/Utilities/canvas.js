

Game.Utilities.Canvas.drawLine = function (ctx, x1, y1, x2, y2, inWidth, inColor) {

    var width = inWidth ? inWidth : 1;
    var color = inColor ? inColor : "#ffffff";
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();


}