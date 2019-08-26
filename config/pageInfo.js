// 모듈 추출.


// 페이지 계산 로직.
var pageInfo = function(totalRecord, curPage, numPerPage, pagePerBlock, callback) {
    console.log('pageInfo 호출');
    try {
        var totalPage = parseInt(totalRecord/numPerPage);
                    // 전체 페이지 수(전체 회원 수 / 한 페이지에 보여질 회원 수)

        if (totalRecord % numPerPage != 0)				// ex) 3 % 4 = 3
            totalPage++;

        var totalBlock = parseInt(totalPage/pagePerBlock);		// ex) 3 / 4 = 0

        if (totalPage % pagePerBlock != 0)
            totalBlock++;

        var block = parseInt(curPage/pagePerBlock);

        if(curPage % pagePerBlock != 0)
            block++;

        var firstPage = parseInt((block -1) * pagePerBlock+1);

        var lastPage = parseInt(block * pagePerBlock);

        if(block >= totalBlock){
            lastPage = totalPage;
        }

        var preLink = 0;
        var nextLink = 0;

        if(block > 1){
            preLink = firstPage - 1;
        }

        if(block < totalBlock){
            nextLink = lastPage + 1;
        }
        var listNm = parseInt(totalRecord - (curPage - 1) * numPerPage);

        var strRecord = parseInt((parseInt(curPage - 1)) * numPerPage);
        var endRecord = parseInt(parseInt(curPage) * numPerPage) - 1;

        var pageData = { totalPage: totalPage, totalBlock:totalBlock, block:block,
                        firstPage: firstPage, lastPage: lastPage, preLink: preLink,
                        nextLink: nextLink, listNm:listNm, strRecord:strRecord,
                        endRecord:endRecord };
        
        console.log('pageInfo 성공');
        
        callback(null, pageData);
    } catch (err) {
        console.log('pageInfo 실패했습니다.');
        callback(err, null);
    }
}

module.exports = pageInfo;