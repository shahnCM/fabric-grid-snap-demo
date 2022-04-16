import './App.css'
import { fabric } from 'fabric'
import { useEffect } from 'react'

function App() {

  useEffect(_ => {

    let grid = 25
    let totalGridWidth = window.innerWidth
    let canvas = new fabric.Canvas('area52', {selection: false})
    drawGrid(canvas, grid, totalGridWidth)
    snapToGrid(canvas, grid)
    addRectangle(canvas, '#D7A9E3FF')
    addRectangle(canvas, '#8BBEE8FF')
    addCircle(canvas, '#A8D5BAFF')    
  }, [])

  return (
    <div className="App">
      <canvas id="area52" width={window.innerWidth} height={window.innerWidth}></canvas>
    </div>
  )
}

export default App

function drawGrid(canvas, grid, totalGridWidth) {
  // create grid
  for (var i = 0; i < (totalGridWidth / grid); i++) {
    //vertical lines
    canvas.add(new fabric.Line([i * grid, 0, i * grid, totalGridWidth], {
      stroke:     '#FCF6F5FF',
      selectable: false
    }))
    // horizontal lines
    canvas.add(new fabric.Line([0, i * grid, totalGridWidth, i * grid], {
      stroke:     '#FCF6F5FF',
      selectable: false
    }))
  }
}

function snapToGrid(canvas, grid) {
    canvas.on('object:moving', (options) => {
      if (Math.round(options.target.left / grid * 2) % 2 == 0 
      &&  Math.round(options.target.top / grid * 2) % 2 == 0) {
        options.target.set({
          left: Math.round(options.target.left / grid) * grid,
          top:  Math.round(options.target.top / grid) * grid
        }).setCoords()
      }
    })
}

function addRectangle(canvas, color) {
  canvas.add(new fabric.Rect({
    left:     100,
    top:      100,
    width:    50,
    height:   50,
    fill:     color, //'#D7A9E3FF',
    originX:  'left',
    originY:  'top',
  }))
}

function addCircle(canvas, color) {
  canvas.add(new fabric.Circle({
    left:     300,
    top:      300,
    radius:   50,
    fill:     color, //'#A8D5BAFF',
    originX:  'left',
    originY:  'top',
  }))
}
