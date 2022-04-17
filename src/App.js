import './App.css'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'

export default function App() {

  const [pos, setPos] = useState({})
  const posRef = useRef(pos)

  useEffect(_ => {
    posRef.current = pos
  }, [pos])

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
        t: obj2.top,
        l: obj2.left,
      },
      [obj3.name] : {
        x: obj3.getCenterPoint().x,
        y: obj3.getCenterPoint().y,
        t: obj3.top,
        l: obj3.left
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
    let lineProperty = {
      stroke: 'black',
      selectable: false
    }
    if (direction === 'y') {
      line = canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], lineProperty))
    } else if(direction === 'x') {
      line = canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], lineProperty))
    }
    
    setTimeout(() => {
      let lineObjects = canvas.getObjects('line')
      for(let i in lineObjects) {
        canvas.remove(lineObjects[i])
      }
    }, 1000);
  }

  const checkMatch = (flatArr, options, canvas) => {
    flatArr.forEach(element => { 
      if(((Math.round(element.y) > Math.round(options.target.getCenterPoint().y)) 
      &&  (Math.round(element.y) - Math.round(options.target.getCenterPoint().y) < 10))
      || ((Math.round(element.y) < Math.round(options.target.getCenterPoint().y)) 
      &&  (Math.round(options.target.getCenterPoint().y) - Math.round(element.y) < 10))  
      ){
        // console.log('FULL X LINE');
        flashGuideLine(canvas,element,'y')
        // console.log(`
        //   CalculatedTop: ${(element.y - (((options.target.getCenterPoint().y - options.target.top)*2) / 2))}
        //   Top: ${options.target.top}
        //   Calculated Height: ${((options.target.getCenterPoint().y - options.target.top)*2)}
        //   Target Center y : ${options.target.getCenterPoint().y}
        //   cy: ${element.y}
        // `)
        options.target.set({
          top:  (element.y - (((options.target.getCenterPoint().y - options.target.top)*2) / 2))
        }).setCoords()
      }
      if(((Math.round(element.x) > Math.round(options.target.getCenterPoint().x)) 
      &&  (Math.round(element.x) - Math.round(options.target.getCenterPoint().x) < 10))
      || ((Math.round(element.x) < Math.round(options.target.getCenterPoint().x)) 
      &&  (Math.round(options.target.getCenterPoint().x) - Math.round(element.x) < 10))  
      ){
        // console.log('FULL Y LINE');
        flashGuideLine(canvas,element,'x')
        // console.log(`
        //   CalculatedLeft: ${(element.x - (((options.target.getCenterPoint().x - options.target.left)*2) / 2))}
        //   Left: ${options.target.left}
        //   Calculated width: ${((options.target.getCenterPoint().x - options.target.left)*2)}
        //   Target Center x : ${options.target.getCenterPoint().x}
        //   cx: ${element.x}
        // `)
        options.target.set({
          left:  (element.x - (((options.target.getCenterPoint().x - options.target.left)*2) / 2))
        }).setCoords()
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
      checkMatch(flatArr, options, canvas)
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
