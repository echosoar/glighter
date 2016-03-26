#Glighter
*基于Javascript的代码高亮组件，支持多种语言，支持字符串、标签、函数/方法、数字、属性、注释等内容的不同风格高亮和自动化代码行号。*

> Author : echosoar

> WebSite: http://iwenku.net

###V0.1.0
***
*支持HTML代码*
####支持的HTML内容

* 标签
	* 单标签 如：<br />
	* 单标签携带属性 如：<img src="http://iwenku.net" alt="glighter" />
	* 双标签 如：<b>Glighter</b>
	* 双标签携带属性 如：<a href="http://iwenku.net">Glighter</a>
* 注释
	* 使用 <!-- --> 进行的单行和多行注释

#### 用法

```html & javascript
<script src="glighter.js"></script>
<script>
glighter({
	target:document.getElementById("code"),
	language:"html"
});
</script>
```
	
传送门->[Gdivider 0.1.0]https://github.com/echosoar/glighter/tree/master/v0.1.0)
***
