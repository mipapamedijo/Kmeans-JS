/*
#COLOR_DATA_VIZ

ColorClustering.js: @Mipapamedijo - NoBudgetAnimation - 2018-2019

ESPAÑOL:
ENGLISH:

*/

let fileName
let fileCollection = []
let imgURLCollection = []

let noK
let default_noK = 4
let sK = document.getElementById("noK")

let dropArea
var dropError = false
var dropped = false
var loading = true
var counter = 0
var clicked = false
var playing = false
var p

let jumpSecond = 30  // THIS ACCUMULATES THE INCREMENT FOR i AND SETS A TIME JUMP ON THE VIDEO BY A GIVEN VALUE IN SECONDS! Default: 30 seconds
let wait = false
let timeInit = 1

let hsvResults = []
let video
var eachS = 0

let videoEnd = false
let vidImgArray = []
let processing = false

let playButton
let buttonDownload

let image;
let maxWH = 300;
let newImg;
let colorClusters=[];
let colorClustersHSV=[];

var div_thumbs_size;

var p5_a = new p5(hsv_3d);
p5_a.noLoop();

var jumpSecondSlider;
jumpSecondSlider = document.getElementById("jumpSecondSlider");
jumpSecondSlider.addEventListener('input',changeJumpSecond, false);
var thumb_frames = document.getElementById('thumbs_frames');

function setup(){
  playButton = createButton("play");
  playButton.class("button");
  playButton.id('play_button');
  playButton.parent("#info");
  playButton.style('display','inline-flex');
  playButton.mousePressed(tooglePlay);
  playButton.hide();
  noK = default_noK
  sK.value = noK

}

function draw(){

  if (wait == true){
    imLoading();
  }
  noK = sK.options[sK.selectedIndex].value;

}

function tooglePlay(){

if(!playing){
  playButton.html("playing...");
  playButton.elt.disabled = true;
  getFrame(timeInit);
}

else{
  playButton.remove();
}

}

function kmeans(points, k, min_diff) {

    plen = points.length;
    clusters = [];
    seen = [];
    while (clusters.length < k) {
      idx = parseInt(Math.random() * plen);
      found = false;
      for (var i = 0; i < seen.length; i++ ) {
        if (idx === seen[i]) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.push(idx);
        clusters.push([points[idx], [points[idx]]]);
      }
    }

    while (true) {
      plists = [];
      for (var i = 0; i < k; i++) {
        plists.push([]);
      }

      for (var j = 0; j < plen; j++) {
        var p = points[j]
         , smallest_distance = Infinity
         , idx = 0;
        for (var i = 0; i < k; i++) {
          var distance = euclidean(p, clusters[i][0]);
          if (distance < smallest_distance) {
            smallest_distance = distance;
            idx = i;
          }
        }
        plists[idx].push(p);
      }

      var diff = 0;
      var noChannels = 3;
      for (var i = 0; i < k; i++) {
        var old = clusters[i]
          , list = plists[i]
          , center = calculateCenter(plists[i], noChannels)
          , new_cluster = [center, (plists[i])]
          , dist = euclidean(old[0], center);
        clusters[i] = new_cluster
        // print(clusters[i]);
        diff = diff > dist ? diff : dist;
        diff = diff > 0 ? diff : 0;
      }
      if (diff < min_diff) {
        // print("break");
        break;
      }
      else{
        // print(" - diff : " + diff + " & dist : " + dist);
      }
    }
    // print(clusters);
    return clusters;
  }

function analyze(img_elem,index) {
    print("ANALYZING.....");

    var results = document.getElementById('results');
    document.getElementById('img_div').innerHTML = "";
    results.innerHTML = "";
    colorClusters = [];

    var analizeCanvas = document.getElementById('img-resized');
    var ctx = analizeCanvas.getContext('2d');
    var img = img_elem;
    //var img = new Image()
    print('analizeCanvas = WIDTH: '+analizeCanvas.width+' HEIGHT: '+analizeCanvas.height);
    //print(img);

      let colors = process_image(img, ctx);


      results.setAttribute('style','column-count:'+noK);
      for (var j=0; j<noK; j++){
          colorClusters.push(colors[j]);
      }
      colorClusters.sort();
      // print(colorClusters);
      for (var i=0; i<colorClusters.length; i++){
        var kDiv = createDiv();
        kDiv.class('colors');
        // kDiv.id('c'+j);
        kDiv.style('background-color','#'+colorClusters[i]);
        kDiv.style('color','#'+colorClusters[i]);
        kDiv.html(colorClusters[i]);
        kDiv.parent('#results');
      }
      let dataUrl = analizeCanvas.toDataURL();
      thumb_frames.innerHTML += ['<div class=img_wrap id=frame> <img class="thumb" src="'+ dataUrl+
                          '" title="'+file_name+'- second #'+index+'" id="'+ index
                          +'" alt="'+ index +'"/>'+ results.innerHTML + '<p class="alt">'+index+'</p></div>'];
      for (var j=0; j<noK; j++){
        colorClustersHSV.push(hsvResults[j]);
      }
      colorClustersHSV.sort();
      // print("CClusterHSV "+colorClustersHSV.length);
      // print("pushing ....");
      colorsList = colorClustersHSV;

      loadFrames(img.src);
      // loading = false;
      // print(imgArray);
      // var p1 = document.getElementById('c1');
      // p1.style.backgroundColor = colors[0];
      // results.innerHTML = 'COLOR:'+colors[0];
      // print ('DOMINANT COLOR:'+colors[0]);
      // results.setAttribute('style','color:'+colors[0]);

    //document.getElementById('img_resized').innerHTML = "";
    document.getElementById('img_div').innerHTML = "";
  }

function process_image(img, ctx) {
      // print("K = "+noK);
      var points = [];
        ctx.drawImage(img, 0, 0, img.width, img.height);
        //ctx.drawImage(img, 0, 0, imgAdjusted, imgAdjusted);
        data = ctx.getImageData(0, 0, img.width, img.height).data;
        //data = ctx.getImageData(0, 0, imgAdjusted, imgAdjusted).data;
        for (var i = 0, l = data.length; i < l;  i += 4) {
          var r = data[i]
            , g = data[i+1]
            , b = data[i+2];
          points.push([r, g, b]);
        }
        var results = kmeans(points, noK, 0.1);
        var hex = [];
        hsvResults =[];
        for (var i = 0; i < results.length; i++) {
          // print("rgbToHex : "+rgbToHex(results[i][0]));
          hex.push(rgbToHex(results[i][0]));
          hsvResults.push(rgbToHSV(results[i][0]));
        }
        //print(hsv);
        return hex;

}

function normalizeSize(i,index){
  print("entering process... normalizeSize(i) where, i has W =" + i.width+" H = " + i.height);
  var modImg = null;
  document.getElementById('canvas').innerHTML = "";
  modImg = i;
  //print("modIMG . elt = "+modImg.elt);
  var canvas = document.getElementById('img-resized');
  var ctx = canvas.getContext('2d');

  // modImg.elt.onload = function(){

    var imgRatio;
    var w, h, max;
    w = modImg.width;
    h = modImg.height;

    // print("IMAGE (modImg) W: "+w+" | H:"+h);

    if (w>=h){
      imgRatio = w / h;
      // print("w > h : "+imgRatio);
      canvas.height = canvas.width / imgRatio;
      max=w;
    }
    if (h>=w){
      imgRatio = h / w;
      // print("h > w : "+imgRatio);
      canvas.width = canvas.height / imgRatio;
      max=h;
    }
    // print("IMAGE (modImg) W: "+canvas.width+" | H:"+canvas.height);

     var oc = document.getElementById('img-resized');
     var octx = oc.getContext('2d');
     var coefficient = maxWH/max;
     //print("COEF: "+coefficient);
     oc.width = w * coefficient;
     oc.height = h * coefficient
     octx.drawImage(modImg, 0, 0, oc.width, oc.height);

     print("Canvas (oc) W: "+oc.width+" | H:"+oc.height);
     // print(octx);
     var dataUrl = oc.toDataURL();
     newImg = document.createElement('img');
     newImg.src = dataUrl;
     newImg.id = 'img';
     newImg.onload = function(){
     document.getElementById('img_div').appendChild(newImg);
     analyze(newImg,index);
     // }
     //print(newImg);
  }
  print("normalized!");
  newImg.onerror = function(){
    // print("NORMALIZATION ERROR!");
  }
}

function showImage(){
  let img = createImg(image);
  // print("IMG W: "+img.width+" | H:"+img.height);
  img.id('img');
  //img.parent('#canvas');
  img.parent('#img_div');
  let i = document.getElementById('img');
  analyze(i);
}

function euclidean(p1, p2) {
    var s = 0;
    for (var i = 0, l = p1.length; i < l; i++) {
      s += Math.pow(p1[i] - p2[i], 2)
    }
    return Math.sqrt(s);
  }

function calculateCenter(points, n) {
    var vals = []
      , plen = 0;
    for (var i = 0; i < n; i++) { vals.push(0); }
    for (var i = 0, l = points.length; i < l; i++) {
      plen++;
      for (var j = 0; j < n; j++) {
        vals[j] += points[i][j];
      }
    }
    for (var i = 0; i < n; i++) {
      vals[i] = vals[i] / plen;
    }
    return vals;
  }

function rgbToHex(rgb) {
    function th(i) {
      var h;
      if(isNaN(i)==true){
        h = "";
      }
      else{
        h = parseInt(i).toString(16);
      }
        return h.length == 1 ? '0'+h : h;
    }
    var colorHex = th(rgb[0]) + th(rgb[1]) + th(rgb[2]);
    // print(colorHex);
    return colorHex;
  }

function rgbToHSV(rgb){
  var r = rgb[0]
  ,   g = rgb[1]
  ,   b = rgb[2];

  // print("received: "+r+" , "+g+" , "+b);
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h*360,
        s: s*100,
        v: v*100
      };
}

function loadVideo(v){
  print("loading video...");
  video = createVideo(v);
  video.id('video');
  var e = document.getElementById('video');
  e.onloadeddata = function(){
    vidLoad();
  }
}

function vidLoad() {
  video.pause();
  video.parent('#video_div');
  // video.size(360, 240);
  video.volume(0);
  print("video loaded!");
  playButton.show();
  playButton.style('display','inline-flex');
}

function loadFile(type, url, name) {
console.log("FUNCTION: loadFile( "+type+", "+url+", "+name+")");
  fileName = name+"."+type;
	if (type == "image") {
  print("IT'S AN IMAGE!");
	// dropError = false;
  // var url = [URL.createObjectURL(file.file)];
  // // print(url);
  var image = createImg(url);
  // print(image);

  image.elt.onload = function() {
    print("IMAGE LOADED | image W: "+image.elt.width+" | H:"+image.elt.height);
    image.id('modImg');
    image.parent('#canvas');
    fileCollection.push(image.elt);
    imgCheckBox.checked(false);
    normalizeSize(image.elt);
    }
  //showImage();
	}
  if (type == "video"){
    // print("IT'S A VIDEO!");
    // var url = [URL.createObjectURL(file.file)];
    // print(url);
    loadVideo(url);
    // dragOut();
  }
}

function getFrame(i){

  video.hide();
  console.log(video.duration());
  var div_data,vid_cnvs;
  // var cv = vid_cnvs.getContext('2d');
  var dataUrl;
  var adjustedW, adjustedH;
  var maxW = video.width;
  var maxH = video.height;
  // var l;
  thumbs_frames.style.display="block";
  thumbs_frames.addEventListener("click",function(e){
    console.log(e);
    frameClicked(e.srcElement.id,e.srcElement.currentSrc);
  },false);

  let e = document.getElementById('video');

  print("attempting to process video in i = "+ i);

  if(i<=video.duration()){
    e.currentTime = i;
    e.pause();
    e.oncanplay = function(){
      print("Can play through : " + i);
      console.log(video.elt);
      // cv.drawImage(video.elt, 0,0,vImg.elt.width,vImg.elt.height);
      normalizeSize(video.elt,i);
      div_data = document.getElementById("results");
      vid_cnvs = document.getElementById('img-resized');
      // dataUrl = vid_cnvs.toDataURL();
      // console.log(dataUrl);
      console.log(div_data.innerHTML);
      // thumb_frames.innerHTML += ['<div class=img_wrap id=frame> <img class="thumb" src="'+ dataUrl+
      //                     '" title="'+file_name+'- second #'+i+'" id="'+ i
      //                     +'" alt="'+ i +'"/>'+ div_data.innerHTML + '<p class="alt">'+i+'</p></div>'];
      // div_data.setAttribute("id",'colors-'+i);
      imgURLCollection.push(dataUrl);
      // var vImg = createImg(dataUrl);
      // vImg.id('v_img');
      // vImg.hide();
      // vImg.elt.onload = function(){
      // vidImgArray.push(vImg);
      // vImg.remove();
      // print(vidImgArray.length +" SAVED ON ARRAY");
      // }
      i=(i+jumpSecond);
      return getFrame(i);
      // div_data.innerHTML+=[]'colors';
     }
    e.onerror = function(){
      alert("Video error");
    }
  }

  if(i>video.duration()){
    print("VIDEO ENDED");
    playing=false;
    print("vidImgArray LENGTH: " + vidImgArray.length);
    playButton.remove();
    buttonDownload = createButton("Download CSV");
    buttonDownload.class("button");
    buttonDownload.id('button_download');
    buttonDownload.parent("#info");
    buttonDownload.style('display','inline-flex');
    buttonDownload.mousePressed(saveCSV);
  }

}

function processVideoImages(){

  if (vidImgArray.length>0){
    for(var i = 0; i<vidImgArray.length; i++){
      vidImgArray.onload = function(){
        // print("SENDING TO normalizeSize(i) IMAGE NUMBER: "+i);
        normalizeSize(vidImgArray[i].elt);
      }
    }
  }
}

function saveCSV(){

  print("CREATING A CSV...");
  let csvData = "data:text/csv;charset=utf-8,";
  var sec = 0;
  var j=0;
  csvData += "Time (Second),H,S,V"+"\r\n";
  colorClustersHSV.forEach( function(r){
   let row = r;
   csvData += sec + "," + row.h + "," + row.s + "," + row.v + "\r\n";
   j++;
   sec = ((j%noK)-j)/-noK;
   // print(sec);
  });

  var encodedUri = encodeURI(csvData);
  console.log(encodedUri);
  // window.open(encodedUri);

  var link = document.createElement("a");

  var timeStamp = new Date();
  var y,m,d;
  y=timeStamp.getFullYear();
  m=timeStamp.getMonth();
  d=timeStamp.getDate();
  var f_download_name = fileName+" - HSV_color_clusters - " +y+m+d;
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", f_download_name+".csv");
  document.body.appendChild(link);
  setTimeout(function(){link.click();},1000);
  saveMaps(f_download_name);

}

function changeJumpSecond(){
  jumpSecond = parseInt(this.value,10);
  console.log("MODIFICATION OF jumpSecond: "+jumpSecond);
  document.getElementById("jumpSecondValueTag").innerHTML = jumpSecond+" seconds";
}

function saveMaps(n){
  var dataWidth, dataHeight;
  var target = document.getElementById('thumbs_frames');
  target.style.display = "inline-table";
  target.style.overflow = "hidden";
  target.scrollLeft = 0;
  target.scrollTop = 0;

  var maxH = 1500;
  // if(dataWidth > 3000){
    target.style.overflow = "visible";
    console.log("MAX WIDTH FOR PNG");
    var img_wrap_elements = document.getElementsByClassName("img_wrap");
      for(var i=0; i<img_wrap_elements.length; i++) {
        img_wrap_elements[i].style.display = "inline-block";
        img_wrap_elements[i].style.padding = 'inherit';
      }
    // document.getElementById('frame').style.display = "inline-block";
    // document.getElementById('frame').style.padding = 'inherit';
  // }
  // else{
  //   target.style.display = "block";
  //   target.style.overflow = "visible";
  //   document.getElementById('frame').style.display = 'table-cell !important';
  // }
  dataWidth = target.clientWidth;
  dataHeight = target.clientHeight;
  var dataSizeRatio = dataHeight / dataWidth;
  console.log("----------------- "+ dataWidth+"-X- "+dataHeight+" -----------RATIO--- "+dataSizeRatio);
  console.log("init canvas map...");
  html2canvas(document.querySelector("#thumbs_frames"),{
      scrollX : 0,
      scrollY : 0,
      backgroundColor: null,
      allowTaint: false,
      useCORS: true,
      logging: true,
  }).then(canvas =>
    {
      var extra_cnvs = document.createElement("canvas");
      var xWidth, xHeight;
      xWidth = (maxH*dataWidth)/dataHeight;
      xHeight = maxH;
      extra_cnvs.setAttribute('width',xWidth);
      extra_cnvs.setAttribute('height',xHeight);
      extra_cnvs.setAttribute('id',"extra_cnvs");
      console.log(extra_cnvs);
      var x_ctx = extra_cnvs.getContext('2d');
      x_ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,xWidth,xHeight);
      var xURL = extra_cnvs.toDataURL("image/png");
    //   onrendered: function (canvas) {
        console.log("saving canvas map...");
        // document.getElementById('thumbs_frames').style.overflow = 'hidden';
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = xURL;
        // a.href = canvas.toDataURL("image/png");
        a.download = n+'.png';
        a.click();
        // document.getElementById('thumbs_frames').style.overflow = "scroll";
    });
      target.style.display = "block";
}
