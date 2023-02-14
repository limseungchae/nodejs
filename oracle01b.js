// zipcode2013에서
// 서울에 있는 모든 구를 조회해서 출력하세요

const oracledb = require("oracledb");

async function main() {
    // const sql = "select distinct gugun from" +
    //     " zipcode2013 where sido = '서울'" +
    //     " order by gugun";

    // placeholder를 이용해서 동적으로 sql질의문이 작성할 수 있음
    // :인덱스 => 배열로 정의
    // :키 => 객체로 정의
    // const sql = ' select distinct gugun from ' +
    //     ' zipcode2013 where sido = :1 order by gugun ';
    const sql = ' select distinct gugun from ' +
        ' zipcode2013 where sido = :sido order by gugun ';

    // let params = ['서울']; // insert, update, delete, where 절에서 많이 사용
    let params = {sido: '서울'};
    let options = {
        resultSet: true,  // 결과집합을 생성하라, 결과 집합은 여러 행의 결과를 가지는 테이블 같은 것
        outFormat: oracledb.OUT_FORMAT_OBJECT,  // 결과 형식을 객체로 받겠다, 기본은 배열 형식임
    }; // oracle db를 위한 옵션 정의

    let conn = null; // 디비 연결 객체

    try {
        // 오라클 인스턴스 클라이언트 라이브러리가 설치된 위치를 지정해서 초기화
        oracledb.initOracleClient({ libDir: "C:/Java/instantclient_19_17" });

        // 오라클 접속정보를 제공해서 오라클 연결 객체 하나 생성
        conn = await oracledb.getConnection({
            user: "bigdata",
            password: "bigdata",
            connectString: "43.201.55.203:1521/XE",
        });
        console.log("오라클 데이터베이스 접속 성공!!");

        // sql문을 실행하고 결과를 받아옴
        // let result = await conn.execute(sql, params, options);
        let result = await conn.execute(sql, params, options);

        // 실행결과를 결과집합 객체로 변환
        let rs = result.resultSet;

        // 결과집합 객체의 각 요소를 순회하면서 내용 출력
        let row = null;
        while ((row = await rs.getRow())) {
            // outFormat 설정 필요!!
            console.log(row.GUGUN);
        }

        // 작업이 끝나면 결과집합 객체를 닫음
        rs.close();
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
}

main();