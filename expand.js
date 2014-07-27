var A = function(_arg){
	var arg = _arg;
	this.f1 = function(){
		console.log('f1'+arg);
	}
	this.expand = function(_arg){
		for(var k in _arg){
			this[k] = _arg[k];
		}
	}
}
var B = function(){
	this.name = 'B';
	this.getName = function(){
		return this.name;
	}
}
var a = new A('a');
var b = new B();
console.log(a);

a.expand({
	k1:'v1',
	k2:function(){
		console.log('v2');
	}
});
console.log(a);


a.expand({
	k3:function(){
		this.f1();
	},
	'b':b
});
console.log(a);
console.log(a.b.getName());
