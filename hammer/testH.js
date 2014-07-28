var container = document.getElementById('container');

var ht = Hammer(container).on('tap', function(_e) {
	$('#t').text('tap' + (+new Date()));

	window["ontouchmove"] = function(_e) {
		_e.preventDefault();
		_e.stopPropagation();
	};
});
var hd = Hammer(container).on('drag', function(_e) {
	$('#b').text(_e.gesture.direction);
	$('#d').text(_e.gesture.distance);
});
var hdl = Hammer(container).on('dragup',function(_e){
	console.log(_e);
});
var hde = Hammer(container).on('dragend', function(_e) {
	$('#t').text('drag end');
});
var hr = Hammer(container).on('release', function(_e) {
	$('#e').text('release' + (+new Date()));
	$('#j').text(_e.gesture.pointerType);
});
var hh = Hammer(container).on('hold', function(_e) {
	$('#f').text('hold' + (+new Date()));
});


var container2 = document.getElementById('container');
console.log(Hammer(container)===Hammer(container2));

/*
 *在移动端，禁止浏览器的滑动 事件 ，可以让hammer事件的顺便触发，否则会很诡异。
 *.可以像jquery的on一样设置事件
 *.drag与tap的关系，两者不会同时触发 
 *.release一般会触发 
 *._e.type,获取当前触发的事件类型
 *.有用的属性值基本在于_e.gesture对象中
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * */ 