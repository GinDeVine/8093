function hideIt(canvas,data,x,y,z){
	// Hides the data in canvas, starting at (x,y) with an interval of z between each pixels with stored data.
	// All unused pixels have random info in them.
	var w = canvas.width
	  , h = canvas.height
	  , ctx = canvas.getContext("2d")	// CanvasRenderingContext2D, where the image data is stored.
	  , imd = ctx.getImageData(0,0,w,h) // The image data containing the CanvasPixelArray, which we'll manipulate.
	  , cpa = imd.data					// The CanvasPixelArray, stores the rgba of every pixel in a 1D array.
	  , len = cpa.length				// The length of the CanvasPixelArray
	  , dln = data.length				// How many symbols does the data contain.
	  , fpx = (y*w+x)*4;				// The position of the first pixel to start hiding data.

	// enoughSpce check, surprisingly, if there's enough space to hide the message in the selected image with the selected x, y and z.
	var enoughSpace = function(){ return (0<len-(fpx+data.length*z)); }
	// If not enough space, throw error.
	if(!enoughSpace)return Error("Selected image is not large enough to contain the data.");

	// Randomize the opacity in all the other pixels.
	for(var j = 3; j < len; j+=4) cpa[j] = 132+Math.floor(Math.random()*123);

	// Store the data within the CanvasPixelArray
	for(var i = 0; i < dln; i++) cpa[fpx+i*z*4+3] = 100+data.charCodeAt(i);

	// Place the new image data into the canvas.
	ctx.putImageData(imd,0,0);
}

function hideData(data,x,y,z){
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , img = new Image();
	canvas.id = "nothinghiddenhere"
	img.src = "orsta.png";
	img.style.position	= "absolute";
	img.style.top		= "-10001px";
	img.style.left		= "-10001px";
	document.body.appendChild(canvas);
	img.onload = function(){
		canvas.width = this.width;
		canvas.height = this.height;
		ctx.drawImage(this,0,0);
		setTimeout(function(){hideIt(canvas,data,x,y,z)},1000);
	}
}

function readData(x,y,z,canvas){
	// Reads the data from canvas, starting at (x,y) with an interval of z between each pixels with stored data.
	if(canvas===undefined)canvas = document.getElementById("nothinghiddenhere");
	var w = canvas.width
	  , h = canvas.height
	  , ctx = canvas.getContext("2d")	// CanvasRenderingContext2D, where the image data is stored.
	  , imd = ctx.getImageData(0,0,w,h) // The image data containing the CanvasPixelArray, which we'll manipulate.
	  , cpa = imd.data					// The CanvasPixelArray, stores the rgba of every pixel in a 1D array.
	  , len = cpa.length				// The length of the CanvasPixelArray
	  , fpx = (y*w+x)*4;				// The position of the first pixel to start hiding data

	// Store the data within the CanvasPixelArray
	var data = ""
	for(var i = 0;  typeof cpa[fpx+i*z*4+3] != "undefined"; i++) data += String.fromCharCode(cpa[fpx+i*z*4+3]-100);
	//console.log(data);
	return data;
}