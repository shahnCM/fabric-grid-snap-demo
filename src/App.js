import './App.css'
import { fabric } from 'fabric'
import { useEffect } from 'react'

function App() {

  useEffect(_ => {

    var grid = 25
    let totalGridWidth = window.innerWidth
    var canvas = new fabric.Canvas('area52', {selection: false})
    
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
    
    // add objects
    canvas.add(new fabric.Rect({
      left:     100,
      top:      100,
      width:    50,
      height:   50,
      fill:     '#D7A9E3FF',
      originX:  'left',
      originY:  'top',
    }))

    // add objects
    canvas.add(new fabric.Rect({
      left:     200,
      top:      100,
      width:    50,
      height:   50,
      fill:     '#8BBEE8FF',
      originX:  'left',
      originY:  'top',
    }))
    
    canvas.add(new fabric.Circle({
      left:     300,
      top:      300,
      radius:   50,
      fill:     '#A8D5BAFF',
      originX:  'left',
      originY:  'top',
    }))
    
    // snap to grid
    canvas.on('object:moving', options => {
      if (Math.round(options.target.left / grid * 2) % 2 == 0 
      &&  Math.round(options.target.top / grid * 2) % 2 == 0) {
        options.target.set({
          left: Math.round(options.target.left / grid) * grid,
          top:  Math.round(options.target.top / grid) * grid
        }).setCoords()
      }
    })
    
  }, [])



  return (
    <div className="App">
      <canvas id="area52" width={window.innerWidth} height={window.innerWidth}></canvas>
    </div>
  )
}

export default App
