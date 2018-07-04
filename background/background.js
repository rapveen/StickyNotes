chrome.contextMenus.create({
	'id':'note',
	'title':"create a sticky note",
	'contexts':["all"]
});

chrome.contextMenus.onClicked.addListener(function(info){
	if(info.menuItemId == 'note'){
		chrome.tabs.query({active:true,currentWindow:true},function(tabs){
			console.log(tabs);
			chrome.tabs.sendMessage(tabs[0].id,{'type':'note'});
		});
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, response){
	if(message.type == 'images'){
		var del = chrome.extension.getURL('../images/delete.png');
	var mini = chrome.extension.getURL('../images/minimize.png');
	console.log(del,mini);
	f = {'del':del,'mini':mini};
	response(f);
}else if(message.type = "contents"){
		var data1;
		chrome.storage.local.get(message.url,function(x){
			data1 = x;
			console.log(data1);
		});
		setTimeout(function(){
			response(data1);
		},500);
		
	}
});