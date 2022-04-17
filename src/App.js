import './App.css'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'

export default function App() {

  const [pos, setPos] = useState({})
  // const [flatpos, setFlatpos] = useState([])

  const posRef = useRef(pos)
  // const flatposRef = useRef(flatpos)

  useEffect(_ => {
    posRef.current = pos
  }, [pos])

  // useEffect(_ => {
  //   flatposRef.current = flatpos
  // }, [flatpos])

  const createFlatPos = (pos, target) => {
    let arr = []
    Object.keys(pos).map((key, value) => {
      if(target.name != key) { 
        arr.push({
          x: pos[key].x,
          y: pos[key].y,
          t: pos[key].t,
          l: pos[key].l
        })
      }
    })
    arr = [...new Set(arr)]
    return arr
  }

  const addPos = (obj1, obj2, obj3) => {
    const obj = {
      [obj1.name] : {
        x: obj1.getCenterPoint().x,
        y: obj1.getCenterPoint().y,
        t: obj1.top,
        l: obj1.left,
      },
      [obj2.name] : {
        x: obj2.getCenterPoint().x,
        y: obj2.getCenterPoint().y,
        t: obj1.top,
        l: obj1.left,
      },
      [obj3.name] : {
        x: obj3.getCenterPoint().x,
        y: obj3.getCenterPoint().y,
        t: obj1.top,
        l: obj1.left,
      }
    }
    setPos(obj)
  }

  const updateObjectPos = (options) => {
    setPos({...posRef.current, [options.target.name]: {
      x: options.target.getCenterPoint().x,
      y: options.target.getCenterPoint().y,
      t: options.target.top,
      l: options.target.left,
    }})
  }

  const flashGuideLine = (canvas, element,direction) => {
    let line
    if (direction === 'y') {
      line = canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], {
        stroke:     'black',
        selectable: false
      }))
    } else if(direction === 'x') {
      line = canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], {
        stroke:     'black',
        selectable: false
      }))
    }
    
    setTimeout(() => {
      let lineObjects = canvas.getObjects('line')
      for(let i in lineObjects) {
        canvas.remove(lineObjects[i])
      }
    }, 5000);
  }

  const checkMatch = (flatArr, options, canvas) => {
    flatArr.forEach(element => { 
      if(Math.round(element.y) == Math.round(options.target.getCenterPoint().y)) {
        console.log('FULL X LINE');
        flashGuideLine(canvas,element,'y')
      }
      if(Math.round(element.x) == Math.round(options.target.getCenterPoint().x)) {
        console.log('FULL Y LINE');
        flashGuideLine(canvas,element,'x')
      }
    }); 
  }

  useEffect(_ => {
    // let grid = 25
    // let totalGridWidth = 800 //window.innerWidth
    let canvas = new fabric.Canvas('area52', {selection: false})

    // drawGrid(canvas, grid, totalGridWidth)
    // snapToGrid(canvas, grid)
       
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
      checkMatch(flatArr, options, canvas)
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
      <canvas id="area52" width={window.innerWidth -5} height={window.innerHeight -5}></canvas>
      {/* {JSON.stringify(pos, null, 2)} */}
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
    width:    100,
    height:   100,
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
