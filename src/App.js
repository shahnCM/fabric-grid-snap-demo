import './App.css'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'

export default function App() {

  const [pos, setPos] = useState({})
  const posRef = useRef(pos)

  useEffect(_ => {
    posRef.current = pos
  }, [pos])

  const addObjectPos = (obj1, obj2, obj3) => {
    setPos({
      [obj1.name] : {
        x: obj1.getCenterPoint().x,
        y: obj1.getCenterPoint().y,
        t: obj1.top,
        l: obj1.left,
        b: obj1.top  + (obj1.getCenterPoint().y - obj1.top) * 2,
        r: obj1.left + (obj1.getCenterPoint().x - obj1.left) * 2
      },
      [obj2.name] : {
        x: obj2.getCenterPoint().x,
        y: obj2.getCenterPoint().y,
        t: obj2.top,
        l: obj2.left,
        b: obj2.top  + (obj2.getCenterPoint().y - obj2.top) * 2,
        r: obj2.left + (obj2.getCenterPoint().x - obj2.left) * 2
      },
      [obj3.name] : {
        x: obj3.getCenterPoint().x,
        y: obj3.getCenterPoint().y,
        t: obj3.top,
        l: obj3.left,
        b: obj3.top  + (obj3.getCenterPoint().y - obj3.top) * 2,
        r: obj3.left + (obj3.getCenterPoint().x - obj3.left) * 2
      }
    })
  }

  const updateObjectPos = (options) => {
    setPos({...posRef.current, [options.target.name]: {
      x: options.target.getCenterPoint().x,
      y: options.target.getCenterPoint().y,
      t: options.target.top,
      l: options.target.left,
      b: options.target.top  + (options.target.getCenterPoint().y - options.target.top) * 2,
      r: options.target.left + (options.target.getCenterPoint().x - options.target.left) * 2
    }})
  }

  useEffect(_ => {
    let canvas = new fabric.Canvas('area52', {selection: false})
    // let grid = 25
    // let totalGridWidth = 800 //window.innerWidth
    // drawGrid(canvas, grid, totalGridWidth)
    // snapToGrid(canvas, grid)       

    Promise.all([
      addRectangle(canvas, '#D7A9E3FF'),
      addRectangle(canvas, '#8BBEE8FF'),
      addCircle(canvas, '#A8D5BAFF')
    ]).then(([obj1, obj2, obj3]) => {
      addObjectPos(obj1, obj2, obj3)
    })
    
    // On Move
    canvas.on('object:moving', options => {
      let flatArr = createFlatPos(posRef.current, options.target)
      checkCoordinations(flatArr, options, canvas)
      updateObjectPos(options)
    })

    // On Scale
    canvas.on('object:scaling', options => {
      let flatArr = createFlatPos(posRef.current, options.target)
      // checkCoordinations(flatArr, options, canvas)
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

function flashGuideLine (canvas, element, direction) {
  const lineProperty = {
    stroke: 'black',
    selectable: false
  }
  // Y: canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], lineProperty))
  // X: canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], lineProperty))

  if (direction === 'y') {
    canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], lineProperty))
  } else if(direction === 'x') {
    canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], lineProperty))
  } else if(direction === 't') {
    canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], lineProperty))
  } else if(direction === 'l') {
    canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], lineProperty))
  } else if(direction === 'b') {
    canvas.add(new fabric.Line([50, element[direction], window.innerWidth -50, element[direction]], lineProperty))
  } else if(direction === 'r') {
    canvas.add(new fabric.Line([element[direction], 50, element[direction], window.innerHeight -50], lineProperty))
  }
  
  setTimeout(() => {
    let lineObjects = canvas.getObjects('line')
    for(let i in lineObjects) {
      canvas.remove(lineObjects[i])
    }
  }, 1000);
}

function verticalSnap(options, element, pick=null) {
  let top;

  if(pick === null) {
    top = (element.y - (((options.target.getCenterPoint().y - options.target.top)*2) / 2))  
  } else if(pick === 't') {
    top = element.t
  } else if(pick === 'b') {
    top = element.b - ((options.target.getCenterPoint().y - options.target.top) * 2)
  }

  options.target.set({
    top: top  
  }).setCoords()
}

function horizontalSnap(options, element, pick = null) {
  let left;

  if(pick === null) {
    left = (element.x - (((options.target.getCenterPoint().x - options.target.left)*2) / 2))  
  } else if(pick === 'l') {
    left = element.l
  } else if(pick === 'r') {
    left = element.r - ((options.target.getCenterPoint().x - options.target.left) * 2)
  }

  options.target.set({
    left: left
  }).setCoords()
}

function checkCoordinations (flatArr, options, canvas) {
  flatArr.forEach(element => { 
    // Centre, Centre
    if(((Math.round(element.y) > Math.round(options.target.getCenterPoint().y)) 
    &&  (Math.round(element.y) - Math.round(options.target.getCenterPoint().y) < 10))
    || ((Math.round(element.y) < Math.round(options.target.getCenterPoint().y)) 
    &&  (Math.round(options.target.getCenterPoint().y) - Math.round(element.y) < 10))  
    ){
      flashGuideLine(canvas, element, 'y') // FULL X LINE
      verticalSnap(options, element)
    }
    if(((Math.round(element.x) > Math.round(options.target.getCenterPoint().x)) 
    &&  (Math.round(element.x) - Math.round(options.target.getCenterPoint().x) < 10))
    || ((Math.round(element.x) < Math.round(options.target.getCenterPoint().x)) 
    &&  (Math.round(options.target.getCenterPoint().x) - Math.round(element.x) < 10))  
    ){
      flashGuideLine(canvas, element, 'x') // FULL Y LINE
      horizontalSnap(options, element)
    }

    // Top, Left
    if(((Math.round(element.t) > Math.round(options.target.top)) 
    &&  (Math.round(element.t) - Math.round(options.target.top) < 10))
    || ((Math.round(element.t) < Math.round(options.target.top)) 
    &&  (Math.round(options.target.top) - Math.round(element.t) < 10))  
    ){
      flashGuideLine(canvas, element, 't') // FULL X LINE
      verticalSnap(options, element, 't')
    }
    if(((Math.round(element.l) > Math.round(options.target.left)) 
    &&  (Math.round(element.l) - Math.round(options.target.left) < 10))
    || ((Math.round(element.l) < Math.round(options.target.left)) 
    &&  (Math.round(options.target.left) - Math.round(element.l) < 10))  
    ){
      flashGuideLine(canvas, element, 'l') // FULL Y LINE
      horizontalSnap(options, element, 'l')
    }

    // Bottom, Right
    if(((Math.round(element.b) > Math.round(options.target.top + (options.target.getCenterPoint().y - options.target.top) * 2)) 
    &&  (Math.round(element.b) - Math.round(options.target.top + (options.target.getCenterPoint().y - options.target.top) * 2) < 10))
    || ((Math.round(element.b) < Math.round(options.target.top + (options.target.getCenterPoint().y - options.target.top) * 2)) 
    &&  (Math.round(options.target.top + (options.target.getCenterPoint().y - options.target.top) * 2) - Math.round(element.b) < 10))  
    ){
      flashGuideLine(canvas, element, 'b') // FULL X LINE
      verticalSnap(options, element, 'b')
    }
    if(((Math.round(element.r) > Math.round(options.target.left + (options.target.getCenterPoint().x - options.target.left) * 2)) 
    &&  (Math.round(element.r) - Math.round(options.target.left + (options.target.getCenterPoint().x - options.target.left) * 2) < 10))
    || ((Math.round(element.r) < Math.round(options.target.left + (options.target.getCenterPoint().x - options.target.left) * 2)) 
    &&  (Math.round(options.target.left + (options.target.getCenterPoint().x - options.target.left) * 2) - Math.round(element.r) < 10))  
    ){
      flashGuideLine(canvas, element, 'r') // FULL Y LINE
      horizontalSnap(options, element, 'r')
    }
  }); 
}

function createFlatPos(pos, target) {
  let arr = []
  Object.keys(pos).map((key, value) => {
    if(target.name !== key) { 
      arr.push({
        x: pos[key].x,
        y: pos[key].y,
        t: pos[key].t,
        l: pos[key].l,
        b: pos[key].b,
        r: pos[key].r
      })
    }
  })
  // unique collection
  arr = [...new Set(arr)]
  return arr
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

// function drawGrid(canvas, grid, totalGridWidth) {
//   for (var i = 0; i < (totalGridWidth / grid); i++) {
//     //vertical lines
//     canvas.add(new fabric.Line([i * grid, 0, i * grid, totalGridWidth], {
//       stroke:     '#FCF6F5FF',
//       selectable: false
//     }))
//     // horizontal lines
//     canvas.add(new fabric.Line([0, i * grid, totalGridWidth, i * grid], {
//       stroke:     '#FCF6F5FF',
//       selectable: false
//     }))
//   }
// }

// function snapToGrid(canvas, grid) {
//     canvas.on('object:moving', (options) => {
//       if (Math.round(options.target.left / grid * 2) % 2 == 0 
//       &&  Math.round(options.target.top / grid * 2) % 2 == 0) {
//         options.target.set({
//           left: Math.round(options.target.left / grid) * grid,
//           top:  Math.round(options.target.top / grid) * grid
//         }).setCoords()
//       }
//     })
// }
