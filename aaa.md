# Big Screen

##文件结构

```
src
├── common ---------------------------------- 公用目录
│   ├── DevTools.js --------------------- redux 开发工具
│   ├── chart.theme.json ---------------- echart 主题配置
│   ├── config.js ----------------------- 共享配置
│   ├── db.js --------------------------- 数据源抽象
│   └── global.less --------------------- 全局共享样式
├── modules --------------------------------- 公用模块目录
│   ├── component.bar.chart ------------- 柱状图模块
│   ├── component.base.chart ------------ 图表基类
│   ├── component.board.holder ---------- 面板容器
│   ├── component.cooperation.bar ------- 合作伙伴
│   ├── component.flipboard ------------- 数字翻牌器
│   ├── component.geo.map --------------- 地图
│   ├── component.history --------------- 历史轮播
│   ├── component.loading --------------- 加载模块
│   ├── component.number ---------------- LED 数字
│   ├── component.pie.chart ------------- 饼图模块
│   ├── component.text ------------------ 标题文字
│   └── component.tooltip --------------- 弹出提示
└── pages ----------------------------------- 页面级目录
    └── realtime ------------------------ 页面目录
        ├── assets ------------------ 页面级资源目录
        └── containers -------------- 页面容器型组件
```

##启动项目

###第一步，安装依赖

```
npm i 
```

###第二步，启动项目：

启动项目需要安装GUI工具：Jarvis

**下载地址：**

**git:** https://github.com/EHDFE/ehdev-shell/releases

**传化网盘：**https://pan.etransfar.com/apps/files/desktop/files/folder/339000283745

![](http://image.tf56.com/dfs/group1/M00/5C/C3/CiFBCltQPQiAX3SUAAE79zTxja4262.png)

1. 切换项目：选中你要启动的项目文件
2. 点“启动”按钮启动，默认端口：3000，也可自己点按钮旁的三个点去设置端口
3. 发布前先构建项目（JS、CSS、图片压缩）点击“构建”按钮，构建成功后发布dist文件的内容
   *(构建进度可以点击右下角图标查看)*
