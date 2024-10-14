const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'peminjamanalatselam' // Sesuaikan nama database yang sesuai dengan tabel alatselam
});

connection.connect((err) => {
    if (err) {
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id " + connection.threadId);
});

app.set('view engine', 'ejs');

// Routing (Create, Read, Update, Delete) untuk Alat Selam

// Read (Menampilkan daftar alat selam)
app.get('/', (req, res) => {
    const query = 'SELECT * FROM alatselam';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { alatselam: results });
    });
});


// Create (Menambahkan alat selam baru)
app.post('/add', (req, res) => {
    const { nama_alat, kategori, kondisi, stok } = req.body;
    const query = 'INSERT INTO alatselam (nama_alat, kategori, kondisi, stok) VALUES (?, ?, ?, ?)';
    connection.query(query, [nama_alat, kategori, kondisi, stok], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update (Akses halaman edit)
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM alatselam WHERE id = ?'; // Ganti alatselam dengan nama tabel yang sesuai
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.send('Terjadi kesalahan saat mengambil data.');
        }
        if (results.length === 0) {
            return res.status(404).send('Data tidak ditemukan.');
        }
        console.log(results);
        
        res.render('edit', { alat: results[0] }); // Mengirim data alat ke view
    });
});


// Update (Memperbarui data alat selam)
app.post('/update/:id', (req, res) => {
    const { nama_alat, kategori, kondisi, stok } = req.body;
    const query = 'UPDATE alatselam SET nama_alat = ?, kategori = ?, kondisi = ?, stok = ? WHERE id = ?';
    connection.query(query, [nama_alat, kategori, kondisi, stok, req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete (Menghapus data alat selam)
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM alatselam WHERE id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});