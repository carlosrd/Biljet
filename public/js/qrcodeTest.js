var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
	
	var qr = qrcode(typeNumber || 6, errorCorrectLevel || 'M');
	qr.addData(text);
	qr.make();
	

//	return qr.createTableTag();
	var img=qr.createImgTag();
	//qr.save("p.gif",img);
	return img;
};

var update_qrcode= function() {
	var text = document.forms[0].elements['msg'].value;


	document.getElementById('qr').innerHTML = create_qrcode(text);
};


/*lo que queria hacer pero nose como ponerlo integrado en los jade 
lo de guardar si coges y pones eso en app guarda perfectamente
var qrCode = require('qrcode-npm/qrcode'),
fs = require('fs');

//save qrcode
 var saveQr = function(nameFile,qr) {
	//need delete this in the first of the string <img\u0020src="data:image/gif;base64,
	var start=31;
 	var end=qr.indexOf("\u0020width="); 
  	var base64=qr.slice(start,end-1);

	fs.writeFile(nameFile, base64, 'base64', function(err) {
 		 console.log(err);
		});
};

 var update_qrcode = function() {
	var text = 'Hello World';
	var qr = qrCode.qrcode(4, 'M');
	qr.addData(text);
	qr.make();
	var imgTag = qr.createImgTag(4);
	document.getElementById('qr').innerHTML = create_qrcode(text)
};

module.exports = create_qrcode;
module.exports = saveQr;

*/