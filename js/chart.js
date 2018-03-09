$(function(){
	$('.btnPrev').click(function(){
		var $mleft = $('#box-weather').css('margin-left');
		// var numPx = Number($mleft[0]);
		if($mleft == '0px'){
			return false;
		}else{
			$('#box-weather').animate({"margin-left":"+=1150px"},1000);
		}
		// console.log(numPx);
		// alert($('#box-weather').css('margin-left'));
	});
	$('.btnNext').click(function(){
		var $mleft = $('#box-weather').css('margin-left');
		if($mleft == '-1150px'){
			return false;
		}else{
			$('#box-weather').animate({"margin-left":"-=1150px"},1000);	
		}
	});
	//生活指数事件
	$('#ls-living').on('mouseover','.item',function(){
			$(this).find('.ct-sub').css('display','none');
			$(this).find('.ct-detail').css('display','block');
	});
	$('#ls-living').on('mouseout','.item',function(){
			$(this).find('.ct-sub').css('display', 'block');
			$(this).find('.ct-detail').css('display', 'none');
	});

	
})