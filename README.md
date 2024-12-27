# 中国城市热力图

一个简洁、易用的中国城市热力图可视化工具，支持CSV文件上传和文本输入两种数据导入方式。

## 功能特点

- 📊 支持CSV文件上传
- ✍️ 支持文本直接输入数据
- 🔍 可显示/隐藏数值标记
- 💾 支持导出PNG格式图片
- 🔄 支持地图缩放、平移和还原
- 📱 响应式设计，支持各种设备

## 在线演示

访问 [Demo](https://your-demo-url.vercel.app)

## 本地部署

1. 克隆仓库
```bash
git clone https://github.com/yourusername/china-heatmap.git
cd china-heatmap
```

2. 安装依赖
```bash
npm install
```
3. 启动服务
```bash
npm start
```
4. 访问 `http://localhost:3000`

## Vercel一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/china-heatmap)

1. 点击上方的 "Deploy with Vercel" 按钮
2. 使用 GitHub 账号登录 Vercel（如果还没有账号，需要先注册）
3. 设置项目名称
4. 点击 "Deploy" 开始部署

## 数据格式要求

### CSV文件格式
- 第一行为标题行（省份,数值）
- 省份名称必须包含"省"、"市"或"自治区"
- 数值必须为数字

示例：
```
省份,数值
北京市,80
广东省,60
```
### 文本输入格式
- 每行一条数据
- 省份名称和数值用英文逗号分隔
- 虽然会自动清理多余字符，但仍然建议按要求输入数据


## 技术栈

- ECharts 5.4.3
- HTML5
- CSS3
- JavaScript

## 项目结构
china-heatmap/
├── index.html # 主页面
├── styles.css # 样式文件
├── script.js # 主要逻辑
├── package.json # 项目配置
├── vercel.json # Vercel配置
└── README.md # 项目说明


## 开发说明

- 地图数据来源：阿里云 DataV.GeoAtlas
- 支持的省份包括所有省、直辖市和自治区
- 热力图颜色范围：0-100

## 贡献指南

1. Fork 本仓库
2. 创建新的分支 `git checkout -b feature/your-feature`
3. 提交更改 `git commit -am 'Add some feature'`
4. 推送到分支 `git push origin feature/your-feature`
5. 创建 Pull Request

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多详情

## 作者

龚老师技术 © 2024

