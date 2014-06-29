var v = $("video")[0];
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
if (navigator.getUserMedia) {
	function success(stream) {
		v.src = URL.createObjectURL(stream);
	}
	function error(e) {
		console.log(e);
	}
	var u = navigator.getUserMedia({video:true},success,error);
} else {
	alert("false");
}