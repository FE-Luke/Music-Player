/**
 * Created by Zhichao Liu on 11/19/2015.
 */

window.onload = function () {
    document.getElementsByTagName('body')[0].style.height = innerHeight+'px';
    var songList = [
        {name:'南山南',artist:'马頔',duration:'05:24',src:'./musics/1.mp3'},
        {name:'夜曲',artist:'周杰伦',duration:'03:47',src:'./musics/2.mp3'},
        {name:'无可替代',artist:'欧豪',duration:'03:50',src:'./musics/3.mp3'},
        {name:'自恋的我',artist:'王矜霖',duration:'03:48',src:'./musics/4.mp3'},
        {name:'小苹果',artist:'筷子兄弟',duration:'03:31',src:'./musics/5.mp3'},
        {name:'樱树花',artist:'胡艾彤',duration:'03:22',src:'./musics/6.mp3'},
        {name:'这支烟灭了以后',artist:'张静波',duration:'04:03',src:'./musics/7.mp3'},
        {name:'活着',artist:'郝云',duration:'04:31',src:'./musics/8.mp3'},
        {name:'傲寒',artist:'马頔',duration:'05:57',src:'./musics/9.mp3'},
        {name:'MASAYUME CHASING',artist:'BoA',duration:'03:41',src:'./musics/10.mp3'}
    ];
    var defaultInfo = ['QQ音乐,音乐你的生活','QQ音乐',''];
    var isFold = true , isList = false , isLyric = false , playMode = 'lb',nowVolume= 1,currentIndex;
    var audio = document.getElementById('audio'),
        uiLayer = document.getElementById('player-ui'),
        listLayer = document.getElementById('play-list'),
        listEl = document.getElementsByName('list-detail'),
        volCtrlEl = document.getElementById('vol-ctrl'),
        playCtrlEl = document.getElementById('play-control'),
        prevSongBtn = document.getElementById('prev-btn'),
        nextSongBtn = document.getElementById('next-btn'),
        playModeBtn = document.getElementById('play-way'),
        playModeList = document.getElementById('way-list');

    /*播放列表创建*/
    for(var i=0;i<songList.length;i++){
        var tmpEl = document.createElement('ul');
        tmpEl.index = i;
        tmpEl.setAttribute('name','list-detail');
        tmpEl.innerHTML = '<li>'+songList[i].name+'</li><li>'+songList[i].artist+'</li><li>'+songList[i].duration+'</li><ul class="list-option"><li class="list-like"></li><li class="list-share"></li><li class="list-star"></li><li class="list-del"></li></ul>';
        document.getElementById('list-main').appendChild(tmpEl);
    }

    var uiFold = function () {
        if(isFold){
            uiLayer.style.left = '0px';
            isFold = false;
            setTimeout(function () {
                document.getElementById('fold').setAttribute('class','leftAllow');
            },500);
        }else{
            if(isList){
                switchList();
                setTimeout(function () {
                    uiLayer.style.left = '-540px';
                    isFold = true;
                },500);
                if(audio.played){
                    setTimeout(function () {
                        document.getElementById('fold').setAttribute('class','playingAllow');
                    },1000);
                }else{
                    setTimeout(function () {
                        document.getElementById('fold').removeAttribute('class');
                    },1000);
                }
            }else{
                uiLayer.style.left = '-540px';
                isFold = true;
                if(audio.played){
                    setTimeout(function () {
                        document.getElementById('fold').setAttribute('class','playingAllow');
                    },500);
                }else{
                    setTimeout(function () {
                        document.getElementById('fold').removeAttribute('class');
                    },500);
                }
            }
        }
    };
    var switchList = function(){
        if(!isList){
            listLayer.style.display = 'block';
            uiLayer.style.height = '620px';
            setTimeout(function () {
                listLayer.style.opacity = '1';
            },1);
            isList = true;
        }else{
            listLayer.style.opacity = '0';
            uiLayer.style.height = '115px';
            setTimeout(function () {
                listLayer.style.display = 'none';
            },500);
            isList = false;
        }
    };
    var switchLyric = function () {
        if(!isLyric){
            document.getElementById('lyric').style.display = 'block';
            document.getElementById('lyricSwitch').setAttribute('class','enabled');
            isLyric = true;
        }else{
            document.getElementById('lyric').style.display = 'none';
            document.getElementById('lyricSwitch').setAttribute('class','disabled');
            isLyric = false;
        }
    };
    var switchPlay = function(){
        if(audio.paused){
            audio.play();
        }else{
            audio.pause();
        }
    };
    var switchMute = function(el){
        if(audio.volume == 0){
            el.setAttribute('class','normal');
            audio.volume = nowVolume;
        }else{
            el.setAttribute('class','mute');
            audio.volume = 0;
        }
    };
    var onMusicChange = function (index) {
        var infoTitle = document.getElementById('m-info').firstElementChild;
        var infoArtist = infoTitle.nextElementSibling;
        var infoTime = infoArtist.nextElementSibling;
        if(index == -1){
            document.getElementById('play-btn').setAttribute('class','play');
            audio.src = defaultInfo[2];
            listEl[currentIndex].removeAttribute('class');
            infoTitle.innerHTML  = defaultInfo[0];
            infoArtist.innerHTML = defaultInfo[1];
            infoTime.innerHTML = defaultInfo[2];
            currentIndex = 0;
        }else{
            if(currentIndex!=null){
                listEl[currentIndex].removeAttribute('class');
            }
            audio.src = songList[index].src;
            audio.play();
            listEl[index].setAttribute('class','playing');
            infoTitle.innerHTML  = songList[index].name;
            infoArtist.innerHTML = songList[index].artist;
            infoTime.innerHTML = songList[index].duration;
            currentIndex = index;
        }
    };

    audio.onplay = function () {
        document.getElementById('play-btn').setAttribute('class','pause');
    };
    audio.onpause = function () {
        document.getElementById('play-btn').setAttribute('class','play');
    };
    audio.onvolumechange = function () {
        var tmpBar = document.getElementById('vol-bar');
        var tmpDot = document.getElementById('vol-dot');
        tmpBar.style.width = tmpDot.style.left = this.volume*95 + '%';
    };
    audio.ontimeupdate = function () {
        var tmpBar = document.getElementById('play-bar');
        var tmpDot = document.getElementById('play-dot');
        tmpBar.style.width = tmpDot.style.left = audio.currentTime/audio.duration*100 + '%';
        if(audio.ended){
            switch(playMode){
                case 'dq':
                    onMusicChange(currentIndex);
                    break;
                case 'sj':
                    onMusicChange(Math.floor(Math.random()*listEl.length));
                    break;
                case 'lb':
                    if(currentIndex+1<listEl.length){
                        onMusicChange(currentIndex+1);
                    }else{
                        onMusicChange(0);
                    }
                    currentIndex = Number(currentIndex);
                    break;
                default :
                    if(currentIndex+1<listEl.length){
                        onMusicChange(currentIndex+1);
                    }else{
                        onMusicChange(-1);
                    }
                    currentIndex = Number(currentIndex);
                    audio.currentTime = 0;
            }
        }
    };
    audio.onseeked = function () {
        var tmpBar = document.getElementById('play-bar');
        var tmpDot = document.getElementById('play-dot');
        tmpBar.style.width = tmpDot.style.left = audio.currentTime/audio.duration*99 + '%';
    };
    volCtrlEl.onclick = function (e) {
        if(e.target.getAttribute('id')=='vol-dot'){return;}
        audio.volume = e.layerX / this.offsetWidth;
        nowVolume = audio.volume;
    };
    playCtrlEl.onclick = function (e) {
        if(e.target.getAttribute('id')=='play-dot'){return;}
        audio.currentTime = e.layerX / this.offsetWidth * audio.duration;
    };

    uiLayer.onclick = function (e) {
        e.stopPropagation();
        switch (e.target.getAttribute('id')){
            case 'fold':
                uiFold();
                break;
            case 'close-list':
                switchList();
                break;
            case 'listSwitch':
                switchList();
                break;
            case 'lyricSwitch':
                switchLyric();
                break;
            case  'lyric-close':
                switchLyric();
                break;
            case 'play-btn':
                switchPlay();
                break;
            case 'vol-btn':
                switchMute(e.target);
                break;
            default :
                return;
        }
    };


    for(var i=0;i<listEl.length;i++){
        listEl[i].onclick = function () {
            onMusicChange(Number(this.index));
        }
    }

    prevSongBtn.onclick = function () {
        currentIndex = Number(currentIndex);
        switch (playMode){
            case 'sj':
                onMusicChange(Math.floor(Math.random()*listEl.length));
                break;
            case 'lb':
                if(currentIndex-1>=0){
                    onMusicChange(currentIndex-1);
                }else{
                    onMusicChange(listEl.length-1);
                }
                currentIndex = Number(currentIndex);
                break;
            default :
                if(currentIndex-1>=0){
                    onMusicChange(currentIndex-1);
                }else{
                    onMusicChange(-1);
                }
        }
    };
    nextSongBtn.onclick = function () {
        currentIndex = Number(currentIndex);
        switch (playMode){
            case 'sj':
                onMusicChange(Math.floor(Math.random()*listEl.length));
                break;
            case 'lb':
                if(currentIndex+1<listEl.length){
                    onMusicChange(currentIndex+1);
                }else{
                    onMusicChange(0);
                }
                currentIndex = Number(currentIndex);
                break;
            default :
                if(currentIndex+1<listEl.length){
                    onMusicChange(currentIndex+1);
                }else{
                    onMusicChange(-1);
                }
        }
    };

    playModeBtn.onclick = function () {
        playModeList.style.display = 'block';
    };
    playModeList.onclick = function (e) {
        switch (e.target.getAttribute('mode')){
            case 'sx':
                playMode='sx';
                break;
            case 'sj':
                playMode='sj';
                break;
            case 'dq':
                playMode='dq';
                break;
            case 'lb':
                playMode='lb';
                break;
            default:
                return;
        }
        playModeBtn.setAttribute('class','way-'+playMode);
        playModeList.appendChild(e.target);
        playModeList.style.display = 'none';
    };
    setTimeout(uiFold,500);
};