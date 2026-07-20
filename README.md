# 软件工具导航站

基于 AI 自动生成内容的软件工具导航站，部署在 Cloudflare Pages。

## 项目结构

```
.
├── .env                      # API Key 配置（不要上传到 GitHub）
├── .gitignore
├── README.md
├── scripts/                  # 自动化脚本
│   ├── generate_articles.py  # AI 文章生成脚本
│   ├── tools_list.txt        # 待生成的工具列表
│   └── build_site.py         # 网站构建脚本
├── content/                  # 生成的文章（Markdown）
│   └── articles/
└── public/                   # 网站静态文件（部署到 Cloudflare）
    ├── index.html            # 首页
    ├── article/              # 文章页面
    ├── css/
    │   └── style.css
    └── data/
        └── articles.json     # 文章索引
```

## 使用方法

```bash
# 1. 生成文章（每次生成 5 篇）
python scripts/generate_articles.py --count 5

# 2. 构建网站
python scripts/build_site.py

# 3. 本地预览
cd public && python -m http.server 8000
```

## 部署

推送到 GitHub，在 Cloudflare Pages 连接仓库即可自动部署。
