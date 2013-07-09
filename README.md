Universal-Touch-Friendly-Text-Selection-Plugin
==============================================

It's a jQuery plugin to minus the inconvenience of selecting text on touch devices~

egin')

## 进入起点选择模式
```js
$('body').textSelect('selectBegin');
```

## 进入终点选择模式
```js
$('body').textSelect('selectEnd');
```
## 清除当前所有选区
```js
$.textSelect('clear')
```

## 获得当前选区的文字
```js
$.textSelect('toString');
```

## 根据指定的节点获得选区
```js
$.textSelect('setRange', {
	start : 1,
	startElement : $('#begin'),
	end : 3,
	endElement : $('#end')
});
```