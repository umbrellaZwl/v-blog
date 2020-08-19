# Taro采坑记录

## video设置style问题
问题描述：当直接给video组件设置style时，编译到h5端会在给video的包裹层taro_video也同时设置上style。如果style里设置了定位，则video会发生位置偏移
解决办法：给video加包裹层，将style设置在包裹层上

## video 设置 className问题
问题描述：当直接给 video 组件设置 className 时，组件渲染会发生异常，导致展示有问题
解决办法：尽量不要使用className，请直接使用 style 行内样式

## Taro.createAnimation 、 Taro.createSelectorQuery
问题描述：不支持阿里系小程序，文档有说明
解决办法：
1、采用页面环境变量判断的形式，使用my.createAnimation 或者 my.createSelectorQuery 规避
2、采用Object.defineProperty()  劫持Taro本身的方法，通过改变 my.xxx 或者 wx.xxx 进行规避

## 0 && xxx会显示0
解决办法：Boolean()