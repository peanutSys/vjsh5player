$( function() {
	//获取url参数
	function getQueryString(key) {
	    var value = window.location.href.match(new RegExp("[?&#]" + key + "=([^&#]*)(&?)","i"));
	    return value ? decodeURIComponent(value[1]) : "";
	}

	/*毫秒数转时间*/
	function suitTime(dateNum,status,sign){
	//	sign = sign||'-';
		var entryDate = new Date(dateNum);
		var y = entryDate.getFullYear();
		var M = entryDate.getMonth()+1;
		var d = entryDate.getDate();
		var h = entryDate.getHours();
		var m = entryDate.getMinutes();
		var s = entryDate.getSeconds();
		if(status=='yMd'){
			return y+sign+toDouble(M)+sign+toDouble(d);
		}else if(status=='hms'){
			return toDouble(h)+':'+toDouble(m)+':'+toDouble(s);
		}else if(status=='hm'){
			return toDouble(h)+':'+toDouble(m);
		}else{
			return y+sign+toDouble(M)+sign+toDouble(d)+' '+toDouble(h)+':'+toDouble(m)+':'+toDouble(s);
		}
	}
	/*一个数转两位*/
	function toDouble(i){
		return i=i<10?'0'+i:i;
	}

	/*获取大数据token*/
	function gettoken( cb) {
		var UID = getUID();//设备唯一标识
		$.ajax({
			type:"post",
			url:"http://algo.cztv.com/api/authorizations",
			data:{
				customer_id:12,
				product_id:1,
				extra:{
					device_platform:3
				},
				device_id:UID
			},
			headers:{'Referrer':"no-referrer|no-referrer-when-downgrade"},
			success:function(data){
				cb && cb( data.access_token || '')
			}
		});
	}

	/*上传大数据行为*/
	function upinfo(code,action_start) {
		if(code!=7){//如果是报告，那么不运算了
			if(GID!=''){
				GFATHERID = GID;
				sessionStorage.setItem('GFATHERID',GFATHERID)
			}else{
				GFATHERID = GORIGINID;
				sessionStorage.setItem('GFATHERID',GFATHERID)
			}
			GID = uuid(16);
			if(GORIGINID==''){
				GORIGINID = GID;
				sessionStorage.setItem('GORIGINID',GORIGINID)
			}
		}

	    var token = TOKEN;
	    var device_os = getOsInfo().version;
	    var browser_ua = navigator.userAgent;
	    var f_data = {
				g_id:GID,//当前操作
				g_origin_id:GORIGINID,//第一次操作
				product_id:1,
				item_type:1,
				origin_item_id:_id,//媒资id
				action_type:code,//操作类型
				action_time:time(new Date()),
				action_start:parseInt(action_start),
				extra:{
					browser_ua:browser_ua,
					device_os:device_os
				},
			}
	    if(GFATHERID&&code!=7){
	    	f_data.g_father_id = GFATHERID;//前一次操作
	    }
	    if(code==7){
	    	f_data.step = 30;
	    }
	    $.ajax({
			type:"post",
			url:"http://algo.cztv.com/api/algo/pushAction",
			async:true,
			beforeSend: function(xhr) { 
		       	xhr.setRequestHeader("Authorization", "Bearer "+token);  
		   	},
			data:f_data,
			success:function(data){
				console.log(data)
			}
		});
	}

	var _id = getQueryString("cid");
	if(_id == undefined || _id==""){
	    _id =101;
	}

	$.ajax({
		type:"get",
		url:"http://p.cztv.com/api/paas/channel/tv",
		async:true,
		success:function(data){
			var res = data.content.list
			var str = '';
			for(var i=0;i<res.length;i++){
				if( res[i].station_code==_id){
					str+= 	'<li class="selected" data-cid="'+res[i].station_code+'">'
				}else{
					str+= 	'<li data-cid="'+res[i].station_code+'">'
				}
				
				str+=		'<img src="'+res[i].logo+'" alt="'+res[i].name+'">'
				str+=		res[i].name
				str+=	'</li>';
			}
			$('.tvListUl').html(str);
			
		},
		error:function(error){
			console.log(error)
		}
	});

	$(document).on('click','.tvListUl li',function(){
		if($(this).attr('data-cid')==_id){
			return
		}
		window.location.href = window.location.origin+window.location.pathname+'?cid='+$(this).attr('data-cid');
	})

	//大数据开始
	var GID = '';//当前操作
	var GORIGINID = sessionStorage.getItem('GORIGINID') || '';
	var GFATHERID = sessionStorage.getItem('GFATHERID') || '';
	var TOKEN = ''; //大数据token
	gettoken( function( tok){ TOKEN = tok;console.log( TOKEN) })
	var bgflag = true;//报告flag
	var TIME = 0;//开始报告的时间
	upinfo(1,0)

	//时间切换
	var date = new Date();
	var newYear = date.getFullYear();
	var newMon = date.getMonth();
	var newDate = date.getDate();
	var strDate = Date.parse(date);
	var timeChange = 7;
	var useDateType = suitTime(date,'yMd','-');
	var apiToday = suitTime(date,'yMd','');

	getVideoList(apiToday);
	$('#videoOutherBox .showDay').html(useDateType);

	$("#boxscroll").niceScroll({cursorborder:"",cursorcolor:"#b5b5b6"});//滚动条样式

	var dateOperation =false;//目前播放显示的日期，如果是直播就变成false
	var sortNumOperation =false;//点击回看后，记录点击的是第几个

	var initplayer = function( islive,replay_band){
		removeAllPlayer()
		var fj = function(){
		    FingerprintJS.load().then(fp => {
			    fp.get().then(result => {
			        const visitorId = result.visitorId
			        operator( visitorId)
			    })
		    })
		},
		operator = ( fjId_)=>{
			let videoplayer = '',
			origin_videoname = '.row #live_video',
			resoluta_options = [ 
			    {name:'标清',url:"http://yd-vl.cztv.com/channels/lantian/channel0"+_id.toString().substr(1)+"/360p.m3u8" +replay_band,type:'application/x-mpegURL',live:islive},
			    {name:'高清',url:"http://yd-vl.cztv.com/channels/lantian/channel0"+_id.toString().substr(1)+"/540p.m3u8" +replay_band,type:'application/x-mpegURL',live:islive}, 
			    {name:'超清',url:"http://yd-vl.cztv.com/channels/lantian/channel0"+_id.toString().substr(1)+"/720p.m3u8" +replay_band,type:'application/x-mpegURL',live:islive},
			    ] ,
			defaul_sele = 2 //根据清晰度选择默认
			resoluta_options.forEach( (item ,i)=>{
				let cloneVideo = $( origin_videoname).clone() 
				cloneVideo.attr('id','live_video'+i)
				$('.prism-player').append( cloneVideo)
			}) 
			cb_player = function( player_){
				// player_.off('loadstart')
				// player_.off('canplaythrough')
				// player_.off('play')
				// player_.off('pause')
				// player_.off('ended')

				player_.on("loadstart",function(){
			        // console.log("开始请求数据 ");
			        upinfo(10,player_.currentTime())
			    })
			    player_.on("canplaythrough",function(){
					// console.log("视频源数据加载完成")
					upinfo(11,player_.currentTime())
			    })
				player_.on("play", function(){
					// console.log("视频开始播放")
					upinfo(8,player_.currentTime())
			    })
			    player_.on("pause", function(){
			        // console.log("视频暂停播放")
			        upinfo(12,player_.currentTime())
			    })
			    player_.on("ended", function(){
			        // console.log("视频播放结束");
			        upinfo(13,player_.currentTime())
			    })
			}
			play_default( fjId_,resoluta_options,defaul_sele,defaul_sele,'live_video')
		}
		fj()
	}

	//节目单列表
	function getVideoList(apiDay,flag){
		var liveFlag = true;
		var getVideoListApi = 'https://p.cztv.com/api/paas/program/'+_id+'/'+apiDay;
		$.ajax({
			type:"get",
			url:getVideoListApi,
			async:true,
			data:{},
			success:function(data){
				if(data.message=='success'){
					if(data.content.list[0].station_type!=1){
						return;
					}
					var res = data.content.list[0].list;
	//						console.log(res)
					var resourcesListUlStr = '';//dom字符串
					var endTime = 0;//此节目截止时间
					var statusTxt = '';//节目按钮显示文字
					var statusClass = '';//节目LI带的class
					var clickClass = '';//节目按钮带的class
					var dateString = new Date().getTime();
					for(var i=0;i<res.length;i++){
						endTime = parseInt(res[i].play_time) + parseInt(res[i].duration);
						if(endTime < dateString){//回看
							/*
								class的意思：
								点击：
								replay:点击回看
								commingPlay:预告点击
								play:可以点击的直播
								noReplay:禁止点击播放
								样式:
								lookBack:蓝色样式按钮，回看或者直播
								preview:灰色样式按钮，预告或者禁止播放
								livePlayNow:金色样式按钮，正在播放
							*/
							
							if(res[i].program_replay==0){//禁止回看
								statusTxt = '回看';
								statusClass = 'preview';
								clickClass = 'noReplay';
							}else{
								if($('.showDay').html()==dateOperation&&i==sortNumOperation){//正在播的回看
									statusTxt = '回看';
									statusClass = 'lookBack livePlayNow';
									clickClass = 'replay';
								}else{//没在播的回看
									statusTxt = '回看';
									statusClass = 'lookBack';
									clickClass = 'replay';
								}
							}
						}else if(parseInt(res[i].play_time)>dateString){//预告
							statusTxt = '预告';
							statusClass = 'preview';
							clickClass = 'commingPlay';
						}else{//直播
							if( dateOperation){//没在直播状态
								statusTxt = '直播';
								statusClass = 'lookBack playing';
								if(res[i].program_status==0){
									liveFlag = false;
									clickClass = 'noLive';
								}else{
									clickClass = 'play';
								}
							}else{//正在直播
								if(res[i].program_status==0){
									liveFlag = false;
									statusTxt = '直播';
									statusClass = 'livePlayNow lookBack playing preview';
									clickClass = 'noLive';
								}else{								
									statusTxt = '直播';
									statusClass = 'livePlayNow lookBack playing';
									clickClass = 'play';
								}
							}
						}
						resourcesListUlStr+='<li timeString ="'+res[i].play_time+'" class="resourcesListLi clear '+statusClass+'">'+
												'<div class="time">'+suitTime(parseInt(res[i].play_time),'hm','-')+'</div>'+
												'<div class="title" title="'+res[i].program_title+'">'+res[i].program_title+'</div>'+
												'<div startTime="'+res[i].play_time+'" endTime="'+endTime+'" program_id="'+res[i].program_id+'" class="status '+clickClass+'">'+statusTxt+'</div>'+
											'</li>';
					}
					$('.resourcesListUl').html(resourcesListUlStr);
					//滚动条位置
					try{
						var topVal = $('.livePlayNow').position().top-245;
						if(topVal>=278){
							$('#boxscroll').animate({'scrollTop':topVal},500);
						}
					}catch(e){
						//TODO handle the exception
					}
					
					if(!flag){
						// initplayer(true,s_data);
					}
				}else{
					alert(data.alertMessage);
				}
				//页面刷新，直接播放直播
				$(document).find('.play').trigger('click')
			},
			error:function(error){
				console.log(error);
			}
		});

	}

	//上一天
	$('.lastDay').on('click',function(){
		if(!$(this).hasClass('lastDayDark')){
			timeChange--;
			var showDate = new Date(newYear,newMon,newDate-7+timeChange);
			$('#videoOutherBox .showDay').html(suitTime(showDate,'yMd','-'));
			if(timeChange<1){
				$(this).addClass('lastDayDark');
			}
			if(timeChange<=6){
				$('.nextDay').removeClass('nextDayDark');
			}
			var apiDay = suitTime(showDate,'yMd','');
			getVideoList(apiDay,true);
		}
	})

	//下一天
	$('.nextDay').on('click',function(){
		if(!$(this).hasClass('nextDayDark')){
			timeChange++;
			var showDate = new Date(newYear,newMon,newDate-7+timeChange);
			$('#videoOutherBox .showDay').html(suitTime(showDate,'yMd','-'));
			if(timeChange>6){
				$(this).addClass('nextDayDark');
			}
			if(timeChange>=1){
				$('.lastDay').removeClass('lastDayDark');
			}
			var apiDay = suitTime(showDate,'yMd','');
			getVideoList(apiDay,true);
		}
	})

	//回看
	$(document).on('click','.replay',function(){
		console.log('点播点击')
		// if($(this).parents('.resourcesListLi').hasClass('livePlayNow')){
		// 	return
		// }
		
		dateOperation = $('.showDay').html();
		sortNumOperation = $(this).parents('.resourcesListLi').index();
		$(this).html('回看');
		$(this).parents('.resourcesListLi').addClass('livePlayNow');
		$(this).parents('.resourcesListLi').siblings().removeClass('livePlayNow');
		$(this).parents('.resourcesListLi').siblings('.lookBack').find('.status').html('回看');
		$('.playing').find('.status').html('直播');
		
		var bland_time = '/'+$(this).attr('starttime')+','+$(this).attr('endtime');
		
		initplayer(false,bland_time)			
	})

	//直播
	$(document).on('click','.play',function(){
		console.log('直播点击')
		// if($(this).parents('.resourcesListLi').hasClass('livePlayNow')){
		// 	return
		// }
		
		dateOperation = false;
		$(this).html('直播');
		$(this).parents('.resourcesListLi').addClass('livePlayNow');
		$(this).parents('.resourcesListLi').siblings().removeClass('livePlayNow');
		$(this).parents('.resourcesListLi').siblings('.lookBack').find('.status').html('回看');
		
		initplayer( true,'');
		
	})

	//预告
	$(document).on('click','.commingPlay',function(){
		alert('节目尚未开始，敬请期待！');
		return;
	})

	//禁止回看
	$(document).on('click','.noReplay',function(){
		alert('该节目禁止播放！');
		return;
	})

	//禁止直播
	$(document).on('click','.noLive',function(){
		alert('禁止直播');
		return;
	})

	//如果时间到了刷新列表显示播放下一条
	setInterval(function(){
		if(useDateType==$('.showDay').html()){
			var dateNowString = new Date().getTime();
			if(parseInt($('.preview').eq(0).attr('timestring'))<=parseInt(dateNowString)&&!$('.preview').eq(0).find('.status').hasClass('noLive')){
				if($('.play').parents('.resourcesListLi').hasClass('livePlayNow')){
	//						$('.resourcesListUl').html(' ')
					var apiToday = suitTime(date,'yMd','');
					getVideoList(apiToday,true);
				}else{
					$('.play').html('回放')
					$('.play').parents('.resourcesListLi').removeClass('playing')
					$('.play').removeClass('play')
					
					$('.preview').eq(0).find('.commingPlay').html('直播').removeClass('commingPlay').addClass('play')
					$('.preview').eq(0).addClass('lookBack playing').removeClass('preview')
				}
			}
		}
	},1000*60)

})