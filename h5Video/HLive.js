(function(){
	var HLive = function(_id){
		//最大重新加载次数，单次等待加载的超时时间
		this.MAX_LOAD_COUNT = 3;
		//加载的超时时间
		this.LOAD_TIMEOUT = 20000;
		//缓冲的超时时间
		this.BUFFER_TIMEOUT = 5000;
		//卡住的单位超时时间，总数5
		this.PLAY_TIMEOUT   = 1000;
		
		//keyEvents=[loadstart error canplay durationchange(2) timeupdate]
		this.keyEvents = ['loadstart','canplay','timeupdate','error'];
		this.callBackNames = ['progress','play','error'];

		this.stateObj = {
			
			 loadTime:0,
			loadCount:0,
			deltaTime:0,
			   isInit:false,
			   isSetE:false,
			  isPause:false,
			isPlaying:false,
			   loadSt:null,
			 bufferSt:null,
			   playSt:null,
		};

		this.videoObj = document.getElementById(_id) || (function(){
			throw new Error('construct Function need 1 parameter');
		});
	};
	HLive.prototype.deltaPlay = function(){

		var o = this;

		if(o.stateObj.isPlaying && !o.stateObj.isPause){

			o.stateObj.playSt = setTimeout(function(){
				o.stateObj.time++;
			},o.PLAY_TIMEOUT);
		}
	};
	HLive.prototype.eventHandler = function(_eType){
		var o = this;
		//loadstart
		if(_eType==o.keyEvents[0]){
			
			o.callBackObj.progress({'type':_eType,'load':true});
			o.stateObj.loadSt = setTimeout(function(){
				o.callBackObj.error({'type':'error','text':'LOAD TIMEOUT'});
			},o.LOAD_TIMEOUT);
		}
		//canplay
		if(_eType==o.keyEvents[1]){

			clearTimeout(o.stateObj.loadSt);
			
			o.callBackObj.progress({'type':_eType,'buffer':true});
			o.videoObj.play();

			o.stateObj.bufferSt = setTimeout(function(){
				o.callBackObj.error({'type':'error','text':'BUFFER TIMEOUT'});
				o.load();
			},o.BUFFER_TIMEOUT);
		}
		//timeupdate
		if(_eType==o.keyEvents[2]){

			if(!o.stateObj.isPlaying){

				o.callBackObj.play({'type':_eType,'text':'On Playing'});
				o.deltaPlay();

				clearTimeout(o.stateObj.bufferSt);
			}else{
				o.stateObj.isPlaying = true;
				o.stateObj.time++;
			}
		}
		//error
		if(_eType==o.keyEvents[3]){
			o.callBackObj.error({'type':_eType,'text':'NO SOURCE'});
			return;
		}
	};
	HLive.prototype.load = function(){

		if(this.stateObj.loadCout > this.MAX_LOAD_COUNT ){
			o.callBackObj.error({'type':'loadCount','text':'reload more than max'});
			return;
		}

		this.videoObj.load();
		
		this.stateObj.loadCount++;
		this.stateObj.loadTime  = 0;
		this.stateObj.deltaTime = 0;
	};
	HLive.prototype.playUrl = function(url){
	
		if(!this.stateObj.isSetE){
			return;
		}else{
			
			this.stateObj.loadCount = 0;
			this.stateObj.isPlaying = false;
			
			clearTimeout(this.stateObj.loadSt);		
			clearTimeout(this.stateObj.bufferSt);		
			clearTimeout(this.stateObj.playSt);		
		}
		this.videoObj.src = url;
		this.load();
	};
	//回调函数_arg{progress:Function,play:Function,error:Function}
	HLive.prototype.setEvents = function(_arg){
		
		if(this.stateObj.isSetE || !this.stateObj.isInit){
			return;
		}else{
			this.stateObj.isSetE = true;
		}
		if(_arg && _arg.constructor===Object && _arg.hasOwnProperty(this.callBackNames[0]) && _arg.hasOwnProperty(this.callBackNames[1]) && _arg.hasOwnProperty(this.callBackNames[2])){
			this.callBackObj = _arg;
		}else{
			throw new Error('no or it need progress&play&error  in setEvents Function');
		}
		var o = this;
		this.keyEvents.forEach(function(_el,_i){
			o.videoObj.addEventListener(_el,function(_e){
				o.eventHandler(_el);
			});
		});
	};
	//_arg{width:number,height:number,timeout:number,autoplay:boolean,poster:String}
	HLive.prototype.init = function(_arg){
 		if(!_arg){
			return;
		}

		var width = _arg.width||'100%';
		var height= _arg.height||'100%';

		if(width && typeof width == 'number'){
			width = width + 'px';
			this.videoObj.style.width = width;
		}
		if(height && typeof height == 'number'){
			height = height + 'px';
			this.videoObj.style.height= height;
		}
		if(_arg.autoplay){
			this.videoObj.setAttribute('autoplay',true);
		}
		if(_arg.poster){
			this.videoObj.setAttribute('poster',_arg.poster);
		}
		//init completly then setEvents
		this.stateObj.isInit = true;
	};
	
	window.HLive = HLive;
})();