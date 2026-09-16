# 陳沐德 (德哥) - 個人檔案 & 即時時鐘儀表板

> 國立中興大學 生醫工程研究所 碩士班  
> 專長：數位 IC 設計 • 生醫感測器開發 • 機器學習應用

---

## 🌐 線上展示 (Live Demo)

👉 **[https://naz0914.github.io/0916/](https://naz0914.github.io/0916/)**

![個人網頁預覽](./螢幕擷取畫面%202026-09-16%20110500.png)

---

## 👤 1. Profile (個人檔案)

- **姓名**：陳沐德 (德哥)
- **科系**：國立中興大學 生醫工程研究所 碩士班
- **專長**：數位 IC 設計、生醫感測器開發、機器學習應用
- **簡介**：「具備數位 IC 設計與 EDA 工具背景，目前專注於結合硬體開發與人工智慧，探索非侵入式醫療檢測（如唾液葡萄糖與呼氣 VOCs 分析）的創新應用。」

---

## 🛠 2. Skills (專業技能)

- **💻 程式與開發**：Python (PyTorch, NumPy), Docker, Git
- **⚡ 硬體與 IC 設計**：Synopsys Verdi, Design Compiler, VCS
- **🧠 人工智慧**：Machine Learning (kNN 演算法)
- **🔬 生醫檢測技術**：EIS (電化學阻抗頻譜), IDE (交錯式微電極), 金屬氧化物感測陣列

---

## 🚀 3. Projects (精選作品與專案)

### Project 1: 機器學習輔助呼氣 VOCs 檢測系統
- **簡介**：開發基於金屬氧化物感測器陣列的呼氣檢測系統，並利用 **kNN 演算法** 進行特徵分析與揮發性有機物 (VOCs) 識別，輔助非侵入式疾病診斷。
- **使用技術**：Python, kNN Algorithm, Sensor Data Analysis
- **相關連結**：[GitHub Repository](https://github.com/naz0914/0916)

### Project 2: HeartPod 醫療器材開發 (B.E.S.T. 創新計畫)
- **獎項殊榮**：🏆 **BEST OF THE BEST 獎項**
- **簡介**：跨領域合作設計用於**左心耳封堵 (LAA closure)** 的新型醫療器材原型，策劃產品法規與健保給付策略。
- **使用技術**：醫材原型設計、法規分析、產品市場策略

---

## 🕐 4. Live Clock (即時時鐘)

- **顯示格式**：`HH : MM : SS`（例如：`11 : 21 : 04`）
- **實作原理**：使用 JavaScript 的 `setInterval()` 每 1000 毫秒（1秒）抓取當前系統時間並實時跳動。
- **字體設計**：採用等寬字型（`JetBrains Mono`, `Courier New`），確保數字跳動時排版絕不偏移。

---

## 🎨 5. Personal Design (個人化設計風格)

- **Theme**：科技感 Dark Mode 與半透明毛玻璃風格 (`backdrop-filter: blur(24px)`)。
- **Background**：深邃夜空藍（呼應科技與宇宙）搭配微光湖水綠漸層（代表生醫與健康）。
- **顏色**：主文字使用冷調白提升易讀性；強調色（Highlight）使用科技青與亮藍色，突顯標題與技能標籤。
- **字型**：中文全面採用「思源黑體 (Noto Sans TC)」，展現俐落簡約的現代感。
- **排版與卡片**：置中單欄式排版，Profile、Skills、Projects、Live Clock 各自包裝在細緻邊框與微陰影的毛玻璃卡片中。
- **動畫**：Hover 懸浮在卡片與標籤上時具備 0.3 秒平滑上浮效果 (`transform: translateY(-5px)`) 及發光陰影。

---

## 🚀 本地啟動 (Local Development)

```bash
# 使用 Python 啟動本地靜態伺服器
python -m http.server 8080
```
瀏覽器開啟：`http://localhost:8080/index.html`