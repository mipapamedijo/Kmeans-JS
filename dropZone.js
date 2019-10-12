/* SCRIPT FOR DROPZONE
REFERENCE: https://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

var files;
var video_file;
var reader;
var output = [];
let dataUploaded = [];
let img_blobs = [];
var img_count=0;
var dropZone = document.getElementById("drop_zone");
var progress = document.getElementsByClassName("percent");
var thumbs_div = document.getElementsByClassName("thumbs_div");
var buttonStart = document.getElementById("b_start");
var color_viz = document.getElementById("color_viz");
var file_type, file_url, file_name;

var _VIDEO, _CANVAS, _CANVAS_CTX;
var video_thumb_url;
var jumpSecondSlider = document.getElementById("jumpSecondSlider");

_VIDEO = document.getElementById("video_preview");
// buttonStart.addEventListener('click',analyze,false);
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
dropZone.addEventListener('dragleave', handleDragExit, false);
buttonStart.addEventListener('click', start, false);


function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    dropZone.style.background = "#4DFFB8";
    document.getElementById("drop_zone_p").style.fontSize="20pt";
    dropZone.style.opacity = '0.6';
  }

function handleDragExit(evt) {
    dropZone.style.background = 'none';
    document.getElementById("drop_zone_p").style.fontSize="inherit";
  }

function abortRead() {
  reader.abort();
}

function errorHandler(evt) {
  switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!');
      break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable');
      break;
    case evt.target.error.ABORT_ERR:
      break; // noop
    default:
      alert('An error occurred reading this file.');
  };
}

function handleFileSelect(evt) {
    dropZone.style.background = 'none';
    var list = document.getElementById('list');
    list.style.opacity=1;
    document.getElementById("info_uploads").style.display="block";
    evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files; // FileList object.

// files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
      var fileString = f.name+' - ('+
                       f.type + ') - '+
                       (f.size/1000000).toFixed(2) + ' MB - Last modified: '+
                       f.lastModifiedDate.toLocaleDateString();
      output.push('<ul class="output">'+fileString+'</ul>');
      if (f.type.match('image.*')) {
        readImages(f);
      }
      if (f.type.match('video.*')){
        readVideo(f);
      }
      dataUploaded.push(files[i]);
    }

    list.innerHTML = "FILES RECEIVED: "+dataUploaded.length +"</br>"+output.join("");
    setTimeout(function(){list.style.opacity="0";},5000);

}

function readImages(f){

    thumbs_div[0].style.display="flex";
    progress[0].style.width = '0%';
    progress[0].textContent = '0%';
    var reader = new FileReader();

    reader.onprogress = (function(theFile) {
      return function(e) {
        // console.log(e);
        // e is an ProgressEvent.
        if (e.lengthComputable) {
          var percentLoaded = Math.round((e.loaded / e.total) * 100);
          console.log(percentLoaded);
          // Increase the progress bar length.
          if (percentLoaded < 100) {
            progress[0].style.width = percentLoaded + '%';
            progress[0].textContent = percentLoaded + '%';
          }
        }
      };
    })(f);

    reader.onabort = function(e) {
      alert('File read cancelled');
    };

    reader.onloadstart = function(e){
      document.getElementById("progress_bar").style.opacity = '1.0';
    };

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        img_count++;
        // Render thumbnail.
        var img_list = document.getElementById('img_span');
        img_list.innerHTML += ['<div class=img_wrap> <img onclick="javascript:imageClicked('+img_count+')" class="thumb" src="'+ e.target.result+
                            '" title="'+escape(theFile.name)+'" id="'+ img_count
                            +'" alt="'+ img_count +'"/> <p class="alt">'+img_count+'</p></div>'];
        img_blobs.push(e.target.result);
        // img_list.innerHTML = img_list.innerHTML+['<img class="thumb" src="', e.target.result,
        //                   '" title="', escape(theFile.name), '" id="thumb_"', dataUploaded.forEach()
        //                   ,'/>'].join('');
        progress[0].style.width = '100%';
        progress[0].textContent = '100%';
        displayStartButton();
        setTimeout("document.getElementById('progress_bar').style.opacity = '0';", 2000);
        // document.getElementById('list').insertBefore(img_span, null);

      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

function readVideo(f){

        thumbs_div[1].style.display="flex";
        _VIDEO = document.getElementById("video_preview");
        _VIDEO.playbackRate = 10;

        progress[0].style.width = '0%';
        progress[0].textContent = '0%';

        reader = new FileReader();
        // reader.onerror = errorHandler;

        reader.onprogress = (function(theFile) {
          return function(e) {
            // console.log(e);
            // e is an ProgressEvent.
            if (e.lengthComputable) {
              var percentLoaded = Math.round((e.loaded / e.total) * 100);
              console.log(percentLoaded);
              // Increase the progress bar length.
              if (percentLoaded < 100) {
                progress[0].style.width = percentLoaded + '%';
                progress[0].textContent = percentLoaded + '%';
              }
            }
            // video_file=e.target.result;
          };
        })(f);

        reader.onabort = function(e) {
          alert('File read cancelled');
        };

        reader.onloadstart = function(e){
          document.getElementById("progress_bar").style.opacity = '1.0';
          console.log(video_file);
          if(video_file!==undefined){
            console.log("DUMPING!");
            window.URL.revokeObjectURL(video_file);
            document.getElementById("video_preview_div").innerHTML = '<video id="video_preview" width="" height="90" autoplay loop muted></video>';
          }
          video_file=URL.createObjectURL(f);
          file_url=video_file;
          file_type="video";
          console.log(video_file);
        };

        reader.onload = function(e) {
          // console.log(video_file);
          // Ensure that the progress bar displays 100% at the end.
          progress[0].style.width = '100%';
          progress[0].textContent = '100%';
          setTimeout("document.getElementById('progress_bar').style.opacity = '0';", 1000);
          document.getElementById("video_preview_div").style.display = "block";
          _VIDEO = document.getElementById("video_preview");
          _VIDEO.innerHTML += ['<source src="'+video_file+'" type="video/mp4">'];
          file_name=f.name;
          console.log(file_name);
          document.getElementById("p_info_video").innerHTML = ["Name: "+f.name+"</br> Duration: "+ _VIDEO.duration +"</br> Size: "+(f.size/1000000).toFixed(2)+" MB</br>"];
          console.log(_VIDEO);
          displayStartButton();
          // _CANVAS = document.getElementById("video_canvas");
          // _CANVAS_CTX = _CANVAS.getContext('2d');
          // _CANVAS_CTX.drawImage(_VIDEO, 0,0, _CANVAS.width, _CANVAS.height);
          // video_thumb_url = _CANVAS.toDataURL();
          // document.getElementById("video_thumb").setAttribute('src', video_thumb_url);

        }
        reader.readAsBinaryString(f);

  }
// document.getElementById('files').addEventListener('change', handleFileSelect, false);
function displayStartButton(){
  if(dataUploaded.length>0){
  buttonStart.style.display="block";
  }
}

function imageClicked(index){
  tmp_img=img_blobs[index-1];
  //console.log(tmp_img);
  dropZone.innerHTML=['<p id="drop_zone_p"> <div id="progress_bar"> <div class="percent">0%</div> </div>Drop files here</p><img src="'+tmp_img+'" id="img_preview" />'];
  setTimeout("document.getElementById('img_preview').style.opacity = '0';", 3000);
  setTimeout(function(){
    dropZone.innerHTML=['<p id="drop_zone_p"> <div id="progress_bar"> <div class="percent">0%</div> </div>Drop files here</p>'];
  },4000);
  // alert("CLICKED ON "+index);
}

function frameClicked(index,src) {
  //console.log("CALLING IMAGE INDEX: "+index +"SRC = "+src);
  var frame_display = document.getElementById("display_frame");
  frame_display.style.opacity = 1;
  frame_display.innerHTML=['<H3>FRAME SELECTED: second '+index+'</H3><img src="'+src+'" id="display_frame_img" />'];
  // setTimeout("document.getElementById('display_frame').style.opacity = '0';", 3000);
  console.log("CLICKED ON "+index);
}

function start(){
  p5_a.loop();
  buttonStart.style.display="none";
  dropZone.style.display="none";
  color_viz.style.display="block";
  loadFile(file_type,file_url,file_name);
}
