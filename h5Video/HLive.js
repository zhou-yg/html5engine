(function(){
    var HLive = function(_id){
        //加载的超时时间
        this.LOAD_TIMEOUT = 20000;
        //最大重新加载次数，单次等待加载的超时时间
        this.maxloadCount = 3;

        //keyEvents=[loadstart error canplay durationchange(2) timeupdate]
        this.keyEvents = ['loadstart','canplay','timeupdate','error','playing','pause'];
        this.callBackNames = ['progress','play','error'];

        this.progressState = {load:false,loaded:false,play:false,playing:false,pause:false};
        this.stateObj = {
            autoplay:false,
            loadCount:0,
            playCount:0,
            isInit:false,
            isSetE:false,
            isTimeupdate:false,
            loadSt:null,
            bufferSi:null,
            playSi:null
        };

        this.videoObj = document.getElementById(_id) || (function(){
            throw new Error('construct Function need 1 parameter');
        }());
    };
    HLive.prototype.reset = function(){
        //并重置
        this.stateObj.playCount = 0;
        this.stateObj.isTimeupdate = 0;

        for(var k in this.progressState){
            this.progressState[k] = false;
        }

        clearTimeout(this.stateObj.loadSt);
        clearInterval(this.stateObj.playSi);
        clearTimeout(this.stateObj.bufferSt);
    };
    HLive.prototype.eventHandler = function(_eType){
        var o = this;
        //loadstart
        if(_eType==o.keyEvents[0]){

            o.callBackObj.progress({'type':_eType,'text':'Load'});

            o.stateObj.loadSt = setTimeout(function(){

                o.callBackObj.error({'type':'error','text':'LT'});
            },o.LOAD_TIMEOUT);

            o.progressState.load = true;
            return;
        }
        //canplay
        if(_eType==o.keyEvents[1]){

            clearTimeout(o.stateObj.loadSt);

            o.callBackObj.progress({'type':_eType,'text':'Loaded'});
            if(o.stateObj.autoplay){
                o.videoObj.play();
            }
            o.progressState.loaded = true;
            return;
        }
        //playing
        if(_eType==o.keyEvents[4]){

            o.stateObj.pause = false;

            if(o.progressState.playing){

            }else{
                //设定计时器，如果timeupdate一直没更新,那么重新加载
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

                    o.stateObj.bufferSt = setTimeout(task,2000);
                }
                task();

                o.callBackObj.progress({'type':_eType,'text':'Buffer'});
            }
            return;
        }
        //timeupdate
        if(_eType==o.keyEvents[2]){
            //plyaing的状态，第一次触发
            if(o.stateObj.isTimeupdate >1){

                o.callBackObj.play({'type':_eType,'text':'Playing'});
                o.stateObj.playCount = 0;
                o.progressState.playing = true;

            }else if(o.stateObj.isTimeupdate==1){

                o.callBackObj.play({'type':_eType,'text':'SP2'});
                o.stateObj.isTimeupdate = 2;

            }else{

                o.callBackObj.play({'type':_eType,'text':'SP'});
                o.stateObj.isTimeupdate = 1;
            }
        }
        //error
        if(_eType==o.keyEvents[3]){
            o.reset();

            o.callBackObj.error({'type':_eType,'text':'NS'});
            return;
        }
        //pause
        if(_eType==o.keyEvents[5]){

            o.stateObj.pause = true;
            o.callBackObj.progress({'type':_eType,'text':'Pause'});
            return;
        }
    };
    HLive.prototype.load = function(){

        if(this.stateObj.loadCount > this.maxloadCount ){
            this.callBackObj.error({'type':'loadCount','text':'RM'});
            return;
        }
        var o = this;
        o.videoObj.load();
        setTimeout(function(){
            if(o.stateObj.autoplay){
                o.videoObj.play();
            }
        },0);
        this.stateObj.loadCount++;

        this.reset();
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
        console.log(o.videoObj);
        this.keyEvents.forEach(function(_el,_i){
            o.videoObj.addEventListener(_el,function(){
                o.eventHandler(_el);
            });
        });
    };
    HLive.prototype.playUrl = function(url){

        if(!this.stateObj.isSetE){
            return;
        }
        this.reset();

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
            this.videoObj.setAttribute('autoplay',"");
            this.stateObj.autoplay =  true;
        }
        if(_arg.poster){
            this.videoObj.setAttribute('poster',_arg.poster);
        }
        if(_arg.reloadCount){
            this.maxloadCount = _arg.reloadCount;
        }
        if(_arg.reloadCount==0){
            this.maxloadCount = 99;
        }
        //init completly then setEvents
        this.stateObj.isInit = true;
    };

    window.HLive = HLive;
})();