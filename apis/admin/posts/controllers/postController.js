const { Op } = require('sequelize');
const { Users, Carpools, Communities } = require('../../../../models');

// TODO LIST ------------------->
// 1. 관리자 게시글 조회
// - 검색시, 2개의 모델에서 검색이 어려움 -> 고민 필요
// <-----------------------------

// 관리자 게시글 조회 (보류)
const getAllPostsByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Post']
          #swagger.summary = '관리자 게시글 조회'
          #swagger.description = '관리자 게시글 조회'  */

  /*  #swagger.parameters['Type'] = {  
              in: 'query',
              name: 'type',
              description: 'type = rider(탈래요) / driver(타세요',
              type: 'string'}

      /*  #swagger.parameters['kind'] = {  
              in: 'query',
              name: 'kind',
              description: 'kind= commute(출퇴근) / go_work(출근) / leave_work(퇴근) / travel(여행) / etc(기타)',
              type: 'string'}  

      /*  #swagger.parameters['Search'] = {  
              in: 'query',
              name: 'search',
              description: 'search= title / nick_name ',
              type: 'string'}  
     
      /*  #swagger.parameters['Page'] = {  
                  in: 'query',
                  name: 'page',
                  description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
                  type: 'integer'} 

      /*  #swagger.responses[200] =  {
              description: '관리자 게시글 조회 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 게시글 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 게시글 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { category, status } = req.params;
    const { type, kind, search, page } = req.query;
    const postPage = !page ? 0 : page;
    const searchWord = !search ? '' : search;
    console.log(searchWord, 'searchWord');

    // // 검색시 회원 우선 검색
    // let user_id_list = [];
    // await Users.findAll({
    //   where: {
    //     [Op.or]: [
    //       {
    //         nick_name: {
    //           [Op.like]: '%' + searchWord + '%',
    //         },
    //       },
    //     ],
    //   },
    // }).then((users) =>
    //   users.forEach((user) => {
    //     driver_list.push(user.id);
    //   })
    // );

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      const is_hidden = status == 'hidden' ? true : [true, false];
      const PostStatus = status != 'hidden' ? status : ['request', 'complete'];

      const post_list = await Carpools.findAll({
        where: {
          [Op.and]: [
            { status: PostStatus },
            { type: type || ['rider', 'driver'] },
            {
              kind: kind || [
                'commute',
                'go_work',
                'leave_work',
                'travel',
                'etc',
              ],
            },
            { is_hidden },
          ],
          [Op.or]: [
            {
              title: {
                [Op.iLike]: '%' + searchWord + '%',
              },
            },
          ],
        },
        attributes: [
          'id',
          'user_id',
          'type',
          'title',
          'type',
          'kind',
          'image_url',
          'created_at',
        ],
        include: [
          {
            model: Users,
            as: 'users',
            // where: {
            //   [Op.or]: [
            //     {
            //       title: {
            //         [Op.like]: '%' + searchWord + '%',
            //       },
            //     },
            //   ],
            // },
            attributes: ['id', 'nick_name'],
          },
        ],
      });
      return res.status(200).json({
        code: 200,
        message: '관리자 게시글 조회 성공',
        data: { post_list },
      });
    }

    // 2. 자유 게시글인 경우
    if (category == 'community') {
    }

    // return res.status(200).json({
    //   code: 200,
    //   message: '관리자 게시글 조회 성공',
    //   data: { post_list },
    // });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 관리자 게시글 상세 조회
const getOnePostByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Post']
          #swagger.summary = '관리자 게시글 상세 조회'
          #swagger.description = '관리자 게시글 상세 조회'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 게시글 상세 조회 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 게시글 상세 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 게시글 상세 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { category, post_id } = req.params;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      console.log('carpool');
      const post_list = await Carpools.findOne({
        where: { id: post_id },
        include: [
          { model: Users, as: 'users', attributes: ['id', 'nick_name'] },
        ],
      });
      return res.status(200).json({
        code: 200,
        message: '관리자 게시글 상세 조회 성공',
        data: { post_list },
      });
    }

    // 2. 자유 게시글인 경우
    if (category == 'community') {
      console.log('community');
      const post_list = await Communities.findOne({
        where: { id: post_id },
        include: [
          { model: Users, as: 'users', attributes: ['id', 'nick_name'] },
        ],
      });
      return res.status(200).json({
        code: 200,
        message: '관리자 게시글 상세 조회 성공',
        data: { post_list },
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 관리자 게시글 숨김/ 복구
const hidePostByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Post']
          #swagger.summary = '관리자 게시글 숨김'
          #swagger.description = '관리자 게시글 숨김'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 게시글 숨김 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 게시글 숨김 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 게시글 숨김 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { category, post_id } = req.params;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      console.log('carpool');
      const carpool = await Carpools.findOne({
        where: { id: post_id },
        attributes: ['is_hidden'],
      });

      await Carpools.update(
        {
          is_hidden: !carpool.is_hidden,
        },
        { where: { id: post_id } }
      );
    }

    // 2. 자유 게시글인 경우
    if (category == 'community') {
      const community = await Communities.findOne({
        where: { id: post_id },
        attributes: ['is_hidden'],
      });

      await Communities.update(
        {
          is_hidden: !community.is_hidden,
        },
        { where: { id: post_id } }
      );
    }
    return res.status(200).json({
      code: 200,
      message: '관리자 게시글 숨김/복구 성공',
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getAllPostsByAdmin,
  getOnePostByAdmin,
  hidePostByAdmin,
};
