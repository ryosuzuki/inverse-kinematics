
function setup() {
  createCanvas(1000, 1000)
}

let origin = [300, 300]

function Edge(p0, p1) {
  // let dx = p1[0]-p0[0]
  // let dy = p1[1]-p0[1]
  // Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  let width = 300
  let angle = Math.atan2(p1[1]-p0[1], p1[0]-p0[1])
  push()
  translate(p0[0], p0[1])
  rotate(angle)
  rect(-10, -10, width+20, 20)
  ellipse(width, 0, 5, 5)
  pop()
  ellipse(p0[0], p0[1], 5, 5)
}

function draw() {
  background(255)
  let edge = Edge(origin, [mouseX, mouseY])
}
