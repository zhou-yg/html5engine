(function(){
	var iii=0;
	var HLive = function(_id){
		//最大重新加载次数，单次等待加载的超时时间
		this.MAX_LOAD_COUNT = 3;
		//加载的超时时间
		this.LOAD_TIMEOUT = 20000;
		//缓冲的超时时间
		this.BUFFER_TIMEOUT = 1000;
		//卡住的单位超时时间，总数5
		this.PLAY_TIMEOUT   = 3000;
		
		//keyEvents=[loadstart error canplay durationchange(2) timeupdate]
		this.keyEvents = ['loadstart','canplaythrough','timeupdate','error','playing','pause'];
		this.callBackNames = ['progress','play','error'];

		this.progressState = {load:false,loaded:false,play:false,playing:false,pause:false};
		this.stateObj = {
			autoPlay:false,
			loadCount:0,
			playCount:0,
			   isInit:false,
			   isSetE:false,
		 isTimeupdate:false,
			   loadSt:null,
			 bufferSi:null,
			   playSi:null,
		};

		this.videoObj = document.getElementById(_id) || (function(){
			throw new Error('construct Function need 1 parameter');
		});
	};
	HLive.prototype.deltaPlay = function(){

	};
	HLive.prototype.eventHandler = function(_eType){
		var o = this;
		//loadstart
		if(_eType==o.keyEvents[0]){

			o.callBackObj.progress({'type':_eType,'text':'Load'});
			
			o.stateObj.loadSt = setTimeout(function(){
				
				o.callBackObj.error({'type':'error','text':'LOAD TIMEOUT'});
			},o.LOAD_TIMEOUT);
			
		}
		//canplay
		if(_eType==o.keyEvents[1]){

			clearTimeout(o.stateObj.loadSt);
			
			o.callBackObj.progress({'type':_eType,'text':'Loaded'});
			if(o.stateObj.autoPlay){
				o.videoObj.play();
			}
			o.progressState.loaded = true;
		}
		//timeupdate
		if(_eType==o.keyEvents[2]){
			
			$('#c').append('|');
			//如果不是plyaing的状态，那么说明是第一次触发
			if(!o.stateObj.isTimeupdate){

				o.stateObj.isTimeupdate = true;
			}else{

				o.stateObj.playCount = 0;

				o.callBackObj.play({'type':_eType,'text':'Playing'});

				o.progressState.playing = true;
			}
		}
		//error
		if(_eType==o.keyEvents[3]){
			clearTimeout(o.stateObj.loadSt);
			o.callBackObj.error({'type':_eType,'text':'No source'});
			return;
		}
		//playing
		if(_eType==o.keyEvents[4]){

			o.stateObj.pause = false;

			if(o.progressState.playing){
				
				
				
			}else{
				//设定计时器，如果timeupdate一直没更新，即‘卡住’了,那么重新加载
				function task(){

					if(o.stateObj.pause || !o.progressState.loaded){
						return;
					}
					if(o.stateObj.playCount <5){
						
						o.stateObj.playCount++;
					}else{
						o.stateObj.playCount = 0;
						o.load();
					}
					
					setTimeout(task,1000);
				}
				setTimeout(task,1000);
				
				o.callBackObj.progress({'type':_eType,'text':'Buffer'});
			}
		}
		//pause
		if(_eType==o.keyEvents[5]){
			
			o.stateObj.pause = true;
			
			o.callBackObj.progress({'type':_eType,'text':'Pause'});
		}
	};
	HLive.prototype.load = function(){

		if(this.stateObj.loadCount > this.MAX_LOAD_COUNT ){
			this.callBackObj.error({'type':'loadCount','text':'reload more than max'});
			return;
		}

		this.videoObj.load();
		this.stateObj.loadCount++;
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
		}
		//并重置
		this.stateObj.loadCount = 0;
		this.stateObj.playCount = 0;
		this.stateObj.isTimeupdate = false;
		

		 clearTimeout(this.stateObj.loadSt);		
		clearInterval(this.stateObj.playSi);	
		clearInterval(this.stateObj.bufferSi);
			
		for(var k in this.progressState){
			this.progressState[k] = false;
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
			this.stateObj.autoPlay =  true;
		}
		if(_arg.poster){
			this.videoObj.setAttribute('poster',_arg.poster);
		}
		//init completly then setEvents
		this.stateObj.isInit = true;
	};
	
	window.HLive = HLive;
})();


