
function setup() {
  createCanvas(1000, 1000)
}

let origin = { x: 300, y: 30 }

function Edge(origin, theta, length) {
  push()
  translate(origin.x, origin.y)
  rotate(theta)
  rect(-10, -10, length+20, 20)
  ellipse(length, 0, 5, 5)
  pop()
  ellipse(origin.x, origin.y, 5, 5)
}

function solve(pos, l1, l2) {
  let x = pos.x - origin.x
  let y = pos.y - origin.y
  let dist = x*x + y*y

  let d1 = (dist + l1*l1 - l2*l2) / (2*l1*Math.sqrt(dist))
  let angle1 = Math.max(-1, Math.min(1, d1))
  let theta1 = Math.atan2(y, x) - Math.acos(angle1)

  let d2 = (dist - l1*l1 - l2*l2) / (2*l1*l2)
  let angle2 = Math.max(-1, Math.min(1, d2))
  let theta2 = Math.acos(angle2)
  return [theta1, theta2]
}

function move(pos) {
  fill(200)
  let l1 = 50
  let l2 = 105
  let ans = solve(pos, l1, l2)
  let theta1 = ans[0]
  let theta2 = ans[1]

  let p1 = origin
  let p2 = {
    x: p1.x + l1*Math.cos(theta1),
    y: p1.y + l1*Math.sin(theta1)
  }
  let p3 = {
    x: p1.x + l2*Math.cos(theta1+theta2),
    y: p1.y + l2*Math.sin(theta1+theta2)
  }

  let edge1 = Edge(p1, theta1, l1)
  let edge3 = Edge(p3, theta1, l1)
  let edge2 = Edge(p2, theta1+theta2, l2)
  let edge4 = Edge(p1, theta1+theta2, l2)

  fill(0);
  let angle1 = theta1 * 180 / Math.PI
  let angle2 = 360 - angle1 - (theta2 * 180 / Math.PI) - 180
  angle1 = floor(angle1)
  angle2 = floor(angle2)
  text("angle 1: " + angle1, 10, 30);
  text("angle 2: " + angle2, 10, 50);
  window.angle1 = angle1
  window.angle2 = angle2
}

function mouseClicked() {
  let angle1 = window.angle1
  let angle2 = window.angle2
  if (15 < angle1 && angle1 < 165
    && 15 < angle2 && angle2 < 165) {
    $.ajax({
      method: 'POST',
      url: '/move?angle1=' + angle1 + '&angle2=' + angle2
    }).then((res) => {
      console.log(res)
    })
  }
}


let polygons = pathDataToPolys(pathData, {
  tolerance: 1,
  decimals: 1
});

let points = []
for (let polygon of polygons) {
  for (let i=0; i<polygon.length; i++) {
    let point = polygon[i]
    points[i] = {
      x: point[0] / 10,
      y: point[1] / 10,
    }
  }
}

let i = 0
let j = 0
function drawLine(p0, p1) {
  move(p0)
  move(p1)
  j++
}

function draw() {
  background(255)

  move({ x: mouseX, y: mouseY })

  /*
  for (let i=0; i<points.length; i++) {
    let p0 = points[i]
    let p1 = points[(i+1)%points.length]
    line(p0.x, p0.y, p1.x, p1.y)
  }
  let ci = j%points.length
  let ni = (j+1)%points.length
  drawLine(points[ci], points[ni])
  */
}




