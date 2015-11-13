/**
 * Created by zyg on 15/11/13.
 */
require('babel-polyfill');
var fn = function(){
  return new Promise((resolve,rej)=>{
      rej('await');
    });
};

var a = async function(){
  var b = await fn();
  console.log('b:',b);
};


a();