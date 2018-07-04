var purl = window.location.href;
var data = {};
data[purl] = {};
var del,mini;
var posx,posy;
chrome.runtime.sendMessage({'type':'images'},function(response){
	del = response['del'];
	mini = response['mini'];
});
$(document).ready(function(){
	$(document).mousedown(function(e){
		if(e.which == 3){
			console.log(e);
			posx = e.pageX-100;
			posy = e.pageY;
		}
	});

	chrome.storage.local.get(purl,function(content){
		data = content;
		for(var key in content[purl]){
			var div = createNew();
			var divid = key;
			div.id = divid;
			div.getElementsByClassName('NotexyzText')[0].value = content[purl][key]["text"];
			div.getElementsByClassName('NotexyzTitle')[0].value = content[purl][key]["title"];
			//console.log(del,mini);
			div.getElementsByClassName('NotexyzDel')[0].src = del;
			div.getElementsByClassName('NotexyzMini')[0].src = mini;

			//add dragable
			$(div).draggable({
				containment : "parent"
			});
			//position and append

			document.getElementsByTagName('body')[0].appendChild(div);
			$(div).parent().css({position:'relative'});
			//console.log('content',content);
			//console.log(content[purl][divid]['posx'],content[purl][divid]['posy']);
			$(div).css({position:'absolute',left:content[purl][divid]['posx'],top:content[purl][divid]['posy']});


			
			var textElement = div.getElementsByClassName('NotexyzText')[0];
			//ontextchange
			$(textElement).change(function(){
				// if(content[purl] == undefined)
				// 	content[purl] = {};
				
				// if(content[purl][divid] == undefined)
				// 	content[purl][divid] = {};
			
				content[purl][divid]['text'] = this.value;
				chrome.storage.local.set(content);
			});

			//ontitlechange
		
			var titleElement = div.getElementsByClassName('NotexyzTitle')[0];
			$(titleElement).change(function(){
				// if(content[purl] == undefined)
				// 	content[purl] = {};
			
				// if(content[purl][divid] == undefined)
				// 	content[purl][divid] = {};
			
				content[purl][divid]['title'] = this.value;
				chrome.storage.local.set(content);
			});

			//delete
			document.getElementById(divid).getElementsByClassName('NotexyzDel')[0].addEventListener('click',function(){
					var x = this.parentNode.parentNode.parentNode.parentNode.parentNode;
					$(x).remove();
					chrome.storage.local.get(purl,function(obj){
						delete obj[purl][x.id];
						chrome.storage.local.set(obj);
					});
			});
		}
	});
});

chrome.runtime.onMessage.addListener(function(message, sender, response){
	
		if(message.type == 'note'){
			var divid2 = 'i'+(new Date).getTime();
		var div = createNew();
		div.id = divid2;
		div.getElementsByClassName('NotexyzDel')[0].src = del;
		div.getElementsByClassName('NotexyzMini')[0].src = mini;

		if(data[purl] === undefined){
			data[purl] = {};
		};
		data[purl][divid2] = {};

		//delete
		div.getElementsByClassName('NotexyzDel')[0].addEventListener('click',function(){
			$(div).remove();
			chrome.storage.local.get(purl,function(obj){
				delete obj[purl][divid2];
				chrome.storage.local.set(obj);
			});
			
		});

		//initial title
		var titleElement = div.getElementsByClassName('NotexyzTitle')[0];
		titleElement.value = '';
		//ontitle change
		$(titleElement).change(function(){
			data[purl][divid2]['title'] = this.value;
			chrome.storage.local.set(data);
		});

		//initial text
		var textElement = div.getElementsByClassName('NotexyzText')[0];
		textElement.value = '';
		//ontext change
		$(textElement).change(function(){
			data[purl][divid2]['text'] = this.value;
			chrome.storage.local.set(data);
		});

		document.getElementsByTagName('body')[0].appendChild(div);
		
		$(div).parent().css({position:'relative'});
		$(div).css({position:'absolute',left:posx,top:posy});

		//update position
		data[purl][divid2]['posy'] = posy;
		data[purl][divid2]['posx'] = posx;
		//console.log('new data',data);
		chrome.storage.local.set(data);
		// chrome.storage.local.get(null,function(x){
		// 	console.log(x);

		// });
		//add draggable
			$(div).draggable({
				containment : "parent"
			});
	
		}
});