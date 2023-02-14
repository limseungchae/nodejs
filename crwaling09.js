// hanb.co.kr 사이트에서 '새로나온 책' 정보를 긁어오기
// https://www.hanbit.co.kr/store/books/new_book_list.html
// 수집된 데이터들은 newbooks라는 테이블에 저장해 둠
// create table newbooks (
//     bookno number(6),
//     title varchar(250) not null,
//     writer varchar(100) not null,
//     title number not null,
//     regdate date default sysdate,
//     primary key (bookno)
// );
// create sequence bkno; // 순번 생성기

const axios = require("axios");
const cheerio = require("cheerio");
const oracledb = require("oracledb");
const dbconfig = require("./dbconfig.js");

async function main() {
    // 지정한 사이트로부터 도서제목, 저자, 가격을 추출해서
    // JSON 객체로 저장
    // 접속한 url 지정
    const URL = 'https://www.hanbit.co.kr/store/books/new_book_list.html';
    const headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78'};

    // 수집한 개별정보를 저장하기 위해 배열 선언 - 전개spread syntax
    let [titles, writers, prices, books] = [[], [], [], []];

    const html = await axios.get(URL,{
        headers : headers
    });

    const dom = cheerio.load(html.data);


    let elements = dom('.book_tit');
    elements.each((idx, title) => {
        titles.push(dom(title).text());  // 배열에 추가
    });

    elements = dom('.book_writer');
    elements.each((idx,writer) => {
        writers.push(dom(writer).text());
    });

    elements = dom('.price');
    elements.each((idx,price) => {
        prices.push(dom(price).text());
    });

    // 수집한 정보들은 JSON 객체로 생성
    for (let i = 0;i < titles.length; ++i) {
        let book = {};
        book.title = titles[i];
        book.writer = writers[i].replace(/ /g, '');
        book.price = prices[i].replace(/[,|원]/g, '');
        books.push(book);
    }

    // 저장한 JSON 객체로부터 도서제목, 저자, 가격을 추출해서
    // 작업이 끝나면 결과집합 객체를 닫음
    let conn = null;
    let sql = ' insert into newbooks (bookno, title, writer, price) ' +
              ' values (bkno.nextval, :1, :2, :3) ';
    let params = [];

    try {
        oracledb.initOracleClient({ libDir: "C:/Java/instantclient_19_17" });
        conn = await oracledb.getConnection(dbconfig);

        for (let bk of books) {
            params = [bk.title, bk.writer, bk.price];
            let result = await conn.execute(sql, params);
            await conn.commit();
            console.log(result);
        }

    } catch (ex) {
        console.error(ex);
    } finally {
        if (conn) {
            try {
                await conn.close();
                console.log("오라클 데이터베이스 해제 성공!!");
            } catch (ex) {
                console.error(ex);
            }
        }
    }

};

main();
