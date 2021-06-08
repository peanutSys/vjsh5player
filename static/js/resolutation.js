var cb_player, //返回当前播放器，用于事件监听
playerArray = [], //播放器数组
playeridPrefix = '' //播放器类名id前缀
fjId_default = '', //手指id
previousInex = '', //上一个播放的播放器索引
playerRate = 1, //视频播放率
playerVolume = -1, //视频播放音量
escpress = false, //esc按钮点击
c_e = function( resoContent ,defaulti){
	var se = ''
	resoContent.forEach( function( item,i){
		se +=  '<div class="tip-operator '+i+'"'+'>'+item.name +'</div>'
	})
	return '<div class="tip-msg">'+
	       resoContent[defaulti].name+
	       '<span class="tip-msgtext">' + 
	       se +
	       '</span></div>'
},
videojs_createButton = function( player, values,defaulti) {
	// player 播放器 values清晰度 defaulti默认播放哪一个清晰度
	var resolutionBtn = player.controlBar.addChild('button',{},player.controlBar.children_.length-2),
	fullBtn = player.controlBar.addChild('button',{},player.controlBar.children_.length)
	resolutionBtn.addClass('vjs-reso')
	fullBtn.addClass('vjs-fullscreen-custom')
	$(resolutionBtn.el_).html( c_e( values ,defaulti))
	{
		//清晰度点击
		var resolu_option = '.vjs-reso .tip-msg .tip-msgtext .tip-operator',
		resolu_perform = '.vjs-reso .tip-msg'
		click_resolu = function( i){
			//添加阴影
			// $(resolu_option).removeClass('sesbgc')
			// $(resolu_option).eq(i).addClass('sesbgc')
			
			//设置播放栏‘清晰度’文字
			for (var i = 0; i < values.length; i++) {
				$(resolu_perform).eq(i).prop("firstChild") ? 
				$(resolu_perform).eq(i).prop("firstChild").nodeValue = values[defaulti].name : 
				null
			}
		}
		
		$(resolu_option).off('click').on('click',function(){
			var selecInd = this.className.split(' ')[1]
			play_default( fjId_default,values,selecInd)		
		})
		click_resolu(defaulti )
	}
	{
		//全屏点击
		var fsreenBtnCname = '.vjs-control.vjs-button.vjs-fullscreen-custom',
		isFull = false, 

		videoNode = $('.video'),
		parentFirst = videoNode.parent(),
		parentSencond = parentFirst.parent(),
		pf_margin = parentFirst.css('margin'),
		ps_margin = parentSencond.css('margin'),

		controlfs_custom = function( type){
			type == 1 ? $(fsreenBtnCname).text('放大') : $(fsreenBtnCname).text('缩小')
		}
		
		videoHeight = videoNode.height() //原始宽度
		videowidth = videoNode.width()
		controlfs_custom(1)
		$(fsreenBtnCname).off('click').on('click',function( event,param1){
			if ( isFull || param1 == 'escExit') {
				param1 == 'escExit' ? null : document.exitFullscreen()
				controlfs_custom(1)
				isFull = false
				videoNode.css({
					'width':videowidth+'px',
					'height':videoHeight+'px'
				})
				parentFirst.css({ margin : pf_margin })
				parentSencond.css({ margin : ps_margin })
			}else{
				isFull = true
				escpress = false
				videoNode[0].requestFullscreen()
				controlfs_custom(2)
				setTimeout(function() {
					videoNode.css({
						'width':$(window).width(),
						'height':$(window).height()
					})
					videoNode.children('video').css({
						'width':'100%',
						'height':'100%'
					})
					console.log( $(window).width() + '和' +$(window).height() )
					parentFirst.css({ margin : '0' })
					parentSencond.css({ margin : '0' })
				}, 300)
			}
		})
	}	
},
create_player = function( resolutations,index){
	for (var i = 0; i < resolutations.length ; i++) {
		var eurl = encryption_url(),
		urlObject = resolutations[i],
	    play_url = urlObject.url+'?'+eurl.partUrl,
	    ob_url = { src:play_url,type: resolutations[i].type }

		var newPlayer = videojs( playeridPrefix+i,{
		    fingerpId:eurl.fjId,
		    sourceid:eurl.sourceid,	
		    selfKey:eurl.selfKey,
		    controls: true,
		    preload: 'auto',
		    language: 'zh-CN',
		    poster: "https://fakeimg.pl/350x200/aaa/fff/?text=waiting&font=lobster",
		    controlBar: { 
			    children: [
			   		// {name: 'button'}, 
					{name: 'playToggle'}, // 播放/暂停按钮
					{name: urlObject.live ? 'liveDisplay' : ''}, //直播展示
					{name: !urlObject.live ? 'progressControl' : ''}, // 播放进度条
					{name: !urlObject.live ? 'currentTimeDisplay' : ''}, // 视频当前已播放时间
					{name: !urlObject.live ? 'timeDivider' : ''}, // 分割线
					{name: !urlObject.live ? 'durationDisplay' : ''}, // 视频播放总时间
					{ 	// 倍数播放，可以自己设置
						name: 'playbackRateMenuButton',
						'playbackRates': [0.5, 1, 1.5, 2]
					},
					{
						name: 'volumePanel', // 音量控制
						inline: false // 不使用水平方式
					},
					// {name: 'FullscreenToggle'} // 全屏
				]
			}
		},function () {
			videojs_createButton( this,resolutations,index)
			this.src( this.ob_url)
		})
		newPlayer.ob_url = ob_url
		playerArray.push( newPlayer)
	}
},
get_video = function( resolutations,index){
	var hiddenOtherPlayer = function( index){
		resolutations.forEach( function(item,i){
			playerArray[i] ? playerArray[i].pause() : null
			$('#'+playeridPrefix+i).css('display','none') //隐藏播放器
		})
		$('#'+playeridPrefix+index).css('display','block') //显示播放器
	},
	setResolu = function( resolu_text){
		//设置播放栏‘清晰度’文字
		var resolu_perform = '.vjs-reso .tip-msg'
		for (var i = 0; i < resolutations.length; i++) {
			$(resolu_perform).eq(i).prop("firstChild").nodeValue = resolu_text
		}
	},
	player_prepare = function(){
		//切换不同分辨率
		var currentPlayer = playerArray[ index]	
		cb_player && (typeof cb_player == "function") && cb_player( currentPlayer)
	    if ( previousInex == index) {
	    	//上一个播放器就是当前播放器
	    	hiddenOtherPlayer( index)
	    }else{
	    	//上一个播放器
	    	var previousPlayer = playerArray[ previousInex], 
	    	previousPlayerCT = previousPlayer.currentTime(),
	    	cutOver = false,
	    	circulCount = 0,
	    	circulSet = function(){
	    		setTimeout(function() {
	    			// console.log( '循环次数'+circulCount)
		    		if ( !cutOver) {
		    			currentPlayer.currentTime( previousPlayerCT)
		    		}else{
		    			circulCount++ //只循环20次，40秒
		    			if ( circulCount <20) {
		    				circulSet()
		    			}
		    		}
		    	}, 2000)
	    	}
	    	previousInex = index

	    	//当前播放器
	    	setResolu( '切换中')
	    	currentPlayer.currentTime( previousPlayerCT)
	    	currentPlayer.playbackRate( playerRate)
	    	playerVolume < 0 ? null: currentPlayer.volume(playerVolume)
	    	circulSet()
	    	currentPlayer.off('seeked')
	        currentPlayer.on('seeked',function () {
	        	if ( !cutOver) {
	        		cutOver = true
	        		// console.log('seeked---时间更新----',previousInex)
		          	hiddenOtherPlayer( index)
		          	currentPlayer.play()
		          	setResolu( resolutations[previousInex].name)
	        	}
	        })
	    } 
	    currentPlayer.play() 
	}

	//创建多个分辨率播放器
	if ( playerArray.length != resolutations.length) {
		//创建播放器
		create_player(resolutations,index) 

		playerArray.forEach( ( pr_)=>{
			//播放率监听
			pr_.on("ratechange",function(){
		        playerRate = this.playbackRate()
		    })
		    //音量监听
		    pr_.on("volumechange",function(){
		        playerVolume = this.volume()
		    })
		})

		//全屏退出
		var fsreenBtnCname = '.vjs-control.vjs-button.vjs-fullscreen-custom',
		exit_fs = function () {
		    var isFull = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		    if (isFull == undefined)  isFull = false
		    return isFull
		},
		resizefunc = function () {
		    if ( !exit_fs() && !escpress) {
		    	escpress = true
		        $(fsreenBtnCname).trigger("click",['escExit'])
		    }
		}
		window.removeEventListener('resize',resizefunc)
		window.addEventListener("resize", resizefunc)
		// let countLoaded = 0 //计数构建完的播放器
		// playerArray.forEach( ( player)=>{
		// 	player.off("loadedmetadata")
		// 	player.on("loadedmetadata",function(){
		//         countLoaded++
		//         if ( countLoaded ==resolutations.length) {
		//         	//全部播放器加载完成
		//         	player_prepare()
		//         }
		//     })
		// })
		
	}
	player_prepare()
},
encryption_url = function(){
	var fjId = $.MD5( fjId_default+(new Date()).getTime()),
	timestamp_10 = Math.floor( ( (new Date()).getTime())/1000 ) +'', 
    timestamp_md5_5 = $.MD5( timestamp_10.slice(5)), 
    sourceid = 1014, //县融id
    selfKey = '7ea5d67d5d703d7d5b981a26eaaa5e3e',
    k_secret = $.MD5( timestamp_10+fjId+selfKey+timestamp_md5_5)
    return {
    	partUrl : 'a='+sourceid+'&d='+fjId+'&k='+k_secret+'&t='+timestamp_10,
    	sourceid:sourceid,
    	selfKey:selfKey,
    	fjId: fjId
    }
},
play_default = function( fjId_,resolutations,default_index,first_index,classid){
    fjId_default = fjId_
    classid ? playeridPrefix =classid : null
    !first_index && first_index !=0 ? null : previousInex = first_index
    get_video( resolutations,default_index)
},
removeAllPlayer = function(){
	playerArray.forEach( function(player){
		player.dispose()
	})
	playerArray = []
}




