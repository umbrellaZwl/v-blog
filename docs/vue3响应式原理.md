# vue3响应式原理

## 回顾vue2响应式原理
vue2响应式基于Object.defineProperty劫持data的getter和setter，使得数据可观察
```javascript
function observe(data) {
  if (Array.isArray(data)) { // 如果是数组，需要覆盖数组的原型方法
    Object.setPrototypeOf(data, arrayProto)
  }

  const keys = Object.keys()
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    reactive(data, key)
    observe(data[key])
  }
}

function reactive(data, key) {
  Object.defineProperty(data, key, {
    enumrable: true,
    configable: true,
    get() {
      dep.addDep(Dep.target) // 依赖收集
    },
    set(newVal) {
      dep.notify()
      data[key] = newVal
    }
  })
}
['push','pop','shift','unshift','splice','reverse','sort'].forEach(key => {
  arrayProto[key] = function(){
    Array.prototype[key].apply(this, arguments)
    notifyUpdate()
  }
})
```
### 基于Object.defineProperty主要有一下缺点
* 需要递归遍历属性进行reactive
* 对象属性的新增/删除 无法被监测
* 数组的原型方法修改数组无法被监测

## vue3基于Proxy进行数据响应式
[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)用于定义对象操作的自定义行为。
提供的捕获器更加全面：get, set, has, deleteProperty, ownKeys ...
```javascript
function reactive(data) {
  return new Proxy(data, {
    get(target, key, receiver) {
      const ret = Reflect.get(target, key, receiver)
      // 收集依赖
      track(target, key)
      // 递归
      return isObject(ret) ? reactive(ret) : ret
    },
    set(target, key, newVal, receiver) {
      const ret = Reflect.set(target, key, newVal, receiver)
      // 触发更新
      trigger(target, key)
    },
    deleteProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key)
      // 
    }
  })
}
```
如上分析，用proxy替代了Object.definePropery.但思路还是一样，在getter中 收集依赖```track```, 在setter中 触发更新```trigger```。
那么track和trigger如何自知道自己收集和触发的回调函数是什么呢。所以需要有一个容器来存储对应的映射。结构如下：
```typescript
targetMap: WeakMap {
  target: Map{
    key: Set[cb,...]
  }
}
```
所以track函数拿到cb塞入到targetMap中。那么track函数中是如何拿到cb的。此时轮到effect函数登场了
effect函数声明依赖响应式数据的函数cb。```effect(cb)```. 执行effect会调用cb，触发依赖收集。类似于vue2中watcher的作用

