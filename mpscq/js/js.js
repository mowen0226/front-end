$(document).ready(function(e) {
   
//整体框架
	
	$(".btn_next").click(function(){
		 btnNext();
	})
	$(".btn_prv").click(function(){
		 btnPrv();
	})
   
   
   //初始化
   var step = $(".step");
   var step_w = step.width();
   var step_num = step.size();
   var stepbox = $("#stepbox").css({"width":+step.width()*step_num+"px"});
   var menu = $("#menu");
   var con3box = $(".con_3_2");
   var theleft = 0;
   var index_this = 1;
   
   //初始显示  
   //stepGo(4);
   function stepGo(num){
		theleft = (-step_w*(num-1));
		stepbox.css({"left":+theleft+"px"});
		con3box.attr('class','con_3_2 con3box'+num);
		index_this =num;
		menu.attr('class','cur'+num);
	}
   
   //切换导航
	var m = $("#menu .m").each(function(index, element) {
        
		var mthis = $(this);		
		
		mthis.click(function(){
			theleft = -step_w*index;
			index_this = index+1;			
			boxmove();				
		});
		
		
    });
	
	
	//下一步
	function btnNext(){
		index_this = index_this+1;
		theleft = theleft-step_w;	
		boxmove();
		
	}
	//上一步
	function btnPrv(){
		index_this = index_this-1;
		theleft = theleft+step_w;	
		boxmove();		
	}
	//滑动
	function boxmove(){
		con3box.attr('class','con_3_2 con3box'+index_this);
		menu.attr('class','cur'+index_this);
		stepbox.stop().animate({"left":+theleft+"px"},100);		
		
	}
	
	
	
//选择背景
	var bgseimg_b = $("#bgseimg_b");
	var bginput = $(".bginput");
	
	$(".bgseimg").each(function(index, element) {
        
		bgthis = $(this);
		
		bgthis.click(function(){
			bginput.val(index+1);
			$(".bgseimg .hover").removeClass("hover");
			$(this).children().attr("class","hover");	
			bgseimg_b.attr("src","http://cdn1.zygames.com/qqsm/events_info/mpscq/img/bg-"+(index+1)+".jpg");
		})
		
		
    });
	
	
	
	
//道具选择

	var window_o = $(window);
	var djboxbg = $(".djboxbg");
	var unep = $(".unep");
	var unepsrc = "http://cdn1.zygames.com/qqsm/events_info/mpscq/img/wqbg.png";
	

	dj_fn("#dj_wq .bd img",".infotit6 .ckdj","#weapon_id_","#dj_wq");
	dj_fn("#dj_sz .bd img",".infotit7 .ckdj","#suit_id_","#dj_sz");
	dj_fn("#dj_hd .bd img",".ckhd","#hd_id_","#dj_hd");

	function dj_fn(dj_img,dj_none_img,inputid,id){
		$(dj_none_img).each(function(index, element) {			
			$(this).click(function(){
			 indexdj =index,
			 this_ckdj = $(this);
			 this_cid = this_ckdj.attr("data-cid");
			 chdj_fn(id);
			 if(this_cid!=0){
					 unep.show();
				};						 
			 //
			});
    	});
		
		$(dj_img).each(function(index_dj, element_dj) {               
			$(this).click(function(){
			   this_dj_src = $(this).attr("src");
			   this_dj_cid = $(this).attr("data-cid");					  
			  //alert(this_cid)
			   if(this_cid!=0){
				   //alert(this_cid)
				   $(dj_img+"[data-cid='"+this_cid+"']").show();
				};				   
			   $(inputid+(indexdj+1)).val(this_dj_cid);
			   this_ckdj.attr({"src":this_dj_src,"data-cid":this_dj_cid});
			   chdjclose_fn();
			   $(this).hide();
			   unep.hide();
			});	
			
		});		  
		  
		unep.click(function(){
			this_ckdj.attr({"src":unepsrc,"data-cid":0});
			$(dj_img+"[data-cid='"+this_cid+"']").show();
			$(inputid+(indexdj+1)).val(0);							
		});
		
		$(".chdzclose").click(function(){
			chdjclose_fn()
			
		})
		  
		function chdjclose_fn(){
			djboxbg.fadeOut(100);
			$(id).fadeOut(0);
			unep.hide();		
		};
		
		
		
		function chdj_fn(v){		
			document_h = $(document).height();			
			window_w = window_o.width();
			window_h = window_o.height();
			scroll_h = window_o.scrollTop();
			scroll_w = window_o.scrollLeft();
			popbox_w = $(v).width();
			popbox_h = $(v).height();
			popbox_x = (window_w - popbox_w)/2 + scroll_w;
			popbox_y = (window_h - popbox_h)/2 + scroll_h-100;	
			djboxbg.css({"width":+(window_w+scroll_w)+"px","height":+(document_h)+"px"}).fadeTo(0,0.6);
			$(v).css({"top":+popbox_y+"px"}).fadeIn(100);			
		};
	}
});