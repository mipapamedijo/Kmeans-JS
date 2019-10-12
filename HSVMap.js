/*
#COLOR_DATA_VIZ

HSV MAP: @Mipapamedijo - NoBudgetAnimation - 2018-2019

ESPAÑOL: Visualización de mapa de puntos del espacio de color
HSV / HSB (Hue, Saturation, Value/Brightness) en 3D.
ENGLISH: 3D HSV (Hue, Saturation, Value/Brightness) color space plotting
visualization.

ESPAÑOL: EL ARCHIVO CSV DEBE CONTENER N FILAS CON VALORES NUMÉRICOS
(int, float, long) DISTRIBUIDOS EN 3 COLUMNAS EN EL ORDEN
column 0 = HUE , column 1 = SATURATION, column 2 = VALUE o BRIGTHNESS.
				HUE 				(NUMERO: 0 a 360)
				SATURATION 	(NUMERO: 0 a 100)
				VALUE				(NUMERO: 0 a 100)

ENGLISH: THE CSV FILE MUST CONTAIN N ROWS WITH ANY GIVEN NUMBER VALUE
(int, float, long) ARRANGED BY 3 COLUMNS IN THIS ORDER:
column 0 = HUE , column 1 = SATURATION, column 2 = VALUE or BRIGTHNESS.
				HUE 				(NUMBER: 0 to 360)
				SATURATION 	(NUMBER: 0 to 100)
				VALUE				(NUMBER: 0 to 100)
*/

//DEFINITION OF GLOBAL VARIABLES
var loading = true;
var counter;
var dropped = false;
var dropError;

let pLoad;
let pLoaded;
let pError;

var colorsList = [];

// var angleSlider;
var boxSizeSlider;
var imgCheckBox;
let useImg = false;
var data = [];
var csvData;
var dSize;
var cols;
var rows;
var array;

var top;
var bottom;
var tall;
var divs;
var fullDivs = 1000;
var sqR;
var posX;
var posY;
var posZ;
var h;
var s;
var v;
var boxS;
let boxSelected;
var zoom;
var inc;
var rotInc;
var rotation;
var screenState;
var imageS;

// let fileName;
var path;
var infoPAlpha;
let frameP;


let tH;
let tS;
let tV;
let imgArray = [];
var img = [];

// var framesMap = function (p){
// 	p.canvasColors;
// 	p.imgIndex;
// 	p.newImage;
// 	p.d;
//
//
// 	p.setup = function(){
// 	  p.canvasColors = p.createCanvas(window.innerWidth,100);
// 	  p.canvasColors.parent('palette_map');
// 	  p.colorMode(p.HSB, 360, 100, 100, 100);
// 	  colorArray();
// 	  p.d = p.createDiv();
// 	  p.d.parent('img_div');
//
// 		frameP = p.createP("FRAMES INDEX:");
// 		frameP.parent('index');
//
// 	}
//
// 	p.draw = function(){
// 	  p.clear();
// 		lookOver();
// 	  drawImages(p.imgIndex);
// 	}
// }

var hsv_3d = function(q) {

  q.dirX;
  q.dirY;
  q.infoP;
  q.data = data;
  q.images = [];

  q.setup = function() {

    top = 0;
    bottom = 100;
    tall = 100;
    divs = 12;
    boxS = 3;
    zoom = 3;
    inc = 0.2;
    rotInc = 185;
    rotation = q.PI / rotInc;
    screenState = 0;

    cols = 3;
    rows = q.int(dSize / cols);
    array = [];
    counter = 0;

    // imgCheckBox.class('imgCheckBox');


    boxSizeSlider = q.createSlider(0.5, 10, boxS, 0.25);
    boxSizeSlider.class('slider');
    boxSizeSlider.hide();

    q.canvas = q.createCanvas(window.innerWidth, 500, q.WEBGL);
    q.canvas.parent('hsv_map');

    q.colorMode(q.HSB, 360, 100, 100);
    q.rectMode(q.CENTER);
    tH = q.createGraphics(100, 100);
    tS = q.createGraphics(100, 100);
    tV = q.createGraphics(100, 100);
    pl = q.createGraphics(10, 10);

    imgCheckBox = q.createCheckbox("Use Frames as texture", true);
    imgCheckBox.parent('checkbox');

  }

  q.draw = function() {

    //SET CANVAS BACKGROUND
    q.clear();


    //SET LIGHTS AMBIENT
    q.dirX = (q.mouseX / q.width - 0.5) * 2;
    q.dirY = (q.mouseY / q.height - 0.5) * 2;
    // q.directionalLight(0, 0, 100, -q.dirX, -q.dirY, -0.5);
    q.ambientLight(100);

    // SET PERSPECTIVE
    //q.ortho(-q.width / 2, q.width / 2, -q.height / 2, q.height / 2);
    q.ortho(-q.width / 2, q.width / 2, -q.height / 2, q.height / 2, 0, 10000);

    // SET CAMERA INTERACTION WITH MOUSE X AND MOUSE Y TIMES A GIVEN ZOOM
    q.camera((q.width / 2) * zoom, (q.height / 2) * zoom,
      ((q.height / 3.0) / q.tan(q.PI * 50.0 / 180.0)) * zoom,
      q.width / 2 * zoom, q.height / 2 * zoom,
      0,
      0,
      1,
      0);

    // angleSlider.parent('sliders');

    q.push();
    q.scale(zoom);
    q.translate(q.width / 2, q.height - (q.height / 2.5), zoom);
    q.rotateX(-q.PI);
    q.rotateY(q.frameCount * rotation);

    if (loading) {
      //DRAW A REFERENCE FULL HSV CONE OF A THOUSAND DIVISIONS
      rotation = 0.1;
      drawCone(top, bottom, tall, fullDivs);
    } else {
      boxSizeSlider.parent('sliders');
      boxSizeSlider.show();
      boxS = boxSizeSlider.value();
      rotation = q.PI / rotInc;

      // DRAW A REFERENCE CONE CALLING THE FUNCTION function drawCone(var topRadius,
      // var bottomRadius, var tall, var sides):
      drawCone(top, bottom, tall, divs);

      // DRAW HSV POINTS ADJUSTED TO THE REFERENCE CONE TALLNESS, CALLING THE
      //FUNCTION function drawHSVPoints(Table data, var tall):
      q.push();
      q.translate(0, tall, 0);
      q.rotateZ(q.PI);
      q.rotateY(-q.PI / 2);
      // q.print("q.data = "+q.data.length);
      drawHSVPoints(q.data, tall);
      q.pop();

      //DRAW THE AXIS LABELS CALLING THE FUNCTION function drawAxis():
      q.translate(0, 0, 0);
      drawAxis();

    }

    q.pop();

    if (imgCheckBox.checked() == true) {
      useImg = true;
      //q.print("CHECKBOX TRUE");
    } else {
      useImg = false;
      //q.print("CHECKBOX FALSE");
    }

  }

  q.mouseClicked = function() {

  }

  q.keyPressed = function() {

    if (q.key == 'w') {
      zoom = zoom + inc;
      q.print("ZOOM:" + zoom);
    }
    if (q.key == 's') {
      zoom = zoom - inc;
      if (zoom < 0) {
        zoom = 0.05;
      }
      q.print("ZOOM:" + zoom);
    }
    if (q.key == 'd') {
      rotation = q.PI / (rotInc++);
      q.print("ROTATION:" + rotation);
    }
    if (q.key == 'a') {
      rotation = q.PI / (rotInc--);
      q.print("ROTATION:" + rotation);
    }
    if (q.keyCode == q.ESCAPE) {
      q.frameRate(0);
      q.print("ROTATION:" + rotation);
    }
    if (q.keyCode == q.ENTER) {
      q.frameRate(8);
      q.print("ROTATION:" + rotation);
    }
    if (q.keyCode == q.TAB) {
      if (screenState == 0) {
        screenState = 1;
      } else {
        screenState = 0;
      }
    }

  }

  q.windowResized = function() {
    q.resizeCanvas(window.innerWidth, 500);
  }
}

function drawCone(topRadius, bottomRadius, tall, sides) {

  var angle = 0;
  var angleIncrement = p5_a.TWO_PI / sides;

  if (screenState == 1) {
    // IF MOUSE PRESSED, AVOID DRAWING ANY CONE AT ALL.
  } else {
    p5_a.push();
    p5_a.beginShape(p5_a.LINES);
    p5_a.fill(0);
    for (i = 0; i < sides + 1; ++i) {

      p5_a.push();
      p5_a.strokeWeight(1.5);
      p5_a.stroke(i * (360 / sides), 50, 100, 10);
      p5_a.line(topRadius * p5_a.cos(angle), 0, topRadius * p5_a.sin(angle),
        bottomRadius * p5_a.cos(angle), tall, bottomRadius * p5_a.sin(angle));
      p5_a.pop();
      angle += angleIncrement;
    }
    p5_a.endShape();
    p5_a.pop();

  }

}

function drawHSVPoints(data, tall) {


  dSize = colorsList.length;
  var cols = 3;
  var rows = p5_a.int(dSize / cols);
  sqR = p5_a.int(Math.floor(p5_a.sqrt(dSize)));
  // print("dSize = "+dSize);
  //HSV POINTS DEFINITION IN SPACE (X,Y,Z):

  for (i = 0; i < dSize; i++) {
    // print("iteration: "+i);
    posX = 0;
    posY = 0;
    posZ = 0;
    h = colorsList[i].h;
    s = colorsList[i].s;
    v = colorsList[i].v;

    // print("H: "+h+" ; S: "+s+" ; V: "+v);

    p5_a.push();
    p5_a.fill(h, s, v);
    p5_a.noStroke();
    var texIndex = ((i % noK) - i) / -noK;

    if (screenState == 1) {
      // console.log("VIEW SQUARE MAP");

      if (loading == false && useImg == false) {
        p5_a.push();
        p5_a.rotateX(p5_a.PI);
        p5_a.rotateZ(p5_a.PI / 2);
        p5_a.translate(-tall / 2, 0, 0);
        posY = ((sqR / 2) * boxS) - (i % sqR) * boxS;
        posX = ((sqR / 2) * boxS) - (i / sqR) * boxS;
        posZ = 0;
        //posY=i*boxS; –> ARRAY-VIZ ONE DIMENSION ONLY - dismiss this!
        p5_a.translate(posX, posY, posZ);
        p5_a.rotateZ(p5_a.PI);
        p5_a.rotateX(0);
        p5_a.box(boxS);
        p5_a.pop();
      }

      if (loading == false && useImg == true) {
        p5_a.push();
        p5_a.rotateX(p5_a.PI);
        p5_a.rotateZ(p5_a.PI / 2);
        p5_a.translate(-tall / 2, 0, 0);
        posY = ((sqR / 2) * boxS) - (i % sqR) * boxS;
        posX = ((sqR / 2) * boxS) - (i / sqR) * boxS;
        posZ = 0;
        //posY=i*boxS; –> ARRAY-VIZ ONE DIMENSION ONLY - dismiss this!
        p5_a.translate(posX, posY, posZ);
        p5_a.rotateZ(p5_a.PI);
        p5_a.rotateX(0);
        p5_a.texture(imgArray[texIndex]);
        p5_a.box(boxS);
        p5_a.pop();
      }


    } else {
      var d;
      d = s - (100 - v);
      if (d < 0) {
        if (s == 0) {
          d = 0;
        } else {
          d = v % s;
        }
      }

      posX = d * p5_a.sin((h * p5_a.PI) / 180);
      posY = tall - v;
      posZ = d * p5_a.cos((h * p5_a.PI) / 180);
      /*("i= "+i+" | HSV: "+h+", "+s+", "+v +" | DIBUJANDO EN:
      "+posX+", "+posY+", "+posZ);*/
      p5_a.translate(posX, posY, posZ);
      p5_a.rotateZ(p5_a.frameCount * rotation);

      if (loading == false && useImg == false) {
        p5_a.ambientMaterial(h, s, v);
      }

      if (loading == false && useImg == true) {
        // var l =	imgArray[i].canvas.onload = function(){
        // p5_a.print("imgArray canvas loaded");
        p5_a.texture(imgArray[texIndex]);
        // }
      }
      p5_a.sphere(boxS);
      p5_a.pop();
    }
  }
}

function drawAxis() {

  var axisX0 = 0;
  var axisY0 = 0;
  var axisZ0 = 0;
  var axisX1 = -100;
  var axisY1 = -100;
  var axisZ1 = -100;
  var vAxis = 80;

  if (screenState == 1) {} else {

    p5_a.rotateX(-p5_a.PI);
    p5_a.push();
    p5_a.strokeWeight(1);
    p5_a.stroke(0, 0, vAxis);
    p5_a.line(axisX0, axisX1, axisY0, axisY0, axisZ0, axisZ0);
    p5_a.line(axisX0, axisX0, axisY0, axisY1, axisZ0, axisZ0);
    p5_a.line(axisX0, axisX0, axisY0, axisY0, axisZ0, axisZ1);

    //-------- H
    p5_a.push();
    p5_a.translate(axisX1, 0, 0);
    tH.fill(125);
    tH.textSize(25);
    tH.text("H", 50, 25);
    p5_a.beginShape();
    p5_a.texture(tH);
    p5_a.plane(25, 25);
    p5_a.endShape();
    p5_a.pop();
    //-------- S
    p5_a.push();
    p5_a.translate(0, 0, axisZ1);
    tS.fill(125);
    tS.textSize(25);
    tS.text("S", 50, 25);
    p5_a.beginShape();
    p5_a.texture(tS);
    p5_a.plane(25, 25);
    p5_a.endShape();
    p5_a.pop();
    //-------- V
    p5_a.push();
    p5_a.translate(0, axisY1, 0);
    tV.fill(125);
    tV.textSize(25);
    tV.text("V", 50, 25);
    p5_a.beginShape();
    p5_a.texture(tV);
    p5_a.plane(25, 25);
    p5_a.endShape();
    p5_a.pop();

    p5_a.pop();
  }
}

function loadFrames(path) {

  var imgPath = path;
  // p5_a.print("CALLING FOR: "+imgPath);
  loading = true;
  p5_a.loadImage(imgPath, loadedImages);


}

function loadedImages(m) {

  imgArray.push(m);
  print(imgArray.length);
  // p5_a.print(imgArray);
  // p5_a.print("PUSHING IMAGE, NOW ARRAY IS: "+imgArray.length);
  if (imgArray.length == rows) {
    // p5_a.print("# TOTAL FRAMES LOADED: "+imgArray.length);
    loading = false;
  } else {
    if (imgArray.length > 0) {
      loading = false;
      if (noK > 1) {
        imgCheckBox.disabled;
        // imgCheckBox.remove();
      } else {
        imgCheckBox.enabled
      }
      //p5_a.print("MISSING FRAMES?: "+imgArray.length);
    } else {
      loading = true;
    }
  }
}

function initArray2D(d) {

  var init = [];
  cols = 3;
  rows = p5_a.int(dSize / cols);

  if (d) {
    for (var i = 0; i < cols; i++) {
      init[i] = [];
      for (var j = 0; j < rows; j++) {
        init[i][j] = null;
      }
    }
    p5_b.print(init);
    setData(init, d);
  } else {
    array[0] = 1;
    array[0][0] = 1;
    array[1][0] = 1;
    array[2][0] = 1;
    data = array;
  }

}

function setData(t, d) {
  var index = 0;
  var increment = cols;
  var i0;
  var i1;
  var i2;
  p5_b.print(rows);

  for (var k = 0; k < rows; k++) {
    t[0][k] = i0;
    t[1][k] = i1;
    t[2][k] = i2;
    for (var l = 0; l < dSize; l++) {
      i0 = d[index];
      i1 = d[index + 1];
      i2 = d[index + 2];
      l = l + increment;
    }
    index = index + increment;
    //print("DATA IN : "+l+" | "+t[0][l]+" , "+t[1][l]+" , "+t[2][l]);
  }

  data = t;
}

function colorArray() {

  var total = dSize / 3;
  var sqSize = p5_b.width / total;
  p5_b.print("ONE DIMENSION ARRAY OF : " + total + " COLORS");

  for (let i = 0; i < total; i++) {

    let c1 = data[0][i];
    let c2 = data[1][i];
    let c3 = data[2][i];
    let x0 = i * sqSize;
    let y0 = 0;
    let sqW = sqSize;
    let sqH = p5_b.height;
    //p5_b.print("H: "+c1+"S: "+c2+"V: "+c3);
    let c = new Color(c1, c2, c3, sqW, sqH, x0, y0);

    p5_b.colors.push(c);
  }
}

function lookOver() {

  let frameSpacing = 3;

  for (let i = 0; i < p5_b.colors.length; i++) {
    if (p5_b.colors[i].over(p5_b.mouseX, p5_b.mouseY)) {
      p5_b.colors[i].changeColor(100);
      p5_b.print("OVER AT: " + i * frameSpacing);
      p5_b.imgIndex = i * frameSpacing;
      boxSelected = 10;

      var valueString = "FRAME # " + p5_b.imgIndex;
      frameP.html(valueString);

    } else {
      p5_b.colors[i].changeColor(80);
    }
    p5_b.colors[i].show();
  }
}

function drawImages(index) {

  var imgPath;

  imgPath = "data/frames/" + fileName + "/frame_" + index + ".jpg";

  p5_b.d.id('img_area');
  p5_b.d.style("background-image", "url(" + imgPath + ")");

}

class Color {

  constructor(h2, s2, v2, w, t, x, y) {
    this.h = h2;
    this.s = s2;
    this.v = v2;
    this.w = w;
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = 0;
  }

  changeColor(m) {
    this.a = m;
  }

  over(px, py) {
    if (px >= this.x && px <= this.x + this.w &&
      py >= this.y && py <= this.y + p5_b.height) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    p5_b.noStroke();
    p5_b.translate(0, this.dist);
    p5_b.fill(this.h, this.s, this.v, this.a);
    p5_b.rect(this.x, this.y, this.w, this.t);

  }

}

// var p5_a = new p5(hsv_3d);
// var p5_b = new p5(framesMap);
