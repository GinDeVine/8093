/*
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
	var enoughSpace = function(){
		for(var i = 0,sum=0; i<2*dln; i+=2)sum+= z(i)+z(i+1);
		return (0<len-(fpx+sum));
	}
	// If not enough space, throw error.
	if(!enoughSpace)return Error("Selected image is not large enough to contain the data.");


	// Randomize the opacity in all the other pixels.
	// As the char code is stored with it's base 16 representation over two pixels, 16 is the greatest opacity neccecary to make...
	for(var j = 3; j < len; j+=4) cpa[j] = 255-Math.floor(Math.random()*16);

	// Store the data within the CanvasPixelArray
	for(var i = 0; i < 2*dln; i+=2){
		var cc = data.charCodeAt(i/2);
		cpa[fpx+z(i)*4+3] = 255-(cc%16);
		cpa[fpx+z(i+1)*4+3] = 255-(cc>>4);
	}
	cpa[fpx+z(i+2)*4+3] = 255-3;
	cpa[fpx+z(i+3)*4+3] = 255-0;

	// Place the new image data into the canvas.
	ctx.putImageData(imd,0,0);
	return canvas.toDataURL("image/png");
}
*/
function hideData(data,img,x,y,z){
	// Hides the data in the selected image, starting at (x,y) with an interval of z between each pixels with stored data.
	// All unused pixels have random info in them.

	if(data === undefined) return Error("No data selected!");
	if(img === undefined) var img = document.getElementById("targetImage");
	if(img.src == "") return Error("No image selected");

	var tempImg = new Image();
	tempImg.src = img.src;
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , w = canvas.width = tempImg.width
	  , h = canvas.height = tempImg.height;
	ctx.drawImage(img,0,0);

	var def = getDefaultXYZ(canvas)
	if(x===undefined)var x = def[0];
	if(y===undefined)var y = def[1];
	if(typeof z != "function")var z = def[2];

	var imd = ctx.getImageData(0,0,w,h) // The image data containing the CanvasPixelArray, which we'll manipulate.
	  , cpa = imd.data					// The CanvasPixelArray, stores the rgba of every pixel in a 1D array.
	  , len = cpa.length				// The length of the CanvasPixelArray
	  , dln = data.length				// How many symbols does the data contain.

	var fpx = (y*w+x)*4;				// The position of the first pixel to start hiding data.

	// enoughSpce check, surprisingly, if there's enough space to hide the message in the selected image with the selected x, y and z.
	var enoughSpace = function(){
		//console.log(len,dln,fpx)
		return (0<len-(fpx+z(dln)));
	}
	// If not enough space, throw error.
	if(!enoughSpace())return Error("Selected image is not large enough to contain the data with the current XYZ.");


	// Randomize the opacity in all the other pixels.
	// As the char code is stored with it's base 16 representation over two pixels, 16 is the greatest opacity neccecary to make...
	for(var j = 3; j < len; j+=4) cpa[j] = 255-Math.floor(Math.random()*16);

	// Store the data within the CanvasPixelArray
	for(var i = 0; i < 2*dln; i+=2){
		var cc = data.charCodeAt(i/2);
		cpa[fpx+z(i)*4+3] = 255-(cc%16);
		cpa[fpx+z(i+1)*4+3] = 255-(cc>>4);
	}
	cpa[fpx+z(i+2)*4+3] = 255-3;
	cpa[fpx+z(i+3)*4+3] = 255-0;

	// Place the new image data into the canvas.
	ctx.putImageData(imd,0,0);
	return canvas.toDataURL("image/png");;
}
/*
function hideDataFromSource(data,x,y,z){
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , img = new Image();
	canvas.id = "nothinghiddenhere"
	img.src = "orsta.png";
	img.style.position	= "absolute";
	img.style.top		= "-10001px";
	img.style.left		= "-10001px";
	img.onload = function(){
		var def = getDefaultXYZ(canvas)
		if(x===undefined)var x = def[0];
		if(y===undefined)var y = def[1];
		if(typeof z != "function")var z = def[2];
		canvas.width = this.width;
		canvas.height = this.height;
		ctx.drawImage(this,0,0);
		hideIt(canvas,data,x,y,z)
		saveImage(canvas);
	}
}*/
/*
function hideData(data,img,x,y,z){
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	if(data === undefined) return Error("No data selected!");
	if(img === undefined) var img = document.getElementById("targetImage");
	var def = getDefaultXYZ(canvas)
	if(x===undefined)var x = def[0];
	if(y===undefined)var y = def[1];
	if(typeof z != "function")var z = def[2];
	var dummyImg = new Image();
	dummyImg.src = img.src;
	canvas.width = dummyImg.width;
	canvas.height = dummyImg.height;
	ctx.drawImage(dummyImg,0,0);
	hideIt(data,img,x,y,z)
	saveImage(canvas);
}*/

function hide(){
	var data = document.getElementById("data").value;
	var img = document.getElementById("targetImage");
	var x = document.getElementById("x");
	var y = document.getElementById("y");
	var z = document.getElementById("z");
	if((x===null) || (x.value == ""))x = undefined;
	else x = x.value;
	if((y===null) || (y.value == ""))y = undefined;
	else y = y.value;
	if((z===null) || (z.value == ""))z = undefined;
	else z = z.value;
	img.src = hideData(data,img,x,y,z);
}
function seek(){
	var output = document.getElementById("data");
	var img = document.getElementById("targetImage");
	var x = document.getElementById("x");
	var y = document.getElementById("y");
	var z = document.getElementById("z");
	if((x===null) || (x.value == ""))x = undefined;
	else x = x.value;
	if((y===null) || (y.value == ""))y = undefined;
	else y = y.value;
	if((z===null) || (z.value == ""))z = undefined;
	else z = z.value;
	output.innerHTML = readData(img,x,y,z);
}

function readData(img,x,y,z){
	// Reads the data from canvas, starting at (x,y) with an interval of z between each pixels with stored data.
	
	if(img === undefined) var img = document.getElementById("targetImage");
	if(img.src == "") return Error("No image selected");

	var tempImg = new Image();
	tempImg.src = img.src;
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , w = canvas.width = tempImg.width
	  , h = canvas.height = tempImg.height;
	ctx.drawImage(tempImg,0,0)


	var def = getDefaultXYZ(canvas)
	if(x===undefined)var x = def[0];
	if(y===undefined)var y = def[1];
	if(typeof z != "function")var z = def[2];


	var imd = ctx.getImageData(0,0,w,h) // The image data containing the CanvasPixelArray, which we'll manipulate.
	  , cpa = imd.data					// The CanvasPixelArray, stores the rgba of every pixel in a 1D array.
	  , len = cpa.length				// The length of the CanvasPixelArray
	  , fpx = (y*w+x)*4;				// The position of the first pixel to start hiding data


	// Extract the data from the CPA
	var data = ""
	var lx = (len-fpx-3)/4;
	for(var i = 0; z(i+1)<lx; i+=2){
		n1 = 255-cpa[fpx+z(i)*4+3];
		n2 = (255-cpa[fpx+z(i+1)*4+3])<<4;
		n = n1+n2;
		if(n==3){break;}
		data += String.fromCharCode(n);
	}


	return data.substr(0,data.length-1);
}

/*
function readFromPNG(src,x,y,z){
	function readPNG(img){
		var def = getDefaultXYZ(canvas)
		if(x===undefined)var x = def[0];
		if(y===undefined)var y = def[1];
		if(typeof z != "function")var z = def[2];
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img,0,0);
		console.log(readData(x,y,z,canvas));
	}
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , img = document.getElementById("targetImage");
	canvas.id = "nothinghiddenhere"
	if((img === undefined) || img.src == "") return Error("No image selected!")
	else return readPNG(img);
}
*/

/*
function saveImage(canvas){
	var img = document.getElementById("targetImage")
	img.src = canvas.toDataURL("image/png");
}
*/


function getDefaultXYZ(canvas){
	var x = decodeKey("default",canvas.width)[0];
	var y = decodeKey("default",Math.floor(canvas.height/10))[1];
	var z = function(n){return n*decodeKey("default",10)[0];}
	return [x,y,z];
}

function decodeKey(key,xm,ym){
	if(xm===undefined)var xm = 100;
	if(ym===undefined)var ym = 100;
	var b16t = "0123456789ABCDEF";
	var lok = key.length
	function dtb(l){
		var n = l.charCodeAt(0);
		return b16t[n>>4]+b16t[n%16];
	}
	var b16key = "";
	for(var u in key)b16key += dtb(key[u]);
	nums = [0,0];
	for(var x = 0; x<lok; x+=2 ){
		var u = b16t.indexOf(b16key[x])-0;
		var v = b16t.indexOf(b16key[x+1])-0;
		nums[0] += u*lok;
		nums[1] += (lok*v)<<(v*u);
	}
	var c = nums[0];
	var d = nums[1];

	function sumdig(n){ for(i=0,a=(n+""),r=0;i<a.length;i++)r+=(a[i]-0);return a;}
	var x = Math.abs(sumdig(d-c)%xm);
	var y = Math.abs(sumdig(Math.floor(d/c))%ym);
	return [x,y]
}