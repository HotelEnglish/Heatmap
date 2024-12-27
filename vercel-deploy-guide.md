# Vercel 部署指南

本指南将帮助您在 Vercel 平台上部署 Word to Markdown 转换工具。

## 前置要求

1. GitHub 账号
2. Vercel 账号（可以使用 GitHub 账号直接登录）
3. 项目代码已经推送到 GitHub 仓库

## 详细步骤


1. **登录 Vercel**
   - 访问 [Vercel 官网](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Import Project" 或 "New Project"
   - 选择 "Import Git Repository"
   - 选择您的 GitHub 仓库

3. **配置部署选项**
   - Framework Preset: 选择 `Other`
   - Build and Output Settings:
     - Build Command: 留空
     - Output Directory: 留空
     - Install Command: `npm install`

4. **部署项目**
   - 点击 "Deploy"
   - 等待部署完成

## 4. 部署后配置

1. **自定义域名**（可选）
   - 在项目设置中点击 "Domains"
   - 添加您的自定义域名
   - 按照提示配置 DNS 记录

2. **检查部署**
   - 访问生成的 Vercel 域名
   - 测试所有功能是否正常工作
   - 检查 favicon 是否正确显示

## 5. 常见问题解决

1. **404 错误**
   - 检查 `vercel.json` 中的路由配置
   - 确保文件路径正确

2. **部署失败**
   - 检查构建日志
   - 确认依赖项是否正确安装
   - 验证 Node.js 版本兼容性

3. **静态资源加载失败**
   - 检查文件路径
   - 确认 `public` 目录结构

### 6. 更新部署

1. **推送更新**
   - 将代码更改推送到 GitHub
   - Vercel 将自动重新部署

2. **手动重新部署**
   - 在 Vercel 仪表板中
   - 找到项目
   - 点击 "Redeploy"

### 7. 监控和维护

1. **查看分析**
   - 使用 Vercel Analytics 监控性能
   - 检查访问统计

2. **日志查看**
   - 在 Vercel 仪表板查看部署日志
   - 监控错误报告

## 注意事项

1. 确保所有依赖都在 `package.json` 中列出
2. 静态文件必须放在 `public` 目录下
3. 路由配置要与实际访问路径匹配
4. 定期检查和更新依赖项

## 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [Node.js 部署指南](https://vercel.com/guides/deploying-nodejs)
- [自定义域名设置](https://vercel.com/docs/concepts/projects/domains)

## 支持

如果遇到问题，可以：
1. 查看 Vercel 部署日志
2. 检查项目 GitHub Issues
3. 访问 Vercel 支持论坛