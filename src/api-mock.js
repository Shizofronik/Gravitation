const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: "Mock Task 1", status: "TODO" },
    { id: 2, title: "Mock Task 2", status: "IN_PROGRESS" }
  ]);
});

app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));