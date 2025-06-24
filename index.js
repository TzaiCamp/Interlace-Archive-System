const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 設定 EJS 為樣板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// 首頁路由，渲染 cabinet.ejs
app.get('/', (req, res) => {
  res.render('cabinet');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});