    const express = require('express');
	const app = express();
	const pool = require('./db/db');
	require('dotenv').config();

	app.use(express.json());

	app.get('/test-db', async (req, res) => {
	  try {
		const result = await pool.query('SELECT NOW()');
		res.json({ message: '連線成功', time: result.rows[0] });
	  } catch (err) {
		console.error(err);
		res.status(500).send('連線失敗');
	  }
	});

    //讀取資料庫資料
    app.get('/products', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM products');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('讀取產品資料時發生錯誤');
        }
    });

	app.listen(process.env.PORT, () => {
	  console.log(`伺服器啟動於 http://localhost:${process.env.PORT}`);
	});


    // 新增一筆產品資料
    app.post('/products', async (req, res) => {
    const { name, price } = req.body;

    try {
        const result = await pool.query(
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
        [name, price]
        );
        res.status(201).json({
        message: '新增成功',
        product: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('新增產品失敗');
    }
    });
