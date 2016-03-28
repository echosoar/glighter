/*
Glighter
Version : 0.1.0 
Author  : echosoar
Website : http://iwenku.net
*/
(function(obj,undefined){
	if(obj.glighter!=null)return;
	var codeData;
	var dataStatus;
	var glighterObj={};
	var supportLanguage="|html|javascript|css|";
	
	var initExp=[/\t/g,/ /g,/\n/g];
	var initExpTo=["#GLighter_T#","#GLighter_Space#","#GLighter_N#"];
	
	var languageCommentsExp={
		html:[/(<|&lt;)!\-\-(.*?)\-\-(>|&gt;)/g],
		htmlTo:["#GLighter_Comments#GLighter_Comments$1!--$2--$3#GLighter_Comments#"],
		css:[/(\/\*)(.*?)(\*\/)/g],
		cssTo:["#GLighter_Comments#GLighter_Comments$1$2$3#GLighter_Comments#"],
		javascript:[/(\/\*)(.*?)(\*\/)/g],
		javascriptTo:["#GLighter_Comments#GLighter_Comments$1$2$3#GLighter_Comments#"]
	};
	
	var languageExp={
		html:[
			/&lt;([\/]?\w*?)(?:#GLighter_Space#|#GLighter_T#)*([\/]{0,1})&gt;/g,
			/&lt;([\/]?\w*?)(?:#GLighter_Space#|#GLighter_T#){1,}(.*?)([\/]{0,1})&gt;/g
			],
		htmlTo:[
			'<span class="glighter_common_tag">&lt;$1$2&gt;</span>',
			'<span class="glighter_common_tag">&lt;$1</span>#GLighter_Space#$2<span class="glighter_common_tag">$3&gt;</span>'
			],
		css:[
			/(#GLighter_Space#|#GLighter_T#|;)([\w-_]+)((?:#GLighter_Space#|#GLighter_T#)*):((?:#GLighter_Space#|#GLighter_T#)*)(#(?:[0-9a-fA-F]{3,6}))((?:#GLighter_Space#|#GLighter_T#)*);/ig,
			/(#GLighter_Space#|#GLighter_T#|;)([\w-_]+)((?:#GLighter_Space#|#GLighter_T#)*):((?:#GLighter_Space#|#GLighter_T#)*)([\w-_]+)((?:#GLighter_Space#|#GLighter_T#)*);/ig
		],
		cssTo:[
			'$1<span class="glighter_property">$2</span>$3 : $4<span class="glighter_string" style="color:$5;text-shadow:1px 1px 1px #000;">$5</span>$6;',
			'$1<span class="glighter_property">$2</span>$3 : $4<span class="glighter_string">$5</span>$6;'
		],
		javascript:[
			/([^\w])(function|return|var|false|true|alert|if|else|elseif|undefined|typeof|while|for|in)([^\w])/ig,
			/([\w_]+)(\s*)\((.*?)\)/ig,
			/\.([\w_]+)([\.;\s])/ig
			],
		javascriptTo:[
			'$1<span class="glighter_common_tag">$2</span>$3',
			'<span class="glighter_function">$1</span>$2($3)',
			'.<span class="glighter_string">$1</span>$2'
		]
	};

	var isHavePropertyHTMLExp=/&lt;(?:\w*?)(?:#GLighter_Space#|#GLighter_T#){1,}(.*?)(?:[\/]{0,1})&gt;/g;
	
	var glighter=function(options){
		if(options.target==null)return;

		glighterObj.target=options.target;
		glighterObj.languageStr=options.language.toLowerCase()||"html";
		glighterObj.dark=options.dark||true;
		
		
		/*unsupport this language*/
		glighterObj.language=glighterObj.languageStr.split("|");
		for(lang in glighterObj.language){
			if(supportLanguage.indexOf("|"+glighterObj.language[lang]+"|")==-1){
				return;
			}
		}
		
		codeData=glighterObj.target.innerHTML;
		
		initExpExec();// 初始化替换操作
		
		languageCommentsExec();//语言注释替换
		
		commentSplit();//注释分离
		
		if(/html/.test(glighterObj.languageStr)){
			htmlTagPropertyExec();
		}
		
		languageExec();
		
		toResult();
	}
	
	function initExpExec(){
		initExp.forEach(function(reg,index){
			codeData=codeData.replace(reg,initExpTo[index]);
		});
	}
	
	function languageCommentsExec(){
		for(var language in glighterObj.language){
			languageCommentsExp[glighterObj.language[language]].forEach(function(reg,index){
				codeData=codeData.replace(reg,languageCommentsExp[glighterObj.language[language]+"To"][index]);
			});
		}
	}
	
	function commentSplit(){
		dataStatus=codeData.split("#GLighter_Comments#").map(function(val){
			if(val.indexOf("GLighter_Comments")==0){
				return [val.substring(17),true];
			}
			return [val,false];
		});
	}
	
	function languageExec(){
		for(var language in glighterObj.language){
			languageExp[glighterObj.language[language]].forEach(function(reg,index){
				dataStatus.forEach(function(arr,indexs){
					if(!arr[1]){
						dataStatus[indexs][0]=arr[0].replace(reg,languageExp[glighterObj.language[language]+"To"][index]);
					}
				});
			});
		}
	}
	
	function htmlTagPropertyExec(){
		dataStatus.forEach(function(arr,indexs){
			if(!arr[1]){
				if(isHavePropertyHTMLExp.test(arr[0])){
					//arr[0]=arr[0].replace(/(#GLighter_Space#|#GLighter_T#){2,}/g,"#GLighter_Space#")
					var htmlPropertyReg=/&lt;(?:\w+?)#GLighter_Space#([\w-_]+=.*?)(?:\/*)&gt;/g;
					var temPropertyLine;
					while(temPropertyLine=htmlPropertyReg.exec(arr[0])){
						var nowIndex=temPropertyLine["index"]+temPropertyLine[0].indexOf(temPropertyLine[1]);
						var temNextLineData=arr[0].substring(nowIndex+temPropertyLine[1].length);
						temPropertyLine[1]=temPropertyLine[1].replace(/([\w-_]+)=(.*?)(#GLighter_Space#|$)/g,'<span class="glighter_property">$1</span>=<span class="glighter_string">$2</span>$3').replace(/#GLighter_Space#([\w-_]+)(#GLighter_Space#|$)/g,'#GLighter_Space#<span class="glighter_property">$1</span>$2');
						arr[0]=arr[0].substring(0,nowIndex)+temPropertyLine[1]+temNextLineData;
					}
				}
			}
		});
	}
	
	function toResult(){
		var lineNum=1;
		var temResStr="";
		for(var chunk in dataStatus){
			var temdata=dataStatus[chunk][0].replace(/#GLighter_T#/g,'<span class="glighter_space4"></span>').replace(/#GLighter_Space#/g,'<span class="glighter_space1"></span>');
			if(dataStatus[chunk][1]){
				temResStr+='<span class="glighter_comment">'+temdata.replace(/#GLighter_N#/g,'</span>#GLighter_N#<span class="glighter_comment">')+'</span>';
			}else{
				temResStr+=temdata;
			}
		}
		temResStr=temResStr.replace(/^#GLighter_N#(.*?)#GLighter_N#$/,"$1");
		var data='<table class="glighter_table">';
		var codeArr=temResStr.split("#GLighter_N#");
		
		codeArr.forEach(function(line,index){
			data+='<tr class="glighter_tr"><td class="glighter_td_index">'+(parseInt(index)+1)+'</td><td class="glighter_td_code">'+line+'</td><tr>';
		});
		data+='</table>';
		glighterObj.target.innerHTML=data;
	}
	
	obj.glighter=glighter;
})(this)