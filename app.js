const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql'); 
const cors = require('cors');
const bodyParser = require('body-parser');

//request 객체의 body에 대한 url encoding을 확장 할 수 있도록 설정
app.use(bodyParser.urlencoded({extended:true}));
//req.body에 오는 데이터를 json 형식으로 변환
app.use(bodyParser.json());
app.use(cors());
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

const conn = {
    host : '127.0.0.1',
    port : '3306',
    user : 'root',
    password : 'password',
    database : 'new_schema'
};
// DB 커넥션 생성
const connection = mysql.createConnection(conn); 
// DB 접속
connection.connect();   
console.log('db success');


//글 내용 조회
app.get('/content/:id',(req, res) => {
    const id = req.params.id;
    connection.query('select * from new_schema.dashboard where id = ?',id, function(error,results,fields) {
    res.render('content',{'data':results});
        if (error) throw error;
    });
});


//글 목록
app.get('/list',(req,res) => {
    connection.query('select * from dashboard', function(error,results,fields) {
        res.render('list',{'data':results});
        if (error) throw error;
    });
});


//글 쓰기 페이지
app.get('/write',(req,res) => {
    res.render('write');
});


//글 쓰기 등록
app.post('/write', (req,res) => {
    let datas = [
        req.body.writer,
        req.body.content,
        req.body.title
    ];
    connection.query("insert into dashboard values(null,?,?,?,now(),now())",datas, function (error, results, fields) {
        if (error) throw error;
        res.redirect('http://localhost:3000/list');
    });
});


//글 삭제
app.post('/delete/:id', (req,res) => {
    const id = req.params.id;
    connection.query("delete from dashboard where id = ?;",id, function (error, results, fields) {
        if (error) throw error;
        res.redirect('http://localhost:3000/list')
    });
});


//글 수정란 보기
app.get('/modify/:id',(req,res) => {
    const id = req.params.id;
    connection.query('select * from new_schema.dashboard where id = ?',id, function(error,results,fields) {
        res.render('modify',{'data':results});
        if (error) throw error;
    });
});


//글 수정
app.post('/modify/:id', (req,res) => {
    const id = req.params.id;
    let datas = [
        req.body.writer,
        req.body.content,
        req.body.title,
        id
    ];
    connection.query("update new_schema.dashboard set writer = ?, content = ?, title = ?, updated_at = now() where id = ?",datas,function (error, results, fields) {
        if (error) throw error;
        res.redirect('http://localhost:3000/list');
    });
});

connection.end;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})