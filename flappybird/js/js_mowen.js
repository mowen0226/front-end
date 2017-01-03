/**
 *  扑拉鸟v.12 by  @WEB莫问 QQ339788838 http://www.mowen-v.com
 *  Change Log:
 *  v1.2: 1、优化碰撞算法
 *  v1.1: 1、增加纪录最高分 2、加快内存释放 3、增加重新开始功能 4、优化手机touch各事件处理方式
 */
/**
 * [FPS 帧数]
 * @type {Number}
 */
var FPS = 30;

var SCORE = 0;
var SCORE_HIGHEST = 0;

/**
 * [STAGE_W 舞台宽高  小鸟第一次加载的起始位置]
 * @type {Number}
 */
var STAGE_W = 960;
var STAGE_H = 640-70; //画布高度-地面高度
var STAGE_X = 0;
var BIRD_FIRST_X = 200;
var BIRD_FIRST_Y = 200;
var BIRD_WIDTH = 45 ;
var BIRD_HEIGHT = 40;

/**
 * [STAGE_SPEED_X 小鸟飞行X轴全局速度]
 * @type {Number}
 */
var STAGE_SPEED_X = 8;



/**
 * [TUBE_DATA 障碍总数据 grade：1-6]
 * @type {Array}
 */
var TUBE_DATA = [3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,3,6,3,5,1,6,1,3,2,3,6,1,5,6,1,4,2,3,5,1,];

/**
 * [TUBE_STAGE 画布上的障碍 0-3]
 * @type {Array}
 */
var TUBE_STAGE =[];

/**
 * [TUBE_DATA_X 计算障碍出现的X轴]
 * @type {Array}
 */
var TUBE_DATA_X = [];

for(var i=0; i<TUBE_DATA.length; i++)
{
	TUBE_DATA_X.push(STAGE_W+STAGE_SPEED_X*40*(i));
}
/**
 * [TUBE_DATA_X_INDEX ]
 * @type {Number}
 */
var TUBE_DATA_X_INDEX = 0;









/** ==============================================================================================================
 * [BirdClass 鸟] 
 * @param {[type]} w [小鸟宽度]
 * @param {[type]} h [小鸟高度]
 * @param {[type]} x [小鸟初始x]
 * @param {[type]} y [小鸟初始y]
 */
function BirdClass(w,h,x,y)
{
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.o = $('<div id="birdBox" style="width:'+this.w+'px;height:'+this.h+'px;left:'+this.x+'px; top:'+this.y+'px"></div>');
	this.speedY = 0;   //小鸟Y轴掉落速度
	this.rotate = 0;   //小鸟旋转角度
	this.state = 1; //小鸟死亡状态

	this.o.appendTo('#birdContainer');
}
BirdClass.prototype.fly = function()
{
	this.speedY += 2; //加速度
	this.y += this.speedY; //小鸟Y位置
	this.rotate += 3;  //小鸟旋转角度
	STAGE_X += STAGE_SPEED_X;


	if(this.y >= STAGE_H - BIRD_HEIGHT)
	{
		this.y =STAGE_H - BIRD_HEIGHT;
		this.state = 0;
	}
	this.o[0].style.top = this.y + 'px';
	this.o.css({'transform':'rotate('+this.rotate+'deg)','-webkit-transform':'rotate('+this.rotate+'deg)','-moz-transform':'rotate('+this.rotate+'deg)','-ms-transform':'rotate('+this.rotate+'deg)'});
	
	//document.title = this.x;
}
/**
 * [tip 接受点击事件，初始化升空条件]
 * @return {[type]} [description]
 */
BirdClass.prototype.tip = function()
{
	this.speedY = -17;
	this.rotate = -20;
	
}


/**
 * [Tube 水管]  ==============================================================================================================
 * @param {int} grade [可穿透区域所处位置]
 */
function Tube(grade)
{
	this.basicBlockHeight = 55;   //基础块高度
	this.emptyBlockNumber = 3;    //小鸟穿透基础块个数
	this.grade = grade;      
	this.x = STAGE_W;   //可穿透区域起点坐标(目前=画布大小)
	this.y = this.grade * this.basicBlockHeight;
	this.w = 69;
	this.h = this.emptyBlockNumber * this.basicBlockHeight;  //可穿透区域高度

	this.oTube1 = $('<div class="tubeBox" style="background-position:left bottom;width:'+this.w+'px;height:'+this.y+'px;left:'+this.x+'px; top:0px"></div>').appendTo('#birdContainer');
	this.oTube2 = $('<div class="tubeBox" style="background-position:left top;width:'+this.w+'px;height:'+(STAGE_H-this.h-this.y)+'px;left:'+this.x+'px; top:'+(this.h+this.y)+'px"></div>').appendTo('#birdContainer');
}

Tube.prototype.move = function(speed)
{
	this.x -= speed;
	this.oTube1.css("left",this.x);
	this.oTube2.css("left",this.x);
}

Tube.prototype.release = function()
{
	this.oTube1.remove();
	this.oTube2.remove();
}
//辅助函数
//事件绑定 可【return false】 阻止冒泡、默认事件
function myAddEvent(obj,sEv,fn)
{
    if(obj.attachEvent)
    {
        //IE 绑定事件
        obj.attachEvent('on'+sEv,function()
        {
            if(false==fn.call(obj))
            {
                //IE阻止冒泡 & 默认行为
                event.cancelBubble=true;
                return false;
            }
        });
    }
    else
    {
        //标准 绑定事件
        obj.addEventListener(sEv,function(ev)
        {
            if(false==fn.call(obj))
            {
                //标准 阻止冒泡 & 默认行为
                ev.preventDefault();
                return false;
            }
        },false);
    }
}



//控制器 ==============================================================================================================
$(document).ready(function() {

	var controlTime = false;
	var SCROEBOX =$("#score");
	//-----实例化小鸟------------------
	var bird = new BirdClass(BIRD_WIDTH,BIRD_HEIGHT,BIRD_FIRST_X,BIRD_FIRST_Y);	
	

	$("#start").click(function(event) {
		$("#score").show();
		$(this).hide();
		gameStart();
	});
	
	//-----游戏开始------------------
	function gameStart()
	{
		//点击事件绑定
		myAddEvent(document,"mousedown",function(){bird.tip()});
		

		var stageDiv = document.getElementById('birdContainer');

		function tMove(e)
		{
			//alert(e.targetTouches[0].pageY)
			e.preventDefault();
			//return false;
		}
		function tEnd()
		{
			//alert(2);
			document.removeEventListener('touchmove',tMove, false);
    		document.removeEventListener('touchend',tEnd, false);
		}

		myAddEvent(stageDiv,"touchstart",function(){
			bird.tip();
			document.addEventListener('touchmove',tMove,false);
			document.addEventListener('touchend',tEnd,false);
			// myAddEvent(document,'touchmove',tMove,false);
			// myAddEvent(document,'touchend',tEnd,false);
		});
		//控制器
		clearInterval(controlTime);
		controlTime = setInterval(function()
		{
			//创建TUBE
			if(STAGE_X+STAGE_W==TUBE_DATA_X[TUBE_DATA_X_INDEX])
			{
				//内存释放
				if(TUBE_STAGE[TUBE_DATA_X_INDEX%4])
				{
					TUBE_STAGE[TUBE_DATA_X_INDEX%4].release();
					TUBE_STAGE[TUBE_DATA_X_INDEX%4] = null;
				}
				TUBE_STAGE[TUBE_DATA_X_INDEX%4]=new Tube(TUBE_DATA[TUBE_DATA_X_INDEX]);
				TUBE_DATA_X_INDEX++;
			}
			//小鸟开始飞行
			bird.fly();

			//移动TUBE
			for(i in TUBE_STAGE)
			{
				TUBE_STAGE[i].move(STAGE_SPEED_X);
			}
			
			SCROEBOX.html(SCORE);
			//判断tube对象是否已经创建
			if(TUBE_STAGE[SCORE%4])
			{
				//判断小鸟是否撞到柱子上	
				
				if(BIRD_FIRST_X+BIRD_WIDTH >= TUBE_STAGE[SCORE%4].x && BIRD_FIRST_X <= (TUBE_STAGE[SCORE%4].x+TUBE_STAGE[SCORE%4].w))
				{
					if(bird.y <= TUBE_STAGE[SCORE%4].y || bird.y+BIRD_HEIGHT>=(TUBE_STAGE[SCORE%4].y+TUBE_STAGE[SCORE%4].h)  || bird.state == 0)
					{
						gameOver();
					}
				}else if(bird.state == 0)
				{
					gameOver();
				}

				//加分
				if((TUBE_STAGE[SCORE%4].x+TUBE_STAGE[SCORE%4].w)< BIRD_FIRST_X)
				{
					SCORE ++;
					if(SCORE==TUBE_DATA.length)
					{
						alert("你通关了");
					}
				}
			}
			else if(bird.state == 0)
			{
				gameOver();
			}
		},FPS);
	}

	//-----游戏结束------------------
	function gameOver()
	{
		clearInterval(controlTime);

		if(SCORE_HIGHEST<SCORE)
		{
			SCORE_HIGHEST = SCORE;
		}
		$('#scoreHighest').html('<p>本轮得分:'+SCORE+'</p><p>历史最高分：'+SCORE_HIGHEST+'</p>');

		$("#restart").show();
		$("#restartBtn").click(function(event) {
			$("#restart").hide();
			gameRestart();
		})
		
		return false;
	}

	//-----重新开始------------
	function gameRestart()
	{
		STAGE_X = 0;
		SCORE = 0;
		TUBE_DATA_X_INDEX = 0;
		bird.state = 1;
		$('#birdContainer .tubeBox').remove();
		TUBE_STAGE.length = 0;
		bird.y = BIRD_FIRST_Y;
		gameStart();

	}



	
	
	
});

