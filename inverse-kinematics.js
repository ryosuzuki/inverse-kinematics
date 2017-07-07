
function setup() {
  createCanvas(1000, 1000)
}

let origin = { x: 300, y: 300 }

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

function draw() {
  background(255)

  let l1 = 200
  let l2 = 200
  let pos = { x: mouseX, y: mouseY }
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

}
