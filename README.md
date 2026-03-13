# 音频数据集创建工具

**音频数据集创建工具** 是一款用户友好的工具，旨在帮助创建和管理用于机器学习和语音识别项目的音频数据集。它允许用户高效地录制、组织和标注音频文件，确保数据集结构化且易于使用。该工具非常适合构建训练和测试数据集，简化了为各种应用准备音频数据的过程。

![image](https://github.com/user-attachments/assets/7fcd55ce-4ae7-443c-bfa3-e268f5f5b8bd)

## 功能特性

- 录制和管理音频文件
- 将转录数据保存到 SQLite 数据库
- 直观的用户界面，便于标注和数据集管理
- 开源，易于安装

---

## 安装

### 环境要求
- Python 3.8 或更高版本
- Node.js 和 npm
- FFmpeg

### 克隆仓库
```bash
git clone https://github.com/yassinevic/audio_dataset_creator.git
cd audio_dataset_creator
```

### 配置 FFmpeg

要使用本应用中需要 FFmpeg 的功能（如音频或视频处理），请按照以下步骤操作：

1. **下载 FFmpeg**
   - 访问 FFmpeg 官方网站：[https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
   - 选择适合您操作系统（Windows、macOS 或 Linux）的版本

2. **解压 FFmpeg 文件**
   - 下载后，将 FFmpeg 压缩包解压到您电脑上的一个文件夹

3. **将 FFmpeg 放入 `tools` 文件夹**
   - 将解压后的 FFmpeg 可执行文件（如 `ffmpeg`、`ffplay`、`ffprobe`）复制到项目目录下的 `tools` 文件夹中

---

## 使用方法

### 1. 启动后端服务器
后端使用 Python 构建。使用以下命令启动服务器：
```bash
python httpserver.py
```
前端将在 `http://localhost:8080` 启动

此服务器用于音频文件管理和数据库操作。

***如果您不需要自定义用户界面，可以跳过前端设置。***

### 2. 启动前端
进入 `webapp` 文件夹运行用户界面：
```bash
cd webapp
npm install
npm run dev
```

前端将在 `http://localhost:5173`（默认端口）启动。您可以通过用户界面进行录制和转录管理。

### 3. 导入文件格式

导入文件应为纯文本文件，每句话单独占一行。没有标题或其他元数据——只有句子本身，每行一句。这种简单的格式便于准备和加载数据集到项目中。您可以在项目的 `sample` 文件夹中找到所需导入格式的示例。

### 4. 文件管理
- **音频文件**：存储在 `projects` 文件夹中
- **转录数据**：保存在项目根目录的 SQLite 数据库中

---

## 文件夹结构

```plaintext
audio_dataset_creator/
├── httpserver.py       # 后端服务器脚本
├── projects/           # 音频文件目录
├── webapp/             # 前端应用
│   ├── src/            # 用户界面源代码
│   ├── public/         # 静态资源
│   └── package.json    # Node.js 依赖
├── db/                 # 数据库目录
│   ├── database.db     # 转录数据 SQLite 数据库
└── README.md           # 项目文档
```

---

### 待办事项

- [ ] **说话人管理**
  实现管理多个说话人的功能，包括：
  - 添加说话人元数据（如姓名、年龄、性别、口音）
  - 将特定句子或数据集分配给各个说话人
  - 导出特定说话人的数据集

## 参与贡献

欢迎参与贡献！请按以下步骤操作：
1. Fork 本仓库
2. 为您的功能创建新分支（`git checkout -b feature-name`）
3. 提交您的更改（`git commit -m 'Add feature-name'`）
4. 推送到您的分支（`git push origin feature-name`）
5. 提交 Pull Request

---

## 许可证

本项目采用 MIT 许可证。详见 `LICENSE` 文件。

---

## 联系方式

如有问题或需要支持，请提交 Issue。
