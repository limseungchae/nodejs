// 미세먼지 공공데이터를 이용해서 특정 지역의 미세먼지 정보 출력
// 	https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty
// 	?serviceKey=GPxX5sf%2BQr9HYeoalPoSjzj%2BJ9DtyQNNP%2B%2BsIOjriI7SJBy%2Bf7Ti4Q4mbzsLInqHkhBygKyArX8svRO8LatPGg%3D%3D&returnType=xml&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0

// 사용할 패키지 가져오기 : require(패키지명)
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');    // 파일시스템 관리 라이브러리
const path = require('path');  // 파일경로 관리 라이브러리

async function main() {     // 비동기 I/O 지원 함수 정의

    // 접속한 url, 쿼리스트링, user-agent 헤더 지정
    const URL = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
    const params = {'serviceKey': 'GPxX5sf+Qr9HYeoalPoSjzj+J9DtyQNNP++sIOjriI7SJBy+f7Ti4Q4mbzsLInqHkhBygKyArX8svRO8LatPGg==',
        'returnType': 'json','sidoName': '전국', 'numOfRows':1000
    };

    const headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78'};

    // axios로 접속해서 대기오염 정보를 받아옴
    const json = await axios.get(URL,{
        params : params, headers : headers
    }); // 서버 요청시 User-Agent 헤더 사용

    // 밥아온 데이터 잠시 확인
    // console.log(json.data);

    // JSON 으로 불러오기
    let items = json.data['response']['body']['items'];
    // console.log(items);

    // 미세먼지 정보 출력
    // pm25Value는 출력 안됨!!
    for(let item of items) {
        console.log(item.sidoName, item.stationName,
            item.pm10Value, item.pm25Value,item.dataTime);
    }

};

main();