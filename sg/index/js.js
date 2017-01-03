//QQ339788838
$(document).ready(function(e) {
	
var windowWidth = $(window).width();
var allSceneWidth = 2100;  //画卷整体长度
var iit = 4;
var start = 0;
var heroMiddleX =  Math.floor(($("#patternConBox").width()/2-95)/iit)*iit;     //英雄中心点
var sceneMiddleX = 0; //初始近景位置
var heroMax = $("#patternConBox").width();
var usableX = Math.floor((allSceneWidth -$("#patternConBox").width())/iit) * iit;  //近景最大X范围
var mouseX =false;
var scene_back = $("#scene_back");  //远景节点
var scene_middle = $("#scene_middle");  //近景节点
var scene_front = $("#scene_front");  //前景节点
var alertbox = $("#alertBox");
var alertboxClose = $("#alert .a0");

function n(v){return Math.floor((Math.floor(Math.random()*10)%(v+1)))}

//类---
//--英雄类 hero  id节点
	function hero(x,y,id,name){
		//属性
		this.y = y;	
		this.x = x;	
		this.name = name;
		this.box = $(id);
		this.box.css({"left":+x+"px"});
		this.speakbox = this.box.children(".speak");
		this.wahtspeak = this.box.find(".msg");

		this.scene_m_x = 0;;
		this.scene_f_x = 0;
		this.scene_b_x = 0;
		var _self = this;
		//初始化
		this.interval = false;
		this.moveinterval = false;
		this.timeout = false;
		this.box.css({"top":+this.y+"px","left":+this.x+"px"});
		//状态动作 0右静止  1左静止 2右 3左 ,speet:静止150 移动90
		this.action = function(direction,speed)
		{
			var boxbg_x = 0;
			var boxbg_y = 222;
			var i = 0;
			var direction = -direction*boxbg_y
			clearInterval(_self.interval);
			_self.interval = setInterval(function(){
				i++;
				i = i%8;
				boxbg_x = -(300*i+53);
				_self.box.css({"background-position":+boxbg_x+"px "+direction+"px"});
			},speed);
		}
		//移动 0左 1右 *每移动100个像素用时800毫秒 ,x需要移动的距离。direction，左/右移动方向 ，一个跑动动作合理移动距离100px
		this.move = function(x)
		{
			var direction = iit;
			var direction_m = -iit;
			var direction_f = -(iit+1);
			var direction_b = -(iit-1.7);
			var actMove;
			var actStand;
			var direction;
			var newX = Math.floor( (x + _self.x + (-_self.scene_m_x))/iit) * iit;
			if(x<0)
			{
				actMove = 3;
				actStand = 1;
				direction = -direction;
				direction_m = -direction_m;
				direction_f = -direction_f;
				direction_b = -direction_b;
			}else if(x>0)
			{
				actMove = 2;
				actStand = 0;
			};
			
			_self.action(actMove,70);
			clearInterval(_self.moveinterval);
			_self.moveinterval = setInterval(function(){
				//判断英雄位置
				if(x > 0 && _self.x >= heroMax-280)
				{
					clearInterval(_self.moveinterval);
					_self.action(actStand,150);
					alertbox.stop().fadeIn(20).click(function(){return false});
					alertbox.find(".a1").click(function(){window.open("http://www.baidu.com")});
					alertbox.find(".a2").click(function(){window.location = "http://zqsg.zygames.com/main.html"});
					alertbox.find(".a3").click(function(){window.open("https://passport.zygames.com/Register")});
					alertboxClose.click(function(){alertbox.stop().fadeOut(20); return false;})
				}else if((_self.x+(-_self.scene_m_x)) == newX)
				{
					clearInterval(_self.moveinterval);
					_self.action(actStand,150);
					
	
				}else if(_self.x == heroMiddleX)  //else if(_self.x == heroMiddleX && _self.scene_m_x >= (-usableX) && _self.scene_m_x <= 0)
				{
					scene_middle.css({"left":+(_self.scene_m_x)+"px"});
					scene_back.css({"left":+(_self.scene_b_x)+"px"});
					scene_front.css({"left":+(_self.scene_f_x)+"px"});
					_self.scene_m_x+=direction_m;
					_self.scene_b_x+=direction_b;
					_self.scene_f_x+=direction_f;
					if(_self.scene_m_x==(-usableX) ||_self.scene_m_x==0)
					{
					 _self.x+=direction;	
					}					
				}else if(_self.x < heroMiddleX) 
				{
					_self.box.css({"left":+(_self.x)+"px"});
					_self.box
					_self.x+=direction;
				}else if(_self.x > heroMiddleX)
				{
					_self.box.css({"left":+(_self.x)+"px"});
					_self.x+=direction;
				}
			},16)
		}
		
		this.speakTime = false;
		this.speakInterval = false;
		this.speak = function()
		{
			_self.speakWaht();
			_self.speakInTime();
			_self.speakbox.click(function(){
				_self.speakOver();
				_self.speakInTime();
				return false;
			});
			_self.box.click(function(){
				clearInterval(_self.speakInterval);
				_self.speakWaht();
				_self.speakInTime();
				return false;
			});
			
		}
		this.speakInTime = function(){
			clearInterval(_self.speakInterval);
			_self.speakInterval = setInterval(function(){
				_self.speakWaht();
				play_n = 0;
			},13000);
		}
		this.speakWaht = function()
		{
			_self.wahtspeak.css({"background-position":"0 "+(-n(10)*70)+"px"});
			_self.speakbox.fadeIn();
			clearTimeout(_self.speakTime);
			_self.speakTime = setTimeout(function(){_self.speakbox.fadeOut()},5000);
		}
		this.speakOver = function()
		{
			_self.speakbox.fadeOut()
		}
	}
//--云类 hero  x，y，style样式，id， style：1，2
	function cloud(id,style,x,y,speed)
	{
		this.x = x;
		this.y = y;
		this.style = style;	
		this.id = id;
		this.speed = speed;
		//初始化
		var _self = this;
		$("<div id='cloud_"+this.id+"' style='left:"+_self.x+"px;top:"+_self.y+"px' class='cloud cloud_"+style+"'></div>").appendTo(scene_middle);
		this.box = $("#cloud_"+this.id);
	
		this.move = function()
		{
			setInterval(function(){
				_self.x = _self.x%allSceneWidth;
				_self.box.css({"left":+(allSceneWidth-_self.x-302)+"px"});
				_self.x += speed;
			},50)	
		}
		this.move();
	}


//加载---
	
	
	startbcak()
	function startbcak(){
		if(start==0)
		{
			$("#loadingBack").animate({"left":+(-(allSceneWidth-$("#patternConBox").width()))+"px"},20000,'linear',function(){$(this).animate({"left":"0px"},20000,'linear',function(){startbcak()})});
		}
	}
	
	var loadnum = 0;           //进度加载数值
	
	
	
	//loading
	/*
	var loadingLine = $("#loadingLine");
	var i=0;
	var x=0;
	var loadingInterval =setInterval(function(){
				i++;
				i = i%8;
				x = -180*i;
				loadingLine.css({"background-position":+x+"px 0"})},100);
	*/
	//ys0 --loadingbg
	var ys0 = new Image();
	ys0.onload = function(){
		$("#loadingBack").css({"background-image":"url("+this.src+")"});
		$("#patternConBox").css({"background-color":"#b6e9e2"});
				$(".btn1").css({"-webkit-animation-name":"round1","-moz-animation-name":"round1"});
		$(".btn2").css({"-webkit-animation-name":"round2","-moz-animation-name":"round2"});
		$(".btn3").css({"-webkit-animation-name":"round3","-moz-animation-name":"round3"});
		$(".btn4").css({"-webkit-animation-name":"round4","-moz-animation-name":"round4"});
		//logo
		var ys1 = new Image();
		ys1.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#logo").css({"background-image":"url("+this.src+")"}).fadeIn(600,function(){$(this).animate({"margin-left":"-450px","margin-top":"-240px"},300)});

				
			};
		ys1.src="http://cdn1.zygames.com/mocool/zqsg/index/logo.png";
		//slogan
		var ys2 = new Image();
		
		ys2.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#slogan").css({"background-image":"url("+this.src+")"}).fadeIn(1200);	
		};
		ys2.src="http://cdn1.zygames.com/mocool/zqsg/index/slogan.png";
		//hero
		var ys7 = new Image();
		ys7.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#hero").css({"background-image":"url("+this.src+")"});
		};
		ys7.src="http://cdn1.zygames.com/mocool/zqsg/index/hero3.png";
		//前景
		var ys3 = new Image();
		
		ys3.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#scene_front").css({"background-image":"url("+this.src+")"});
		};
		ys3.src="http://cdn1.zygames.com/mocool/zqsg/index/sceneBg_1.png";
		//近景
		var ys4 = new Image();
		ys4.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#scene_middle").css({"background-image":"url("+this.src+")"});
		};
		ys4.src="http://cdn1.zygames.com/mocool/zqsg/index/sceneBg_2.png";
		//远景
		var ys5 = new Image();
		ys5.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#scene_back").css({"background-image":"url("+this.src+")"});
		};
		ys5.src="http://cdn1.zygames.com/mocool/zqsg/index/sceneBg_3.jpg";
		//云
		var ys6 = new Image();
		ys6.onload = function(){
			loadnum++;
			loading(loadnum);
		};
		ys6.src="http://cdn1.zygames.com/mocool/zqsg/index/sceneBg_cloud.png";
		//门
		var ys9 = new Image();
		ys9.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#door2").css({"background-image":"url("+this.src+")"});
		};
		ys9.src="http://cdn1.zygames.com/mocool/zqsg/index/door2.png";
		//门光
		var ys8 = new Image();
		ys8.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#door").css({"background-image":"url("+this.src+")"});
		};
		ys8.src="http://cdn1.zygames.com/mocool/zqsg/index/door.png";
		//对话框
		var ys10 = new Image();
		ys10.onload = function(){
			loadnum++;
			loading(loadnum);
			$("#alert").css({"background-image":"url("+this.src+")"});
		};
		ys10.src="http://cdn1.zygames.com/mocool/zqsg/index/alertBg.png";
		
	};
	ys0.src="http://cdn1.zygames.com/mocool/zqsg/index/loadingBg.jpg";
	
	
	//loading
	function loading(v)
	{
		switch(v)
		{
			case 1:
				v= 20;
				break;
			case 2:
				v = 35;
				break;
			case 3:
				v = 50;
				break;
			case 4:
				v = 65;
				break;
			case 5:
				v = 75;
				break;
			case 6:
				v = 85;
				break;	
			case 7:
				v = 92;
				break;
			case 8:
				v = 96;
				break;
			case 9:
				v = 98;
				break;
			case 10:
				v = 100;
				break;
			
			default:
				break;
		}
		$("#loadingNumber").html(v+"/100");
		
		
		/*加载完成*/

		if(v==100)
		{
			start = 1;
			var windowtimeout = false;
			$(window).resize(function(){clearTimeout(windowtimeout);windowtimeout = setTimeout(function(){if(Math.abs(windowWidth - $(window).width()) >30){window.location.reload();}},300);})
			//删除加载时的场景
			$("#loadingBack,#loadingLine,#loadingNumber,#cover,#loadingMes").stop().remove();
			//clearInterval(loadingInterval);
			$(".scene").fadeIn(300);
		//--传送门
		var loadingLine = $("#door");
		var i=0;
		var x=0;
		var loadingInterval =setInterval(function(){
			i++;
			i = i%8;
			x = -256*i;
			loadingLine.css({"background-position":+x+"px 0"})},130);
		//--实例
			var girlHero = new hero(0,270,"#hero","陈指导");
			girlHero.move(300);
			setTimeout(function(){girlHero.speak()},1500);
			var cloud2 = new cloud(1,1,200,-50,1);
			var cloud3 = new cloud(2,1,1200,-70,0.5);
			var cloud2 = new cloud(3,2,1300,-90,1);
			$(document).mousemove(function(e){mouseX = e.pageX;});
			$("#patternConBox").click(function(){girlHero.move(mouseX - $(this).offset().left - $("#hero").position().left-95);});
		}
		
	}
	
	
	var abot = 31;
	$(".btnaccount").each(function(index, element) {
        
		$(this).hover(function()
		{
			if(index==2)
			{
				$(".menuaccountBox").height(180);
			}
			$(".account").eq(index).stop().animate({"bottom":"5px"},200);
			
		},function()
		{
			if(index==2)
			{
				abot = 174;
				$(".menuaccountBox").height(50);
			}
			$(".account").eq(index).stop().animate({"bottom":+(-abot)+"px"},200);
		})
		
    });
	

	
});

//插件
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});