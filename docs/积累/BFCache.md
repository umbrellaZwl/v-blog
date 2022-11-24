# BfCache

bfcache，后退前进缓存，页面离开导航时对web页面的状态进行缓存，包括页面状态和JS执行状态.



来段视频直观感受：https://youtu.be/cuPsdRckkF0



### 具体表现：

- dom不会重新渲染 
- js不会重新执行
- window.onload不会被重新重复啊
- 计时器会根据离开是接着运行

### 哪些情况不会被BFCache命中

- 页面中有监听 unload 或beforeunload
- 页面的response header设置cache-control：no-store
- 页面是 HTTPS 同时页面至少有一个以下设置：

- - "Cache-Control: no-cache"
  - "Pragma: no-cache"
  - 使用 "Expires: 0" 或者 "Expires" 设置相对于 “Date” header值的过去日期值(除非指定 "Cache-Control: max-age=");

- 当用户导航跳离页面时页面还没有完全加载或者因为其他原因有等待（pending）的网络请求 (例如 XMLHttpRequest));
- 页面运行IndexedDB事件;
- 顶级页面包含frames (例如[](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe))因为这里列出的任何原因 而没有被缓存；
- 页面是在frame内而且用户在这个框架中加载一个新页面（在这种情况下, 当用户离开这个页面,最后加载入frames的内容会被缓存）。
- MessageChannel https://github.com/vuejs/vue/issues/8109



**是否会被BFCache可以查看webkit代码**：https://github.com/WebKit/WebKit/blob/7320712069cb26a68b0fd15b7aa54812092c9798/Source/WebCore/history/BackForwardCache.cpp#L76

### 

### 场景

当页面基于BFCache时，页面的加载行为。一般来说，可能会产生以下两点场景：

1、当前页面是否来自于BFCache

2、用户离开时做一下离开二次确认等行为

这里就需要用到新的两个浏览器事件 pageshow和pagehide

```javascript
window.onpageshow = function(e) {
  console.log(e.persisted) // 页面被缓存时，设置为true
}

window.onpagehide = function(e) {
  console.log(e.persisted) // 页面被缓存时，设置为true
}
```

当想在页面离开前做一些逻辑时，我们一般会在beforeunload中做一些操作。但是如果监听了beforeunload则会阻止BFCache命中，此时需要用pagehide代替。**但仍然还是会有区别**：

- beforeunload中，可以阻止页面离开
- pagehide无法阻止页面离开





### refer

- https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching