$(function(){
			//坐标还有数据的存储，给echarts进行使用
				var hourlyArr = [];
				var hourlyLen = [];
				var dailyLen = [];
				var dailyDays = [];//白天
				var dailyNight = [];//晚上
				//匹配关键字
				var match = function(living){
					var icon = '';
					switch(living){
						case '空调指数':
							icon = 'icon-kongtiao';
							break;
						case '运动指数':
							icon = 'icon-sports';
							break;
						case '紫外线指数':
							icon = 'icon-ziwaixian';
							break;
						case '感冒指数':
							icon = 'icon-sick';
							break;
						case '洗车指数':
							icon = 'icon-xiche';
							break;
						case '空气污染扩散指数':
							icon = 'icon-kongqizhiyiban';
							break;
						case '穿衣指数':
							icon = 'icon-yifu';
							break;
					}
					return icon;
				};
				// var codeCity = encodeURI('广州');
				//获取用户ip
				var ip = returnCitySN.cip;
				$.ajax({
					type:'get',
					url:'http://jisutqybmf.market.alicloudapi.com/weather/query?ip=' + ip,
					beforeSend:function(request){
						request.setRequestHeader('Authorization','APPCODE ' + '7ba9f4e6034249b2922a753760cdc013')
					},
					dataType: 'json',
					success:function(data){
						//aqi
						var aqi = data.result.aqi;
						//当天状况
						var result = data.result;
						//当天逐个时间天气预报
						var hourly = data.result.hourly;
						//未来7天天气预报，有白天和晚上
						var daily = data.result.daily;
						//生活指数
						var dayIndex = data.result.index;
						var nowPicUrl =  'url(img/weathercn/' + result.img + '.png)';
						$('.sliderCity').append(result.date + ' ' + result.week + ' ' + result.city);
						// $('.sliderTime').append(result.date + ' ' + result.week);
						$('.nowPic').css('background-image',nowPicUrl);
						$('.nowDegree').append(result.temp + '℃');
						$('.temp').append(result.weather);
						$('.wind').append(result.winddirect + result.windpower);
						$('.upDate').append('更新时间：' + result.updatetime.slice(11));
						$('.humidity').append('湿度：' + result.humidity + '%');
						$('.icon-kongqizhiliangcha').css('color',aqi.aqiinfo.color);
						$('#txt-val').text(aqi.aqi).css('color',aqi.aqiinfo.color);
						$('#txt-desc').text(aqi.quality);
						//echarts hourly数据的提取
						for(var i = 0;i < hourly.length;i++){
							hourlyLen.push(i);
							hourlyArr.push(hourly[i].temp);
							$('#ls-weather-hour').append('<li class="item"><p class="txtTime">' + hourly[i].time + '</p><img src="img/weathercn/' + hourly[i].img + '.png" class="icon"></li>' );
						};

						//echarts daily数据提取
						for(var t = 0;t < daily.length;t++){
							dailyLen.push(t);
							//白天和晚上温度的存储
							dailyDays.push(daily[t].day.temphigh);
							dailyNight.push(daily[t].night.templow);
							//添加7天需要的数据
							$('#ls-weather-day').append('<li class="item"><p class="day">' + daily[t].week + '</p><p class="date">' + daily[t].date.slice(5) + '</p><div class="wcDayTime"><p class="weather">' + daily[t].day.weather + '</p><img src="img/weathercn02/' + daily[t].day.img + '.png" class="icon"></div><div class="wcNight"><img src="img/weathercn/' + daily[t].night.img + '.png" class="icon"><p class="weather">' + daily[t].night.weather + '</p></div><p class="wind">' + daily[t].day.winddirect + '</P><p class="wind">' + daily[t].day.windpower + '</p></li>')
						};

						//生活指数的数据提取
						for(var j = 0;j < dayIndex.length;j++){
							//每次进来找出当前的关键字，然后进行输出html
							$('#ls-living').append('<li class="item"><div class="ct-sub"><i class="icon iconfont ' + match(dayIndex[j].iname) + '"></i><p class="content">' + dayIndex[j].iname.slice(0,-2) + ' ' + dayIndex[j].ivalue + '</p></div><div class="ct-detail"><div class="detail">' + dayIndex[j].detail + '</div></div></li>');
						};
						console.log(data);
						//初始化echarts
						var myChart = echarts.init(document.getElementById('chart-hours'));

						// 配置
						var option = {
							//改变画布位置
							grid:{
								left:'-0.5%'
							},
							//虽然x轴也不显示，但配置必须写，不然的话会出错
							xAxis: {
								//不显示
								show:false,
								//强制设置 坐标的间隔
								// min: 0,
								// max:5,
								
								data: hourlyLen,
								axisLabel:{
									//x轴的样式
									textStyle:{
										fontSize:.7
									}
								}
							},
							yAxis:{
								show:false
							},
							//提示框的信息，这里把提示框的触发行为设置没任何触发
							tooltip:{
								trigger:'none'
							},
							//显示的配置
							series:[{
								type:'line',//折线图格式,有其它格式可选
								data:hourlyArr,//数据
								// 图形上的文本标签，可用于说明图形的一些数据信息
								label:{
									normal:{
										color:'#333',
										fontSize: 16,
										//显示标签，并且设置位置
										show:true,
										position:[0,-25],
										formatter:function(data){
											//data存储标签信息，其中里面有value值是数据
											return data.value + '℃';
										}
									}
								},
								//标记的图形
								symbol:'circle',
								//圆圈的大小
								symbolSize:10,
								//折线的样式
								itemStyle:{
									normal:{
										color:'#ffd700',
										lineStyle:{
											color:'#ffd700',
											width:3
										}
									}
								}
							}]
						};
						//7天数据
						var chartDays = echarts.init(document.getElementById('chartDays'));
						// 配置2
						var option2 = {
							//改变画布位置
							grid:{
								left:'-0.5%'
							},
							//虽然x轴也不显示，但配置必须写，不然的话会出错
							xAxis: {
								//不显示
								show:false,
								//强制设置 坐标的间隔
								// min: 0,
								// max:5,
								
								data: dailyLen,
								axisLabel:{
									//x轴的样式
									textStyle:{
										fontSize:.7
									}
								}
							},
							yAxis:{
								show:false
							},
							//提示框的信息，这里把提示框的触发行为设置没任何触发
							tooltip:{
								trigger:'none'
							},
							//显示的配置
							series:[{
								type:'line',//折线图格式,有其它格式可选
								data:dailyDays,//白天数据
								// 图形上的文本标签，可用于说明图形的一些数据信息
								label:{
									normal:{
										color:'#333',
										fontSize: 16,
										//显示标签，并且设置位置
										show:true,
										position:[0,-25],
										formatter:function(data){
											//data存储标签信息，其中里面有value值是数据
											return data.value + '℃';
										}
									}
								},
								//标记的图形
								symbol:'circle',
								//圆圈的大小
								symbolSize:10,
								//折线的样式
								itemStyle:{
									normal:{
										color:'#FFA54F',
										lineStyle:{
											color:'#FFA54F',
											width:3
										}
									}
								}
							},
							{
								type:'line',
								data:dailyNight,//晚上数据
								label:{
									normal:{
										color:'#333',
										fontSize: 16,
										// fontWeight:'bold',
										show:true,
										position:[0,25],
										formatter:function(data){
											//data存储标签信息，其中里面有value值是数据
											return data.value + '℃';
										}
									}
								},
								symbol:'circle',
								symbolSize:10,
								itemStyle:{
									normal:{
										color:'#00CED1',
										lineStyle:{
											color:'#00CED1',
											width:3
										}
									}
								}
							}	
							]
						};

						//使用配置好的图表
						myChart.setOption(option);
						chartDays.setOption(option2);
						
						// console.log(hourly);
					}
				});
				
		})