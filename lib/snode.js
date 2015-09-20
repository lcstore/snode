
function absUrl(element,attrKey){
    var attrVal = element.getAttribute(attrKey);
    if(attrVal.indexOf('http')===0){
       return attrVal;
    }
    var url = require('url');
    var baseURI = document.baseURI;
    var uri = url.parse(document.baseURI);
    var index = uri.href.indexOf(uri.path);
    var domain = uri.href.substring(0,index);
    return domain + attrVal;
}

function ClientError(e) {
    return e.code >= 400 && e.code < 500;
}
function executeHeadScript(){
    var srcArr = [];
    var doc = document;
    var headEls = doc.getElementsByTagName('head');
    if(!headEls || headEls.length<1){
      return this;
    }
    var scriptEls = headEls[0].getElementsByTagName('script');
    for(var index in scriptEls){
        var sEle = scriptEls[index];
        if(sEle.hasAttribute('src')){
            var sUrl = absUrl(sEle,'src');
            srcArr.push(sUrl);
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
    console.log("@head,start to download script:",rpArr.length);
    return Promise.all(rpArr).then(function() {
         console.log("@head,finish to download script:",rpArr.length);
         var headEls = doc.getElementsByTagName('head');
          if(!headEls || headEls.length<1){
            return;
          }
          var scriptEls = headEls[0].getElementsByTagName('script');
          for(var index in scriptEls){
              var sEle = scriptEls[index];
              if(sEle.hasAttribute('src')){
                var src = absUrl(sEle,'src');
                html = dataMap[src];
              }else {
                  html = sEle.innerHTML;
              }
              if(html){
                 eval(html);
              }
          }
     }).error(function(err){
        console.log(err);
        return err;
     });
    
}

function executeBodyScript(){
    var srcArr = [];
    var doc = document;
    var bodyEls = doc.getElementsByTagName('body');
    if(!bodyEls || bodyEls.length<1){
      return this;
    }
    var scriptEls = bodyEls[0].getElementsByTagName('script');
    for(var index in scriptEls){
        var sEle = scriptEls[index];
        if(sEle.hasAttribute('src')){
            var sUrl = absUrl(sEle,'src');
            srcArr.push(sUrl);
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
    console.log("@body, start to download script:",rpArr.length);
    return Promise.all(rpArr).then(function() {
         console.log("@body, finish to download script:",rpArr.length);
         var bodyEls = doc.getElementsByTagName('body');
          if(!bodyEls || bodyEls.length<1){
            return;
          }
          var scriptEls = bodyEls[0].getElementsByTagName('script');
          for(var index in scriptEls){
              var sEle = scriptEls[index];
              if(sEle.hasAttribute('src')){
                var src = absUrl(sEle,'src');
                html = dataMap[src];
              }else {
                  html = sEle.innerHTML;
              }
              if(html){
                 eval(html);
              }
          }
     }).error(function(err){
        console.log(err);
        return err;
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
  var source = this.toString();
  var options = {};
  if(source.indexOf('http')===0){
    options.url = source;
  }
  
  return Promise.bind(html).then(function(){
     var doc = jsdom.jsdom(html,options);
     return doc;
  }).catch(function(err){
    return err;
  });
}

function createEnvironment(doc){
   document = doc;
   window = document.defaultView;
   console.log('@document.before:',document.getElementById("p_favor_count").innerHTML);
   return this;
}
function executeScript(doc){
  return Promise.bind(doc)
        .then(executeHeadScript)
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

