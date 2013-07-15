Universal-Touch-Friendly-Text-Selection-Plugin
==============================================

It's a jQuery plugin to minus the inconvenience of selecting text on touch devices~


## 进入 起点/终点 选择模式
```js
$el.startSelect(pivot, options); // pivot = 'begin', 'end'; options = {range: xxx; xxx: xxx}
```

## 退出 起点/终点 选择模式
```js
$el.endSelect(pivot, callback);
```
## 清除当前所有选区
```js
$el.getSelection().clear();
```

## 获得当前选区的文字
```js
$el.getSelection().toString();
```