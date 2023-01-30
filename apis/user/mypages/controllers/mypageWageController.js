const { Users, Banks } = require('../../../../models');

// 정산 내역 조회
const getTotalWageList = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Wage']
        #swagger.summary = '정산 내역 조회'
        #swagger.description = '정산 내역 조회'
    /*  #swagger.parameters['Date'] = {  
        in: 'query',
        name: 'wage_date',
        description: '정산 년,월 YYYY-MM (2022-02)',
        type: 'date'} 
    /*  #swagger.responses[200] =  {  
            description: '정산 내역 조회 성공',
            schema: {   "code" : 200,
                        "message" : "정산 내역 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_wage/wagelist' }}}
    /*  #swagger.responses[401] = { 
            description: '정산 내역 조회  실패',
            schema: { "code" : 401, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '정산 내역 조회 성공', date: {} });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 정산 계좌 등록
const setWageAccount = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Wage']
        #swagger.summary = '정산 계좌 등록'
        #swagger.description = '정산 계좌 등록'

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_wage/set_account'  }}

    /*  #swagger.responses[200] =  {  
            description: '정산 계좌 등록 성공',
            schema: {   "code" : 200, "message" : "정산 계좌 등록 성공"}}

    /*  #swagger.responses[401] = { 
            description: '정산 계좌 등록 실패',
            schema: { "code" : 401, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;
    const { account_bank, account_number, account_holder } = req.body;

    // 1. 회원 조회 (이름 조회)

    const bank = await Banks.findOne({ bank_name: account_bank });
    console.log(bank.id);

    // 2. OPEN BANKING TESTBED 조회 =========================================> 보류

    // [오류] 입력 정보와 실제정보가 일치하지 않는 경우
    // 명의가 일치하지 않으면 실패알람

    // 3. 계좌 등록
    await Users.update(
      { bank_id: bank.id, account_number, account_holder },
      { where: { id: user_id } }
    );

    return res.status(200).json({ code: 200, message: '정산 계좌 등록 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getTotalWageList,
  setWageAccount,
};
