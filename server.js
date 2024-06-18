const express = require('express');//express 모듈 가져오기
const app = express();//express 애플리케이션 객체 생성
const { MongoClient } = require('mongodb');//Node.js에서 MongoDB와 연결하기 위해 필요한 MongoDB 드라이버인 mongodb 패키지에서 MongoClient 객체를 가져오는 코드입니다.

app.use(express.static(__dirname + '/public'));//express static 미들웨어 사용 설정 (경로) 근데 path.join을 생략해서 사용 함
//nodejs 에서 제공하는 path모듈에서 제공하는 join함수를 사용 한 것
//미들웨어는 요청과 응답 사이에 위치하여 여러 작업을 수행하는 함수, 요청이 들어올 때 응답을 보내기 전 특정 작업을 수행할 수 있게 해줌
//CSS 사용 시 이미 설정된 경로 이후를 작성해서 사용하면 됨
app.use(express.json());//미들웨어 바디파서 이제 nodejs 내장 미들웨어 임
app.use(express.urlencoded({ extended : true }));//미들웨어 바디파서 이제 nodejs 내장 미들웨어 임 

app.set('view engine', 'ejs');//view engine으로 ejs를 사용한다는 설정을 set 하는 메서드
app.set('views', './views');//views폴더의 위치 경로를 ./views로 한다는 메서드

let db;
const url = 'mongodb+srv://admin:qwer1234@cluster0.dqharxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
new MongoClient(url).connect()//
  .then((client)=>{
    console.log('DB연결성공');
    db = client.db('forum');
    app.get('/', (req, res)=>{
      res.sendFile(__dirname + '/index.html');//현재경로 + 내가 보낼 파일이 있는 경로
    });
}).catch((err)=>{
  console.log(err)
})

// app.get('/', (req, res)=>{//애플리케이션 객체에게 데이터 전송 방식 (라우팅, 콜백함수)
//   res.send('반갑다');//클라이언트에서 서버로 get방식으로 '/'URL로 요청을 하면 응답
// })
// app.get('/', (req, res)=>{
//   res.sendFile(__dirname + '/index.html');//현재경로 + 내가 보낼 파일이 있는 경로
// })
// app.get('/news', (req, res)=>{
//   res.send('뉴스페이지');
// })
app.get('/shop', (req, res)=>{
  res.send('쇼핑페이지임');
})
app.get('/about', (req, res)=>{
  res.sendFile(__dirname + '/about.html');
})
app.get('/news', ()=>{
  db.collection('post').insertOne({ title : '어쩌고'});
})
app.get('/list', async (req, res)=>{//expres에서 async await 사용을 권장함
  let result = await db.collection('post').find().toArray();//서버와 통신하는것이기 떄문에 시간이 오래 걸리기 떄문에 비동기 처리가 필요해서 async await를 사용한 것, 얘는 promise를 반환 함
  // res.send(result);
  res.render('list.ejs', { 글목록 : result });
})

// app.get('/list', async (req, res) => {//프로미스 처리
// 	let result = db.collection('post').find().toArray().then(()=>{
// 		//여기 코드를 실행해주세요(함수로 묶어서 실행하도록 함)
// 	})
//   console.log(result)
// 	res.send('db에 있던 게시물')
// }) 

// app.get('/list', async (요청, 응답) => {//비동기 처리를 콜백함수를 이용해서 함
// 	db.collection('post').find().toArray(()=>{
// 		console.log(result)
// 		res.send('db에 있던 게시물')
// 	})
// }) 

app.get('/time', (req, res)=>{
  res.render('time.ejs', { 시간 : new Date() });
})
app.get('/write', (req, res)=>{
  res.render('write.ejs');
})

// if문으로 예외처리
// app.post('/add', async (req, res)=>{//유효성검사하는 라이브러리들도있음 express-validator, vinejs, validator 이런거
//   if ( req.body.title === ''){
//     res.send('제목작성안함');
//   } else {
//     await db.collection('post').insertOne({ title : req.body.title, content : req.body.content });
//   res.redirect('/list');
//   }
// })
// try catch 문으로 오류검증
app.post('/add', async (req, res)=>{
  try {
    await db.collection('post').insertOne({ title : req.body.title, content : req.body.content });
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.send('DB 에러 남');
  }
})

app.listen(8080, (req, res)=>{//포트번호, 서버가 실행되었을때 실행할 콜백함수 - 서버시작 메서드
  console.log('http://localhost:8080 에서 서버 실행 중');
})