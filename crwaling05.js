// 미세먼지 공공데이터를 이용해서 특정 지역의 미세먼지 정보 출력
// 	https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty
// 	?serviceKey=GPxX5sf%2BQr9HYeoalPoSjzj%2BJ9DtyQNNP%2B%2BsIOjriI7SJBy%2Bf7Ti4Q4mbzsLInqHkhBygKyArX8svRO8LatPGg%3D%3D&returnType=xml&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0

// 사용할 패키지 가져오기 : require(패키지명)
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser'); // xml 처리기 라이브러리

async function main() {     // 비동기 I/O 지원 함수 정의

    // 접속한 url 지정
    // apiType : xml 또는 JSON
    const URL = 'http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api';
    const params = {'serviceKey': 'GPxX5sf+Qr9HYeoalPoSjzj+J9DtyQNNP++sIOjriI7SJBy+f7Ti4Q4mbzsLInqHkhBygKyArX8svRO8LatPGg==',
        'apiType': 'xml','gubun':'', 'stdDay': '2023-02-13'
    };

    const headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41'};

    // axios로 접속해서 대기오염 정보를 받아옴
    const xml = await axios.get(URL,{
        params : params, headers : headers
    }); // 서버 요청시 User-Agent 헤더 사용

    // 밥아온 데이터 잠시 확인
    // console.log(xml.data);

    // XML을 JSON으로 변환하기
    const parser = new XMLParser();
    let json = parser.parse(xml.data);
    // console.log(json);

    // JSON 으로 불러오기
    let items = json ['response']['body']['items']['item'];
    console.log(items);


    // 미세먼지 정보 출력
    for(let item of items) {
        console.log(`지역 : ${item.gubun}, 전일 확진자수: ${item.incDec},누적 확진자 수: ${item.defCnt}, 누적 사망자수: ${item.deathCnt}, 측정일: ${item.stdDay}`);
    };

};

main();