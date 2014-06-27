var v = $("video")[0];
v.src = "Let_it_go.mp4";
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
alert(navigator.getUserMedia);
if (navigator.getUserMedia) {

	function success(stream) {
		v.src = stream;
	}
	function error(e) {
		console.log(e);
	}
	var u = navigator.getUserMedia({video:true},success,error);

} else {

}