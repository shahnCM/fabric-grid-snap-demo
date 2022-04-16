import './App.css'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'

export default function App() {

  const [pos, setPos] = useState({})
  const [flatpos, setFlatpos] = useState([])

  const posRef = useRef(pos)
  const flatposRef = useRef(flatpos)

  useEffect(_ => {
    posRef.current = pos
  }, [pos])

  useEffect(_ => {
    flatposRef.current = flatpos
  }, [flatpos])

  const createFlatPos = (pos, target) => {
    let arr = []
    Object.keys(pos).map((key, value) => {
      if(target.name != key) { 
        arr.push(pos[key].x)
        arr.push(pos[key].y) 
      }
    })
    arr = [...new Set(arr)]
    return arr
  }

  const addPos = (obj1, obj2, obj3) => {
    const obj = {
      [obj1.name] : {
        x: obj1.getCenterPoint().x,
        y: obj1.getCenterPoint().y
      },
      [obj2.name] : {
        x: obj2.getCenterPoint().x,
        y: obj2.getCenterPoint().y
      },
      [obj3.name] : {
        x: obj3.getCenterPoint().x,
        y: obj3.getCenterPoint().y
      }
    }

    setPos(obj)
  }

  const updateObjectPos = (options) => {
    setPos({...posRef.current, [options.target.name]: {
      x: options.target.getCenterPoint().x,
      y: options.target.getCenterPoint().y
    }})
  }

  const checkMatch = (flatArr, options) => {
    if(flatArr.includes(options.target.getCenterPoint().x)) {
      // Full Y Line Flash
      console.log('Full Y Line Flash')
    }
    if(flatArr.includes(options.target.getCenterPoint().y)) {
      // Full X Line Flash
      console.log('Full X Line Flash')
    }
  }

  useEffect(_ => {

    let grid = 25
    let totalGridWidth = 800 //window.innerWidth
    let canvas = new fabric.Canvas('area52', {selection: false})

    drawGrid(canvas, grid, totalGridWidth)
    snapToGrid(canvas, grid)
       
    Promise.all([
      addRectangle(canvas, '#D7A9E3FF'),
      addRectangle(canvas, '#8BBEE8FF'),
      addCircle(canvas, '#A8D5BAFF')
    ]).then(([obj1, obj2, obj3]) => {
      addPos(obj1, obj2, obj3)
    })

    // On Move
    canvas.on('object:moving', options => {
      let flatArr = createFlatPos(posRef.current, options.target)
      checkMatch(flatArr, options)
      updateObjectPos(options)
    })

    canvas.on('object:scaling', options => {
      let flatArr = createFlatPos(posRef.current, options.target)
      checkMatch(flatArr, options)
      updateObjectPos(options)
    })

  }, []);

  return (
    <div className="App">
      <canvas id="area52" width="800" height="800"></canvas>
      {JSON.stringify(pos, null, 2)}
    </div>
  )
}

function drawGrid(canvas, grid, totalGridWidth) {
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
  let name = 'Rectangle-' + Math.floor(1000 + Math.random() * 9000)
  let object = new fabric.Rect({
    name:     name,
    left:     100,
    top:      100,
    width:    50,
    height:   50,
    fill:     color, //'#D7A9E3FF',
    originX:  'left',
    originY:  'top',
  })
  canvas.add(object)
  return object
}

function addCircle(canvas, color) {
  let name = 'Circle-' + Math.floor(1000 + Math.random() * 9000)
  let object = new fabric.Circle({
    name:     name,
    left:     300,
    top:      300,
    radius:   50,
    fill:     color, //'#A8D5BAFF',
    originX:  'left',
    originY:  'top',
  })
  canvas.add(object)
  return object;
}
