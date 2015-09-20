var rf=require("fs");  
var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird');
var jsdom = require("jsdom");
var rp = Promise.promisify(require('request'));


var data=rf.readFileSync("./favor.html","utf-8"); 
// console.log('data',data);
var doc= cheerio.load(data);

var document = jsdom.jsdom(data);
var window = document.defaultView;


var favor = doc('#p_favor_count').html();
console.log('favor:',favor);

function ClientError(e) {
    return e.code >= 400 && e.code < 500;
}
function defineHeadScript(){
    var srcArr = [];
    doc('head script[src]').each(function(index,element){
        srcArr.push(doc(element).attr('src'));
    });

    var dataMap = {};
    var rpArr = [];
    for(var i=0;i<srcArr.length;i++){
       var src = srcArr[i];
       rpArr.push(
          rp(src).then(function (body) {
            dataMap[src]=body;
            console.log('body len',body.length);
          })
       );

    }

    return Promise.all(rpArr).then(function() {
         console.log("all the files were created");
         doc('head script').each(function(index,element){
            var eDoc = doc(element);
            var src = eDoc.attr('src');
            var html;
            if(src){
                console.log('define src',src);
                html = dataMap[src];

            }else {
                html = eDoc.html();
            }
            if(html){
               eval(html);
            }
        });

         console.log('define chech',g_user);
        
         $ = window.jQuery;
         window.$= window.jQuery;
          console.log('define jQuery',$);
     });
    
}

function defineBodyScript(){
  console.log('defineBodyScript...');
    var srcArr = [];
    doc('body script[src]').each(function(index,element){
        srcArr.push(doc(element).attr('src'));
    });

    var dataMap = {};
    var rpArr = [];
    for(var i=0;i<srcArr.length;i++){
       var src = srcArr[i];
       rpArr.push(
          rp(src).then(function (body) {
            dataMap[src]=body;
            console.log('body len',body.length);
          })
       );

    }

    return Promise.all(rpArr).then(function() {
         console.log("all the files were created");
         doc('body script').each(function(index,element){
            var eDoc = doc(element);
            var src = eDoc.attr('src');
            var html;
            if(src){
                console.log('define src',src);
                html = dataMap[src];

            }else {
                html = eDoc.html();
            }
            if(html){
               eval(html);
            }
        });

         console.log('define body.favName',favName);
     });
}

 function doFavor(){
      var favor = doc('#p_favor_count').html();
      console.log('favor.after:',favor);
      console.log('document.after:',document.getElementById("p_favor_count").innerHTML);
      
 }
defineHeadScript().then(defineBodyScript).then(function() {
    console.log("in total: " );
   
    doFavor();
    doFavor();
    doFavor();
    doFavor();
    doFavor();
    doFavor();
    doFavor();
    
}).then(function(){
  console.log("then after.." );
  doFavor();

});

