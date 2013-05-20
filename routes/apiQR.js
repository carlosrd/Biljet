/*jslint node: true */

"use strict";

var mongoose, Schema, db, allSchemas, QR;

// MongoDB conection
mongoose = require('mongoose');
Schema = mongoose.Schema;
db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var fs = require('fs'),
	qrCode = require('qrcode-npm/qrcode'),
    crypto = require('crypto');

var allSchemas = require('../models/allSchemas');
QR = mongoose.model('QR');

var Event = mongoose.model('Event');
var User = mongoose.model('User');

//a esta funcion hay q pasarle el id del user el id del event el numero de entradas y el id del QR
function createQR(idQR,userId,eventId,numberTickets){

	var text = idQR + " " + userId + " " + eventId + " " + numberTickets;

	var qr = qrCode.qrcode(4, 'M');

	qr.addData(text);
	qr.make();
	var imgTag = qr.createImgTag(4);
	var n = imgTag.indexOf("\u0020width=");
	var imgFinal = imgTag.slice(32,n-1);

	fs.writeFile("./public/img/"+idQR, imgFinal , 'base64',function(err) {
	if(err){
	    console.log(err);
	}else{
	    console.log('qr create');
	}
};

function encrypt (key,plaintext){

    var cipher = crypto.createCipher('aes-256-cbc', key),encryptedPassword;

    cipher.update(plaintext, 'utf8', 'base64');
    encryptedPassword = cipher.final('base64');
    console.log('encrypted :', encryptedPassword);

    return encryptedPassword;

};

function decrypt (key,encryptedPassword){

    var decipher = crypto.createDecipher('aes-256-cbc', key),decryptedPassword;

    decipher.update(encryptedPassword, 'base64', 'utf8'); 
    decryptedPassword = decipher.final('utf8');
    console.log('decrypted :', decryptedPassword);

    return decryptedPassword;
};

function validateQR(stringQR){

	var elementsQR = stringQR.split(" ");
	//buscamos el qr en la base de datos
	QR.findOne({_id: elementsQR[0]}, function (err,QRToCompare){
	  if (err) {
            return -1;
        } else if (QRToCompare === null) {
            return -1;
        } else {
        	//saber si es ese usuario esta dentro del qr
        	if (QRToCompare.username !== elementsQR[1]) {
        		return -1;
        	}
        	else{
        		//saber si es ese evento del qr
        		if (QRToCompare.event !== elementsQR[2]){
        			return -1;
        		}
        		else{
        				//si coinciden el numero de entradas
        			if (QRToCompare.numberTickets !== elementsQR[3]){
        				return-1;
        			}
        			else{
        				//si no ha sido usado
        				if (QRToCompare.isUse){
        					return -1;
        				}
        				else {
        					return 0;
        				}
        			}
        		}
    		}
        }
    });
};

