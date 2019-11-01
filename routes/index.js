var express = require('express');
var router = express.Router();
const { Pool, Client } = require('pg');
// Kết nối dữ liệu với PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nodePostgre',
  password: 'deobiet12',
  port: 5432,
});

/* GET home page. */
router.get('/', function (req, res, next) {
  pool.query('SELECT * FROM USERS', (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.render('index', { title: 'Express' });
});

/* Thêm dữ liệu */

// Thêm dữ liệu - GET
router.get('/add', function (req, res, next) {
  res.render('add', { title: 'Thêm dữ liệu' });
});

// Thêm dữ liệu - POST
router.post('/add', function (req, res, next) {
  var name = req.body.name;
  var age = req.body.age
  pool.query("INSERT INTO users (name, age) VALUES ($1, $2)", [name, age], (err, res) => {
    console.log(res)
  });
  res.render('add', { title: 'Thêm dữ liệu' });
});

/* Xem dữ liệu */
router.get('/showdata', function (req, res, next) {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, data) => {
    res.render('showdata', { title: 'Thêm dữ liệu' , data: data.rows});
  });
});

/* Xóa dữ liệu */
router.get('/delete/:userID', function (req, res, next) {
  var userID = req.params.userID;
  pool.query("DELETE FROM users WHERE id = $1", [userID] , (err, data) => {
    res.redirect('/showdata');
  });
});

/* Sửa dữ liệu */
// Sửa dữ liệu - GET
router.get('/edit/:userID', function (req, res, next) {
  var userID = req.params.userID;
  pool.query("SELECT * FROM users WHERE id = $1", [userID] , (err, data) => {
    console.log(data.rows);
    res.render('edit', { title: 'Sửa dữ liệu',  data: data.rows});
  });
});
// Sửa dữ liệu - POST
router.post('/edit/:userID', function (req, res, next) {
  var userID = req.params.userID;
  var name =  req.body.name;
  var age =  req.body.age;
  console.log(name + " " + age);
  pool.query("UPDATE users SET name = $1, age = $2 WHERE id = $3", [req.body.name, req.body.age, userID] , (err, data) => {  });
  res.redirect('/showdata');
});

module.exports = router;
