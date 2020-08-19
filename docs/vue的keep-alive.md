# vue的keep-alive

## 基本使用

* Props：

	* include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
	* exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
	* max - 数字。最多可以缓存多少组件实例。

* 用法：

<code>&lt;keep-alive&gt;</code>包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 transition 相似，<code>&lt;keep-alive&gt;</code> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 keep-alive 内被切换，它的```activated``` 和 ```deactivated``` 这两个生命周期钩子函数将会被对应执行。
注意：>=2.2.0的版本，```activated```和```deactivated```将会在 <code>&lt;keep-alive&gt;</code>树内的所有嵌套组件中触发

```html
<!-- 基本 -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>` 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
```

## 注意
<code>&lt;keep-alive&gt;</code> 是用在其一个直属的子组件被开关的情形。如果你在其中有 v-for 则不会工作。如果有上述的多个条件性的子元素，<code>&lt;keep-alive&gt;</code> 要求同时只有一个子元素被渲染。

## 深入实现原理
```keep-alive```是vue的一个内置hoc组件。[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js)

* create钩子中创建缓存容器
```javascript
created() {
	this.cache = Object.create(null)
}
```
* 找到slot插槽中的第一个组件
```javascript
const vnode: VNode = getFirstComponentChild(this.$slots.default)
```

* 命中缓存则返回，并且更新vnode的位置到链表头部。没命中缓存则存进缓存
```javascript
if (componentOptions) {
	const name: ?string = getComponentName(componentOptions)
	const { include, exclude } = this
	// 根据组件名和include和exclude选项判断是否进行缓存
	// 组件名如果满足了配置 include 且不匹配或者是配置了 exclude 且匹配，那么就直接返回这个组件的 vnode，否则的话走下一步缓存：
	if (
	// not included
	(include && (!name || !matches(include, name))) ||
	// excluded
	(exclude && name && matches(exclude, name))
	) {
		return vnode
	}

	const { cache, keys } = this
	const key: ?string = vnode.key == null
	// same constructor may get registered as different local components
	// so cid alone is not enough (#3269)
	? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
	: vnode.key
	// 如果命中缓存，则直接从缓存中拿 vnode 的组件实例，并且重新调整了 key 的顺序放在了最后一个
	if (cache[key]) {
		vnode.componentInstance = cache[key].componentInstance
		// make current key freshest
		// 使用 LRU 缓存策略，把key移除，同时加在最后面
		remove(keys, key)
		keys.push(key)
	} else {
        // 没有命中缓存，则把 vnode设置进缓存
        cache[key] = vnode
        keys.push(key)
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      // keepAlive标记位
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
}
```
* 设置组件实例的keepAlive属性为true。在下次切换选中事，会根据该参数是否触发activated和deactivated生命周期
* watch include和exclude的变化，来重新修正缓存容器
```javascript
watch: {
    include (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => matches(val, name))
    },
    exclude (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => !matches(val, name))
    }
},

/* 修正cache */
function pruneCache (cache: VNodeCache, current: VNode, filter: Function) {
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      /* name不符合filter条件的，同时不是目前渲染的vnode时，销毁vnode对应的组件实例（Vue实例），并从cache中移除 */
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode)
        }
        cache[key] = null
      }
    }
  }
} 

function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

## 总结
其实keep-alive组件就是vue为我们提供的一个高阶组件， 同时也是一个abstract组件（这样才不会出现在父组件链当中）用到插槽、LRU缓存算法等


