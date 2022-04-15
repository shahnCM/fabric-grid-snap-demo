## Snapping feature implementation for FABRIC JS

```
var canvas /* = grab the canvas element from HTML with id */ ;
var grid = 25
canvas.on('object:moving', options => {
    if (Math.round(options.target.left / grid * 2) % 2 == 0 
    &&  Math.round(options.target.top / grid * 2) % 2 == 0) {
    options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top:  Math.round(options.target.top / grid) * grid
    }).setCoords()
    }
})
```