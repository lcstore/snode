


function ClientError(e) {
    return e.code >= 400 && e.code < 500;
}
function executeHeadScript(){
    var srcArr = [];
    var doc = document;
    var headEls = doc.getElementsByTagName('head');
    console.log("@headEls:",headEls.length);
    if(!headEls || headEls.length<1){
      return;
    }
    var scriptEls = headEls[0].getElementsByTagName('script');
    for(var index in scriptEls){
        var sEle = scriptEls[index];
        if(sEle.hasAttribute('src')){
            srcArr.push(sEle.getAttribute('src'));
        }
    }

    var dataMap = {};
    var rpArr = [];
    for(var i=0;i<srcArr.length;i++){
       var src = srcArr[i];
       rpArr.push(
          rp(src).then(function (body) {
            dataMap[src]=body;
          })
       );

    }

    return Promise.all(rpArr).then(function() {
         console.log("@head script,download count:",rpArr.length);
         var headEls = doc.getElementsByTagName('head');
          if(!headEls || headEls.length<1){
            return;
          }
          var scriptEls = headEls[0].getElementsByTagName('script');
          for(var index in scriptEls){
              var sEle = scriptEls[index];
              if(sEle.hasAttribute('src')){
                var src = sEle.getAttribute('src');
                html = dataMap[src];
              }else {
                  html = sEle.innerHTML;
              }
              if(html){
                 eval(html);
              }
          }
     });
    
}

function executeBodyScript(doc){
    var srcArr = [];
    var bodyEls = doc.getElementsByTagName('body');
    if(!bodyEls || bodyEls.length<1){
      return;
    }
    var scriptEls = bodyEls[0].getElementsByTagName('script');
    for(var index in scriptEls){
        var sEle = scriptEls[index];
        if(sEle.hasAttribute('src')){
            srcArr.push(sEle.getAttribute('src'));
        }
    }

    var dataMap = {};
    var rpArr = [];
    for(var i=0;i<srcArr.length;i++){
       var src = srcArr[i];
       rpArr.push(
          rp(src).then(function (body) {
            dataMap[src]=body;
          })
       );

    }

    return Promise.all(rpArr).then(function() {
         console.log("@body script,download count:",rpArr.length);
         var bodyEls = doc.getElementsByTagName('body');
          if(!bodyEls || bodyEls.length<1){
            return;
          }
          var scriptEls = bodyEls[0].getElementsByTagName('script');
          for(var index in scriptEls){
              var sEle = scriptEls[index];
              if(sEle.hasAttribute('src')){
                var src = sEle.getAttribute('src');
                html = dataMap[src];
              }else {
                  html = sEle.innerHTML;
              }
              if(html){
                 eval(html);
              }
          }
     });
}


function doBootstrap(source){
  console.log('@start to bootstrap snode...');
  return this;
}

function doRequest(source){
  source = source.toString();
  if(source.indexOf('http')==0){
    var url = source;
    var options = {'url':url,'method': 'GET'};

    function ClientError(e) {
        return e.code >= 400 && e.code < 500;
    }
   console.log('url:',url);
   return rp
          .get(url)
          .on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
            var chunks = [];
            var size = 0;
            response.on('data', function(chunk){
                size += chunk.length;
                chunks.push(chunk);
            });
            response.on('end', function(){
                var data = Buffer.concat(chunks, size);
                console.log('data.len:',data.length);
                return Promise.resolve(data);
            });
          });
   
        
  }else{
    return Promise.resolve(source);
  }
   
}

function createDocument(html){
  console.log('html:',html.length) // 200
  return Promise.bind(html).then(function(){
     return jsdom.jsdom(this);
  }).catch(function(err){
    return err;
  });
}

function createEnvironment(doc){
   document = doc;
   window = document.defaultView;
   return this;
}
function executeScript(doc){
  return executeHeadScript()
        .then(executeBodyScript)
        .then(function(){
          console.log('@@success to execute script');
        })
        .catch(function(err){
          return err;
        });
}

function doParser(doc){

   console.log('@document.after:',document.getElementById("p_favor_count").innerHTML);
  return this;
}

function catchHandler(err){
  console.log('@handle catch',err);
}

function errorHandler(err){
  console.log('@handle err',err);
}

function finalHandler(result){
  console.log('@handle finally');
}

var rf=require("fs");  
// var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird');
var jsdom = require("jsdom");
var rp = Promise.promisify(require("request-promise"));

var data=rf.readFileSync("./favor.html","utf-8"); 
data='http://www.oschina.net/news/61621/jsdom-5-0-1-released';
// var doc= cheerio.load(data);
console.log('@data len:',data.length);
//define global var
var document,window;
Promise.bind(data)
.then(doBootstrap)
.then(doRequest)
.then(createDocument)
.then(createEnvironment)
.then(executeScript)
.then(doParser)
// .catch(catchHandler)
.error(errorHandler)
.finally(finalHandler);

