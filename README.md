#Glighter
*基于Javascript的代码高亮组件，支持多种语言，支持字符串、标签、函数/方法、数字、属性、注释等内容的不同风格高亮和自动化代码行号。*

> Author : echosoar

> WebSite: http://iwenku.net

###V0.1.0
***
*支持HTML代码*
####支持的HTML内容

* 标签
	* 单标签 如：&lt;br /&gt;
	* 单标签携带属性 如：&lt;img src="http://iwenku.net" alt="glighter" /&gt;
	* 双标签 如：&lt;b&gt;Glighter&lt;/b&gt;
	* 双标签携带属性 如：&lt;a href="http://iwenku.net" &gt; Glighter &lt;/a&gt;
* 注释
	* 使用 &lt;!-- --&gt; 进行的单行和多行注释

#### 用法

```html
<script src="glighter.js"></script>
<script>
glighter({
	target:document.getElementById("code"),
	language:"html"
});
</script>
```

***
