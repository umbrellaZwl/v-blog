module.exports = {
  title: 'Hello VuePress',
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
          '/vue的keep-alive',
        ]
      },
      {
        title: '碎片积累',
        collapsable: false,
        children: [
          '/浏览器进程和js线程',
          '/前端路由',
          '/script标签的async和deffer',
          '/Http1.0、Http1.1、Http2.0',
          '/fetch',
        ]
      },
    ]
  }
}