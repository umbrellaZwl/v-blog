module.exports = {
  title: 'My VuePress Blog',
  description: 'Just playing around',
  base: '/v-blog/',
  themeConfig: {
    sidebar: [
      {
        title: '代码规范',
        collapsable: false,
        children: [
          '/vscode搭配linter&prettier',
        ]
      },
      '常用代码片段',
      {
        title: 'Taro',
        collapsable: false,
        children: [
          '/Taro采坑记录',
        ]
      },
      {
        title: 'vue',
        collapsable: false,
        children: [
          '/vue/vue的keep-alive',
          '/vue/vuex',
          '/vue/vue生命周期梳理',
          '/vue/vue3响应式原理',
        ]
      },
      {
        title: '小程序',
        collapsable: false,
        children: [
          '/小程序/小程序生命周期',
          '/小程序/小程序错误监控',
          '/小程序/小程序调试工具',
        ]
      },
      {
        title: '积累',
        collapsable: false,
        children: [
          '/积累/浏览器进程和js线程',
          '/积累/前端路由',
          '/积累/script标签的async和deffer',
          '/积累/Http1.0、Http1.1、Http2.0',
          '/积累/fetch',
          '/积累/BFCache',
        ]
      },
    ]
  }
}