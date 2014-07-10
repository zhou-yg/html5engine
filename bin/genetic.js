function npv(arr,i){
	var npv = 0;
	if(arr.constructor == Array){
		for (var j=1; j <=arr.length; j++) {
			var v = arr[j-1];
			npv = npv + v*Math.pow(1+i,-j);
		};
	}
	return npv;
}
function inrr(npv1,npv2,i1,i2){
	if(npv1 != npv2){
		var a1 = (npv1/(npv1-npv2)) * (i2-i1) + i1;
		return a1;
	}else{
		return 0;
	}
}

function aw(arr,i){
	var r1 = npv(arr,i);
	var r2 = Math.pow(i*(1+i),arr.length) / (Math.pow(1+i,arr.length) -1);
	return r1 * r2;
}