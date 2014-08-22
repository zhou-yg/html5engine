(function(){
	var iii=0;
	var HLive = function(_id){
		//最大重新加载次数，单次等待加载的超时时间
		this.MAX_LOAD_COUNT = 3;
		//加载的超时时间
		this.LOAD_TIMEOUT = 15000;
		//缓冲的超时时间
		this.BUFFER_TIMEOUT = 5000;
		//卡住的单位超时时间，总数5
		this.PLAY_TIMEOUT   = 3000;
		
		//keyEvents=[loadstart error canplay durationchange(2) timeupdate]
		this.keyEvents = ['loadstart','canplaythrough','timeupdate','error','playing','pause'];
		this.callBackNames = ['progress','play','error'];

		this.stateObj = {
			
			 loadTime:0,
			loadCount:0,
			deltaTime:0,
			   isInit:false,
			   isSetE:false,
			  isPause:false,
		 isTimeupdate:false,
			   loadSt:null,
			 bufferSt:null,
			   playSi:null,
		};

		this.videoObj = document.getElementById(_id) || (function(){
			throw new Error('construct Function need 1 parameter');
		});
	};
	HLive.prototype.deltaPlay = function(){

		var o = this;

		if(o.stateObj.isTimeupdate && !o.stateObj.isPause){

			o.stateObj.playSi = setInterval(function(){
				
				var t = (+new Date()) - o.stateObj.deltaTime;
				
				if(t>o.PLAY_TIMEOUT){

					clearInterval(o.stateObj.playSi);
					
					o.callBackObj.error({'type':'lockTimeout','text':'Lock'});
				}
				
			},o.PLAY_TIMEOUT);
		}
	};
	HLive.prototype.eventHandler = function(_eType){
		var o = this;
		//loadstart
		if(_eType==o.keyEvents[0]){
			$('#a').append('|');
			o.callBackObj.progress({'type':_eType,'load':true});
			o.stateObj.loadSt = setTimeout(function(){
				o.callBackObj.error({'type':'error','text':'LOAD TIMEOUT'});
			},o.LOAD_TIMEOUT);
		}
		//canplay
		if(_eType==o.keyEvents[1]){

			$('#b').append('|');
			clearTimeout(o.stateObj.loadSt);
			
			o.callBackObj.progress({'type':_eType,'buffer':true});
			o.videoObj.play();
		}
		//timeupdate
		if(_eType==o.keyEvents[2]){
			
			$('#c').append('|');
			$('#d').append(o.stateObj.isTimeupdate+'-');
			//如果不是plyaing的状态，那么说明是第一次触发
			if(!o.stateObj.isTimeupdate){

				o.callBackObj.play({'type':_eType,'text':'Playing'});
				o.deltaPlay();

				o.stateObj.isTimeupdate = true;
			}else{
				clearTimeout(o.stateObj.bufferSt);
				o.stateObj.deltaTime = (+new Date());
			}
		}
		//error
		if(_eType==o.keyEvents[3]){
			$('#d').append('|').css('color','#ff0000');
			o.callBackObj.error({'type':_eType,'text':'NO SOURCE'});
			return;
		}
		//playing
		if(_eType==o.keyEvents[4]){

			if(o.stateObj.isTimeupdate || o.stateObj.deltaTime==0){
				
				o.callBackObj.progress({'type':_eType,'text':'Play'});
				//缓冲计时，如果这个时间内，timeupdate还未更新，可认为此视频无法播放，需要重新load();
				o.stateObj.bufferSt = setTimeout(function(){
					o.callBackObj.error({'type':'error','text':'BUFFER TIMEOUT'});
					o.load();
				},o.BUFFER_TIMEOUT);
			}
		}
		//pause
		if(_eType==o.keyEvents[5]){
			$('#f').append('|');
			o.stateObj.isPause = true;
			
			o.callBackObj.progress({'type':_eType,'text':'Pause'});

			clearTimeout(o.stateObj.bufferSt);
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
	HLive.prototype.playUrl = function(url){
	
		if(!this.stateObj.isSetE){
			return;
		}else{
			
			this.stateObj.loadCount = 0;
			this.stateObj.isTimeupdate = false;
			this.stateObj.deltaTime = 0;

			clearTimeout(this.stateObj.loadSt);		
			clearTimeout(this.stateObj.bufferSt);		
			clearInterval(this.stateObj.playSi);		
		}
		this.videoObj.src = url;
		this.load();
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