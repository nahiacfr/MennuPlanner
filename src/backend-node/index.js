const express = require('express');
const app = express();

app.get('/api/suggestions', (req, res) => {
    res.json({ message: 'Here are some recipe suggestions!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
