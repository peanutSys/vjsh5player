<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>播放器</title>

		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/jquery_1_10_2.js"></script>
		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/jquery.md5.js"></script>

		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/video.js"></script>
		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/resolutation.js"></script>
		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/fingerprint.min.js"></script>
		<script src="http://o.cztvcloud.com/186/8455780/js/jquery.nicescroll.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/DSJ.js" type="text/javascript"></script>
		<script src="http://o.cztvcloud.com/278/8743827/images/static/js/operationLogic.js"></script>

		<link rel="stylesheet" href="http://o.cztvcloud.com/278/8743827/images/static/css/video-js.css">
		<link rel="stylesheet" href="http://o.cztvcloud.com/278/8743827/images/static/css/reso.css">
		<link rel="stylesheet" href="http://o.cztvcloud.com/278/8743827/images/static/css/operLogic.css">

		<style type="text/css">			
			.row .video{
				width: 100%;
				height: 100%;
				display: none;
			}
			.row .video-url-input{
				width: 340px;
				height: 20px;
				margin-top: 20px;
			}
			.row .play{
				display: inline-block;
				padding: 5px 10px;
				color: white;
				margin-top: 20px;
				border-radius: 5px;
				cursor: pointer;
			}
			.row .play:active{
				opacity: 0.7;
			}

			/*videojs*/
			.video-js .vjs-current-time,
			.vjs-no-flex .vjs-current-time {
			    display: block;
			}
			.vjs-time-divider {
			    display: block;
			}
			.video-js .vjs-duration,
			.vjs-no-flex .vjs-duration {
			  display: block;
			}
		</style>
	</head>
	<body style="margin: 0">
		<div class="row">
			
			<div id="videoOutherBox">
				<div class="note" style="display: none;">暂不支持当前节目直播</div>
				<div class="prism-player" id="player-con">
					<video id="live_video" class="video video-js vjs-default-skin vjs-big-play-centered" ></video>
				</div>
				<div class="columnBox">
					<div class="chooseDataBox clear">
						<div class="lastDay"></div>
						<div class="showDay"></div>
						<div class="nextDay nextDayDark"></div>
					</div>
					<div class="resourcesList clear">
						<ul class="tvListUl"></ul>
						<ul class="resourcesListUl" id="boxscroll"></ul>
					</div>
				</div>
			</div>

		</div>
		<script type="text/javascript">
			// {literal}
			// var fj = function(){
			//     FingerprintJS.load().then(fp => {
			// 	    fp.get().then(result => {
			// 	        const visitorId = result.visitorId
			// 	        operator( visitorId)
			// 	    })
			//     })
			// },
			// operator = ( fjId_)=>{
			// 	let videoplayer = '',
			// 	origin_videoname = '.row #live_video',
			// 	resoluta_options = [ 
			// 	    {name:'标清',url:'http://yd-vl.cztv.com/channels/lantian/channel006/360p.m3u8',type:'application/x-mpegURL',live:true},
			// 	    {name:'高清',url:'http://yd-vl.cztv.com/channels/lantian/channel006/540p.m3u8',type:'application/x-mpegURL',live:true}, 
			// 	    {name:'超清',url:'http://yd-vl.cztv.com/channels/lantian/channel006/720p.m3u8',type:'application/x-mpegURL',live:true},
			// 	    ] ,
			// 	defaul_sele = 2 //根据清晰度选择默认
			// 	resoluta_options.forEach( (item ,i)=>{
			// 		let cloneVideo = $( origin_videoname).clone() 
			// 		cloneVideo.attr('id','live_video'+i)
			// 		$('.prism-player').append( cloneVideo)
			// 	}) 
			// 	play_default( fjId_,resoluta_options,defaul_sele,defaul_sele)
			// }
			// fj()
			// removeAllPlayer() //注销所有播放器
		// {/literal}
		</script>
	</body>
</html>