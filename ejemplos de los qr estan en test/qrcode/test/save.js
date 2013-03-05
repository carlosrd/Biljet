var QRCode = require(__dirname+'/../qrcode')
	, fs = require('fs')
	, util = require('util');

//direccionde escritura
var path = './tmp.png';
	
QRCode.save(path,'life of the party bros',function(error,written){
	if(error) {
		console.log(error);
	} else {
		util.print(written == (fs.statSync(path)||{}).size?"PASS: written should be to the correct file\n":"FAIL: file should be written size\n");
		//esto es para q lo borre
		fs.unlinkSync(path);
	}
});
