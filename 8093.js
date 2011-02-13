// I know the code here looks messy.. I haven't gotten around to clean it up yet....
// I'll also finish adding comments at a later time, as of now they are few and not very helpful..


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
	ctx.drawImage(tempImg,0,0);

	var def = getDefaultXYZ(canvas)
	if(typeof x != "number")var x = def[0];
	if(typeof y != "number")var y = def[1];
	if(typeof z != "function")var z = def[2];

	var imd = ctx.getImageData(0,0,w,h) // The image data containing the CanvasPixelArray, which we'll manipulate.
	  , cpa = imd.data					// The CanvasPixelArray, stores the rgba of every pixel in a 1D array.
	  , len = cpa.length				// The length of the CanvasPixelArray
	  , dln = data.length				// How many symbols does the data contain.

	var fpx = (y*w+x)*4;				// The position of the first pixel to start hiding data.
	
	// enoughSpace checks, surprisingly, if there's enough space to hide the message in the selected image with the selected x, y and z.
	var enoughSpace = function(){
		return (0<len*4-(fpx+z(2*dln)));
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


function hide(){
	var data = document.getElementById("data").value;
	var img = document.getElementById("targetImage");
	var x = document.getElementById("x");
	var y = document.getElementById("y");
	var z = document.getElementById("z");
	console.log(z.value)
	if((x===null) || (x.value == ""))x = undefined;
	else x = parseInt(x.value);
	if((y===null) || (y.value == ""))y = undefined;
	else y = parseInt(y.value);
	if((z===null) || (z.value == ""))z = undefined;
	else z = eval("("+z.value+")");
	console.log(x,y,z)
	img.src = hideData(data,img,x,y,z);
}
function seek(){
	var output = document.getElementById("data");
	var img = document.getElementById("targetImage");
	var x = document.getElementById("x");
	var y = document.getElementById("y");
	var z = document.getElementById("z");
	if((x===null) || (x.value == ""))x = undefined;
	else x = parseInt(x.value);
	if((y===null) || (y.value == ""))y = undefined;
	else y = parseInt(y.value);
	if((z===null) || (z.value == ""))z = undefined;
	else z = eval("("+z.value+")");
	output.value = readData(img,x,y,z);
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