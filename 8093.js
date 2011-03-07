// I know the code here looks messy.. I haven't gotten around to clean it up yet....
// I'll also finish adding comments at a later time, as of now they are few and not very helpful and probably outdated as well..


function Error(msg,add){
	// Red notes
	if(!add)cons.className = "error";
	cons.innerHTML = add?cons.innerHTML+"<br/>"+msg:msg;
	return 0;
}
function CatchError(err,add){
	// Tiny red notes
	return Error("<h6>"+err.__proto__.name+": "+err.arguments.join(", ")+" "+err.type+"<h6>",add);
}
function Note(msg,add){
	// Green notes
	if(!add)cons.className = "note";
	cons.innerHTML = add?cons.innerHTML+"<br/>"+msg:msg;
	return 0;
}
function ClearNote(){cons.innerHTML = "";}

function hideData(data,img,x,y,z){
	// Hides the data in the selected image, starting at (x,y) with a z(i) giving a relative position in difference to (x,y) for where to hide the next part of the data..
	// All unused pixels have random info in them.

	if((data === undefined) || data == "") return Error("No data selected!");
	if(img === undefined) var img = document.getElementById("targetImage");
	if((img.src == "") || img.src.search(/http\:\/\/.*drag\.png/)>=0) return Error("No image selected.");

	var tempImg = new Image();
	tempImg.src = img.src;
	var canvas = document.createElement("canvas")
	  , ctx = canvas.getContext("2d")
	  , w = canvas.width = tempImg.width
	  , h = canvas.height = tempImg.height;
	ctx.drawImage(tempImg,0,0);

	if(x > tempImg.width  || x < 0 ||
	   y > tempImg.height || y < 0) return Error("The coordinate (x,y) is not within the image. Image size is "+tempImg.width+"/"+tempImg.height);

	delete tempImg;

	var imd = ctx.getImageData(0,0,w,h);

	var cpa = imd.data
	  , len = cpa.length
	  , dln = data.length

	var fpx = (y*w+x)*4;

	var values = "rgba";
	
	var chn = 0;
	for(var i in rgba)if(rgba[i])chn++;

	function enoughSpace(){
		return (0<len*chn-(fpx+z(4*dln)));
	}
	if(!enoughSpace())return Error("Image not large enough to contain the data with the current settings.");

	function validFunction(){
		var found = {};
		for(var i = 0; i < dln*4/chn;i++){
			var n = z(i)^0;
			if(found[n])return false;
			else found[n] = true;
		}
		return true;
	}

	if(!validFunction()) return Error("Function Z repeats integers, data may be corrupted.")


	function leastSignificant(num,data){
		return num-(num&3)+(data&3);
	}

	function parseData(data){
		var parsed = "";
		for(var i in data){
			var n = data[i].charCodeAt(0)&255
			parsed += (n&192)>>6;
			parsed +=  (n&48)>>4;
			parsed +=  (n&12)>>2;
			parsed +=   (n&3)^0;
		}
		return parsed+"0003";
	}


	var ndata = parseData(data);
	var nln = ndata.length;
	var cch = 0;

	// Randomize the opacity in all the other pixels.
	// As the char code is stored with it's base 16 representation over two pixels, 16 is the greatest opacity neccecary to make...
	var j = len;
	var u;
	do{
		u = j-1;
		if(!rgba[u&3])continue;
		cpa[u] = leastSignificant(cpa[u], (Math.random()*4)^0);
	} while (--j);
	for(var i = 0; i < nln; i++){
		var gap;
		var Z = fpx+(z(i)^0)*4;
		for(var l in rgba){
			if(!rgba[l])continue;
			gap = values.indexOf(l);
			if(gap<0)continue;

			var c = parseInt(ndata.substr(cch,1));
			cch++;
			cpa[Z+gap] = leastSignificant(cpa[Z+gap], c);
			if(cch>=nln)break;
		}
		if(cch>=nln)break;
	}

	// Place the new image data into the canvas.
	ctx.putImageData(imd,0,0);
	var dataURL = canvas.toDataURL("image/png");
	delete canvas
		 , ctx
		 , w, h, cch, ndata, nln, cpa, imd, len, dln;
	return canvas.toDataURL("image/png");
}

function getIO(){
	io = {ele:{}};
	io.ele.data = document.getElementById("data");
	io.ele.img	= document.getElementById("targetImage");
	io.ele.x	= document.getElementById("x");
	io.ele.y	= document.getElementById("y");
	io.ele.z	= document.getElementById("z");
	io.data = io.ele.data.value;
	var pos0 = io.data.search(/\[\#hidden-with:.*\#\]/);
	if(pos0>=0){
		var pos1 = io.data.search(/\#\]/)+2;
		var hideWith = io.data.substr(pos0,pos1-pos0);
		io.data = io.data.replace(hideWith,"");
		hideWith = hideWith.replace("[#hidden-with:","").replace("#]","").split("#");
		if(hideWith.length!=4)return Error("Corrupt hide-with expression. The pattern is like this [#hidden-with:rgb#x#y#function(i){return i;}#] and should be pasted once, anywhere in the text-field.")
		for(var l in rgba){
			var vali = "rgba";
			var n = hideWith[0].indexOf(l);
			if(n<0)rgba[l] = false;
			else rgba[l] = true;
			document.getElementById(l).className = (rgba[l])?"active":"";
		}
		io.ele.x.value = hideWith[1];
		io.ele.y.value = hideWith[2];
		io.ele.z.value = hideWith[3];
	}
	if((io.ele.x===null) || (io.ele.x.value == "") || isNaN(parseInt(io.ele.x.value)))io.x = undefined;
	else io.x = parseInt(io.ele.x.value);
	if((io.ele.y===null) || (io.ele.y.value == "") || isNaN(parseInt(io.ele.y.value)))io.y = undefined;
	else io.y = parseInt(io.ele.y.value);
	if((io.ele.z===null) || (io.ele.z.value == ""))io.z = undefined;
	else{
		try{io.z = eval("("+io.ele.z.value+")");
		}catch(err){return Error("Invalid Z function.")+CatchError(err,1)}
	}
	var def = getDefaultXYZ()
	if(typeof io.x != "number")io.x = def[0];
	if(typeof io.y != "number")io.y = def[1];
	if(typeof io.z != "function")io.z = def[2]; 
	try{io.z(0)}catch(err){return Error("Invalid Z function.")+CatchError(err,1)}
	return io;
}

function hide(){
	ClearNote();
	var io = getIO();
	if(!io)return;
	var nsrc = hideData(io.data,io.ele.img,io.x,io.y,io.z);
	if(typeof nsrc != "string")return -1;
	io.ele.img.src = nsrc;
	Note("Hiding complete!");
	var vs = ""
	for(var u in rgba)if(rgba[u])vs+=u;
	Note("<h6>[#hidden-with:"+vs+"#"+io.x+"#"+io.y+"#"+io.z+"#]</h6>",1);
	delete io,nsrc,vs;
}
function seek(){
	ClearNote();
	var io = getIO();
	if(!io)return;
	io.ele.data.value = readData(io.ele.img,io.x,io.y,io.z);
	Note("Reading complete!");
	var vs = ""
	for(var u in rgba)if(rgba[u])vs+=u;
	Note("<h6>[#hidden-with:"+vs+"#"+io.x+"#"+io.y+"#"+io.z+"#]</h6>",1);
	delete io,vs;
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


	if(x > tempImg.width  || x < 0 ||
	   y > tempImg.height || y < 0) return Error("The coordinate (x,y) is not within the image. Image size is "+tempImg.width+"/"+tempImg.height);

	var imd = ctx.getImageData(0,0,w,h)
	  , cpa = imd.data				
	  , len = cpa.length				
	  , fpx = (y*w+x)*4;		

	var values = "rgba";

	// Extract the data from the CPA
	var data = ""
	var lx = (len-fpx-3)/4;
	var seq = [0,6]

	delete canvas
		 , ctx
		 , imd;

	var pixl = "";
	for(var i = 0; z(i)<lx; i++){
		var gap;
		var Z = fpx+(z(i)^0)*4;
		for(var l in rgba){
			if(!rgba[l])continue;
			gap = values.indexOf(l);
			if(gap<0)continue;

			var c = parseInt(cpa[Z+gap])&3;
			seq[0] += c<<seq[1];
			if(!seq[1]){
				if(seq[0]==3)return (delete cpa),(data+pixl);
				else pixl += String.fromCharCode(seq[0]);
				if(pixl.length>=data.length>>2)data += pixl, pixl = "";
				seq = [0,6]
			} else seq[1] -= 2;
		}
	}
	return (delete cpa),data;
}


function getDefaultXYZ(canvas){
	var x = decodeKey("default",100)[0];
	var y = decodeKey("default",100)[1];
	var z = eval("(function(i){return i*"+decodeKey("default",10)[0]+";})")
	return [x,y,z];
}

function decodeKey(key,xm,ym){
	if(xm===undefined)var xm = 100;
	if(ym===undefined)var ym = 100;
	var b16t = "0123456789ABCDEF";
	var lok = key.length
	function dtb(l){
		var n = l.charCodeAt(0);
		return b16t[n>>4]+b16t[n&15];
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
	var y = Math.abs(sumdig((d/c)^0)%ym);
	return [x,y]
}