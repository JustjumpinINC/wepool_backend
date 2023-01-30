const { getGoodReivew } = require('../../../../src/reviewCount');
const { info } = require('aws');
const { Op } = require('sequelize');

const {
  Users,
  UserCars,
  Carpools,
  Communities,
  CarpoolLikes,
  CommunityLikes,
  CarpoolUsers,
  CarpoolBanLogs,
  CommunityBanLogs,
  UserLocations,
  sequelize,
} = require('../../../../models');

// 모든 게시글 조회(보류)
const getAllPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '모든 게시글 조회'
        #swagger.description = '모든 게시글 조회 (보류)'

    /*  #swagger.parameters['Carpool Type'] = {  
            in: 'query',
            name: 'type',
            description: '카풀: 탈래요(rider)/ 타세요(driver) | 낙서장: 자유(free)',
            type: 'string'} 

    /*  #swagger.parameters['Carpool Arrival'] = {  
            in: 'query',
            name: 'arrival',
            description: '도착지',
            type: 'string'} 
                  
    /*  #swagger.parameters['Carpool Gender'] = {  
            in: 'query',
            name: 'gender',
            description: '성별: female/ male',
            type: 'string'} 
        
    /*  #swagger.parameters['Carpool Kind'] = {  
            in: 'query',
            name: 'kind',
            description: '카풀 종류: 출퇴근(commute)/ 출근(go_work)/ 퇴근(leave_work)/ 여행(travel)/ 기타(etc) ',
            type: 'string'} 
    
    /*  #swagger.parameters['Carpool Search'] = {  
            in: 'query',
            name: 'search',
            description: '검색',
            type: 'string'} 
            
    /*  #swagger.parameters['Carpool Page'] = {  
            in: 'query',
            name: 'page',
            description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
            type: 'integer'} 

    /*  #swagger.responses[200] =  {  
            description: '모든 게시글 조회 성공',
            schema: {   "code" : 200,
                        "message" : "모든 게시글 조회 성공",        
                        "data": { $ref: '#/components/schemas/Post/post_main' }}}

    /*  #swagger.responses[400] = { 
            description: '모든 게시글 조회 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category } = req.params;
    let { type, arrival, gender, kind, search, page } = req.query;

    const postPage = !page ? 0 : page;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      console.log('카풀 게시글인 경우');

      // 1-1. 회원 출발지 조회
      const start_location = await UserLocations.findOne({
        where: { user_id, start_selected: true },
        attributes: ['id', 'location_name', 'latitude', 'longitude'],
      });

      // [오류] 선택된 주소/ 등록된 주소가 없는 경우
      if (!start_location) {
        console.log('user_id :', user_id);
        throw new Error('선택된 출발지가 없습니다.');
      }

      console.log(
        '회원 출발지 주소: ',
        start_location.location_name + ' ' + start_location.address_detail,
        '| 위도: ',
        start_location.latitude,
        '| 경도: ',
        start_location.longitude
      );

      const distance = user.distance;
      const user_start_latitude = start_location.latitude;
      const user_start_longitude = start_location.longitude;

      // 최단거리(haversine) 공식 (출발지 기준)
      // Miles: 3959 / Kilometer: 6371
      // 아래의 start_latitude, start_longitude 는 Carpools의 DB테이블의 콜롬을 의미한다.
      const start_haversine = `(
        6371 * acos(
            cos(radians(${user_start_latitude}))
            * cos(radians(start_latitude))
            * cos(radians(start_longitude) - radians(${user_start_longitude}))
            + sin(radians(${user_start_latitude})) * sin(radians(start_latitude))
        )
    )`;

      // 1-2.회원 도착지 조회
      let arrival_location;
      let arrival_location_list = [];

      let user_arrival_latitude;
      let user_arrival_longitude;
      let arrival_haversine;
      let haversine_code;
      let titleSearch = !search ? '' : search;

      // 2-1.도착지가 없는 경우
      if (!arrival) {
        await Carpools.findAll({}).then((arrivals) => {
          console.log('도착지가 없는 경우');
          for (arrival of arrivals) {
            arrival_location_list.push(arrival.arrive_address);
          }

          haversine_code = sequelize.where(
            sequelize.literal(start_haversine),
            '<=',
            distance
          );
        });

        // 2-2.도착지가 있는 경우
      } else {
        console.log('도착지가 있는 경우');
        arrival_location = await UserLocations.findOne({
          where: { arrive_selected: true },
        });

        user_arrival_latitude = arrival_location.latitude;
        user_arrival_longitude = arrival_location.longitude;

        // 최단거리(haversine) 공식 (도착지 기준)
        arrival_haversine = `(
          6371 * acos(
              cos(radians(${user_arrival_latitude}))
              * cos(radians(arrive_latitude))
              * cos(radians(arrive_longitude) - radians(${user_arrival_longitude}))
              + sin(radians(${user_arrival_latitude})) * sin(radians(arrive_latitude))
          )
      )`;

        (haversine_code = sequelize.where(
          sequelize.literal(start_haversine),
          '<=',
          distance
        )),
          sequelize.where(sequelize.literal(arrival_haversine), '<=', distance);
      }

      // 3. 출발 위치에서 반경거리 위치한 주소 조회 (기본: 3km)
      'image_url',
        console.log(
          'haversine_code: ',
          haversine_code,
          'type: ',
          type,
          'kind: ',
          kind,
          'search: ',
          search,
          'titleSearch: ',
          titleSearch
        );
      const carpool_list = await Carpools.findAll({
        attributes: [
          'id',
          'user_id',
          'type',
          'kind',
          'title',
          'start_address',
          'arrive_address',
          'start_date',
          'price',
          'image_url',
          [sequelize.literal(start_haversine), 'user_carpool_start_distance'],
        ],
        where: {
          [Op.and]: [
            haversine_code,
            { status: 'request' },
            { is_hidden: false },
            { type: type || 'rider' },
            {
              kind: kind || [
                'commute',
                'go_work',
                'leave_work',
                'travel',
                'etc',
              ],
            },
          ],
          [Op.or]: [
            {
              title: {
                [Op.like]: '%' + titleSearch + '%',
              },
            },
          ],
        },
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'nick_name'],
            where: {
              gender: gender || ['MALE', 'FEMALE'],
            },
          },
        ],

        // 최신 순
        order: [['created_at', 'DESC']],
        // 거리순
        // order: sequelize.col('distance'),
        limit: 20,
        offset: postPage * 20,
      });

      // 주소 횟수 카운팅
      await UserLocations.update(
        { total_use_count: start_location.total_use_count + 1 },
        { where: { id: start_location.id } }
      );

      return res.status(200).json({
        code: 200,
        message: '모든 게시물 조회 성공',
        data: { user, carpool_list },
      });
    }

    // 2. 낙서장 게시글인 경우
    if (category == 'community') {
      console.log('낙서장 게시글인 경우');
      const community_list = await Communities.findAll({
        where: { is_hidden: false },
        include: [
          {
            model: Users,
            as: 'users',
            attributes: [
              'id',
              'email',
              'nick_name',
              'gender',
              'distance',
              'profile_image_url',
              'is_smoke',
            ],
          },
        ],
        limit: 20,
        offset: postPage * 20,
      });

      return res.status(200).json({
        code: 200,
        message: '모든 게시물 조회 성공',
        data: { user, community_list },
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 특정 게시물 조회
const getOnePost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '특정 게시물 조회'
        #swagger.description = '특정 게시물 조회' */

  /*  #swagger.responses[200] =  {  
            description: '특정 게시물 조회 성공',
            schema: {   "code" : 200,
                        "message" : "특정 게시물 조회 성공",        
                        "data": { $ref: '#/components/schemas/Post/post_detail' }}}

    /*  #swagger.responses[400] = { 
            description: '특정 게시물 조회 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category, post_id } = req.params;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      console.log('카풀 게시글인 경우');
      await Carpools.findOne({
        where: { id: post_id },
        attributes: [
          'id',
          'user_id',
          'status',
          'type',
          'kind',
          'title',
          'start_address',
          'start_latitude',
          'start_longitude',
          'arrive_address',
          'arrive_latitude',
          'arrive_longitude',
          'start_date',
          'content',
          'price',
          'image_url',
          'is_hidden',
          'view_count',
          'created_at',
          'updated_at',
        ],
      }).then(async (carpool) => {
        // [오류] 해당 게시글이 없는 경우
        if (!carpool) {
          throw new Error('해당 게시글은 없습니다.');
        }

        if (carpool.is_hidden) {
          throw new Error('해당 게시글은 삭제되었습니다.');
        }

        // 1-1. 조회 횟수 업데이트
        const view_count = carpool.view_count + 1;
        await Carpools.update({ view_count }, { where: { id: post_id } });

        // 1-2. 게시글 좋아요 갯수 조회
        const like_count = await CarpoolLikes.findAll({
          where: { id: post_id },
        });

        // 1-3. 작성자 좋은 리뷰 조회
        const good_review_count = await getGoodReivew(user_id);

        // 1-4. 작성자 조회
        const userInfo = await Users.findByPk(carpool.user_id);
        const users = {
          user_id: userInfo.id,
          profile_image_url: userInfo.profile_image_url,
          nick_name: userInfo.nick_name,
          is_smoke: userInfo.is_smoke,
          gender: userInfo.gender,
          good_review_count,
        };

        // 작성자 인증 완료 조회   =======================> 추후 작업

        return res.status(200).json({
          code: 200,
          message: '특정 게시물 조회 성공',
          data: {
            user,
            carpool,
            like_count: like_count.length,
            users,
          },
        });
      });
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      console.log('커뮤니티 게시글인 경우');
      await Communities.findOne({
        where: { id: post_id },
        attributes: [
          'id',
          'user_id',
          'type',
          'title',
          'content',
          'image_url',
          'is_hidden',
          'view_count',
          'created_at',
          'updated_at',
        ],
      }).then(async (community) => {
        // [오류] 해당 게시글이 없는 경우
        if (!community) {
          throw new Error('해당 게시글은 없습니다.');
        }

        if (community.is_hidden) {
          throw new Error('해당 게시글은 삭제되었습니다.');
        }

        // 2-1. 조회 횟수 업데이트
        const view_count = community.view_count + 1;
        await Communities.update({ view_count }, { where: { id: post_id } });

        // 2-2. 게시글 좋아요 갯수 조회
        const like_count = await CommunityLikes.findAll({
          where: { id: post_id },
        });

        // 2-3. 작성자 좋은 리뷰 조회
        const good_review_count = await getGoodReivew(user_id);

        // 2-4. 작성자 조회
        const userInfo = await Users.findByPk(community.user_id);
        const users = {
          user_id: userInfo.id,
          profile_image_url: userInfo.profile_image_url,
          nick_name: userInfo.nick_name,
          is_smoke: userInfo.is_smoke,
          gender: userInfo.gender,
          good_review_count,
        };

        return res.status(200).json({
          code: 200,
          message: '특정 게시물 조회 성공',
          data: { user, community, like_count: like_count.length, users },
        });
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시글 작성
const createPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 작성'
        #swagger.description = '게시글 작성' */

  /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Post/create_post'  }} 

    /*  #swagger.responses[201] =  {  
            description: '게시글 작성 성공',
            schema: {   "code" : 201, "message" : "게시글 작성 성공" }}

    /*  #swagger.responses[400] = { 
            description: '게시글 작성 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category } = req.params;
    const { type, kind, title, start_date, content, price, image_url } =
      req.body;
    const {
      start_address,
      start_latitude,
      start_longitude,
      arrive_address,
      arrive_latitude,
      arrive_longitude,
    } = req.body;

    // 1. 카풀 게시글인 경우
    // 1-1. 중복된 게시글 조회
    if (category == 'carpool') {
      // 1-1. 중복된 게시글 조회
      const carpool = await Carpools.findAll({
        where: {
          user_id,
          type,
          title,
          content,
          image_url,
          kind,
          price,
          start_address,
          arrive_address,
        },
      });

      // [오류] 카풀 게시글이 있는 경우
      if (carpool.length > 0) {
        throw new Error('중복된 내용이 존재합니다');
      }

      // [오류] 타세요 작성시, 작성자가 차등록이 안된 경우
      if (type == 'driver') {
        await UserCars.findOne({ where: { user_id } }).then((car) => {
          if (!car) {
            throw new Error('차 등록이 필요합니다.');
          }
        });
      }

      // 1-2. 카풀 게시글 생성
      Carpools.create({
        user_id,
        type,
        kind,
        title,
        start_date,
        content,
        price,
        image_url,
        start_address,
        start_latitude,
        start_longitude,
        arrive_address,
        arrive_latitude,
        arrive_longitude,
      })
        .then(() => {
          return res
            .status(200)
            .json({ code: 200, message: '게시글 작성 성공' });
        })
        .catch((error) => {
          // [오류] 시퀄라이즈 오류
          if (error.name == 'SequelizeValidationError') {
            return res.status(400).json({
              code: 400,
              message: '올바르지 않는 정보: ' + error.errors[0].message,
            });
          }
        });
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      const community = await Communities.findAll({
        where: {
          user_id,
          type,
          title,
          content,
          image_url,
        },
      });

      // [오류] 카풀 게시글이 있는 경우
      if (community.length > 0) {
        throw new Error('중복된 내용이 존재합니다');
      }

      // 2-2. 커뮤니티 게시글 생성
      Communities.create({
        user_id,
        type,
        title,
        content,
        image_url,
      })
        .then(() => {
          return res
            .status(200)
            .json({ code: 200, message: '게시글 작성 성공' });
        })
        .catch((error) => {
          // [오류] 시퀄라이즈 오류
          if (error.name == 'SequelizeValidationError') {
            return res.status(400).json({
              code: 400,
              message: '올바르지 않는 정보: ' + error.errors[0].message,
            });
          }
        });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시글 수정
const editPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 수정'
        #swagger.description = '게시글 수정' */

  /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Post/create_post'  }} 

    /*  #swagger.responses[200] =  {  
            description: '게시글 수정 성공',
            schema: {   "code" : 200,
                        "message" : "게시물 수정 성공"}}

    /*  #swagger.responses[400] = { 
            description: '조회 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const { category, post_id } = req.params;
    const { type, kind, title, start_date, content, price, image_url } =
      req.body;
    const {
      start_address,
      start_latitude,
      start_longitude,
      arrive_address,
      arrive_latitude,
      arrive_longitude,
    } = req.body;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      console.log(1);
      // [오류] 게시글이 없는 경우 / 게시글이 가려진 경우
      const existCarpool = await Carpools.findByPk(post_id);
      if (!existCarpool || existCarpool.is_hidden) {
        throw new Error('해당 내용이 없습니다.');
      }

      // [오류] 게시글 작성자가 아닌 경우
      if (existCarpool.user_id !== user.id) {
        throw new Error('해당 권한이 없습니다.');
      }

      // 게시글 수정
      await Carpools.update(
        {
          type,
          kind,
          title,
          start_date,
          content,
          price,
          image_url,
          start_address,
          start_latitude,
          start_longitude,
          arrive_address,
          arrive_latitude,
          arrive_longitude,
        },
        { where: { id: post_id, user_id: existCarpool.user_id } }
      );
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      // [오류] 게시글이 없는 경우 / 게시글이 가려진 경우
      const existCommunity = await Communities.findByPk(post_id);
      if (!existCommunity || existCommunity.is_hidden) {
        throw new Error('해당 내용이 없습니다.');
      }

      console.log(existCommunity.user_id, user.id);
      // [오류] 게시글 작성자가 아닌 경우
      if (existCommunity.user_id !== user.id) {
        throw new Error('해당 권한이 없습니다.');
      }

      // 게시글 수정
      await Communities.update(
        {
          type,
          title,
          content,
          image_url,
        },
        { where: { id: post_id, user_id: existCommunity.user_id, type } }
      );
    }

    return res.status(200).json({ code: 200, message: '게시글 수정', user });
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시글 매칭
const matchPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 매칭'
        #swagger.description = '게시글 매칭' */

  /*  #swagger.responses[200] =  {  
            description: '게시글 매칭 성공',
            schema: {   "code" : 200, "message" : "게시글 매칭 성공" }}

    /*  #swagger.responses[400] = { 
            description: '게시글 매칭 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { carpool_id } = req.params;

    const carpool = await Carpools.findByPk(carpool_id);
    const exitMatch = await CarpoolUsers.findOne({
      where: {
        [Op.and]: [{ user_id, carpool_id }],
      },
    });

    // 아래의 읽는 순서 중요함.
    // 1. [오류] 매칭할 게시글이 없는 경우
    if (!carpool || carpool.is_hidden) {
      throw new Error('게시글이 없습니다.');
    }

    // 2. [오류] 게시글 작성자인 경우
    if (carpool.user_id == user_id) {
      throw new Error('게시글 작성자입니다.');
    }

    if (carpool.type == 'community') {
      throw new Error('커뮤니티 게시글입니다.');
    }

    // 3. 게시글이 매칭되지 않은 경우 => 매칭
    if (!exitMatch) {
      await CarpoolUsers.create({ user_id, carpool_id });
      return res.status(200).json({ code: 200, message: '게시글 매칭 성공' });
    }

    // 4. [오류] 게시글이 이미 매칭된 경우
    if (exitMatch) {
      throw new Error('이미 매칭되었습니다.');
    }
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시글 신고
const banPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 신고'
        #swagger.description = '게시글 신고' */

  /*	#swagger.parameters['payload'] = {
        in: 'body',
        description: 'Request Body',
        required: true,
        schema: {   $ref: '#/components/schemas/Post/ban_post'  }} 

  /*  #swagger.responses[200] =  {  
        description: '게시글 신고 성공',
        schema: {  "code" : 200, "message" : "게시글 신고 성공" }}

    /*  #swagger.responses[400] = { 
        description: '게시글 신고 실패',
        schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category, post_id } = req.params;
    const { ban_type, reason } = req.body;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      await CarpoolBanLogs.findAll({
        where: { user_id, ban_carpool_id: post_id },
      }).then((carpool) => {
        // [오류] 게시글이 이미 신고된 경우
        if (carpool.length > 0) {
          throw new Error('게시글이 이미 신고되었습니다.');
        }
      });

      // 게시글 신고
      await CarpoolBanLogs.create({
        user_id,
        ban_carpool_id: post_id,
        ban_type,
        reason,
      })
        .then(() => {
          return res
            .status(200)
            .json({ code: 200, message: '게시글 신고 성공' });
        })
        .catch((error) => {
          // [오류] 시퀄라이즈 오류
          if (error.name == 'SequelizeValidationError') {
            return res.status(400).json({
              code: 400,
              message: '올바르지 않는 정보: ' + error.errors[0].message,
            });
          }
        });
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      await CommunityBanLogs.findAll({
        where: { user_id, ban_community_id: post_id },
      }).then((community) => {
        // [오류] 게시글이 이미 신고된 경우
        if (community.length > 0) {
          throw new Error('게시글이 이미 신고되었습니다.');
        }
      });

      // 게시글 신고
      await CommunityBanLogs.create({
        user_id,
        ban_community_id: post_id,
        ban_type,
        reason,
      })
        .then(() => {
          return res
            .status(200)
            .json({ code: 200, message: '게시글 신고 성공' });
        })
        .catch((error) => {
          // [오류] 시퀄라이즈 오류
          if (error.name == 'SequelizeValidationError') {
            return res.status(400).json({
              code: 400,
              message: '올바르지 않는 정보: ' + error.errors[0].message,
            });
          }
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시글 찜하기 on/off
const likePost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 찜하기 on/off'
        #swagger.description = '게시글 찜하기 on/off' */

  /*  #swagger.responses[200] =  {  
            description: '게시글 찜하기 on/off 성공',
            schema: {   "code" : 200, "message" : "게시글 찜하기 on/off 성공" }}

    /*  #swagger.responses[400] = { 
            description: '게시글 찜하기 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category, post_id } = req.params;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      const exitLike = await CarpoolLikes.findOne({
        where: { user_id, carpool_id: post_id },
      });

      if (exitLike) {
        await CarpoolLikes.destroy({
          where: { carpool_id: post_id, user_id },
        }).then(
          res
            .status(200)
            .json({ code: 200, message: '게시글 찜하기 삭제 성공' })
        );
        return;
      }

      const carpool = await Carpools.findByPk(post_id);

      // 1-1. 작성자 본인이 경우
      if (carpool.user_id == user_id) {
        await CarpoolLikes.create({
          user_id,
          carpool_id: post_id,
          is_checked: true,
        });
      } else {
        // 1-2. 외부인의 경우
        await CarpoolLikes.create({ user_id, carpool_id: post_id });
      }
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      const exitLike = await CommunityLikes.findOne({
        where: { user_id, community_id: post_id },
      });

      if (exitLike) {
        await CommunityLikes.destroy({
          where: { community_id: post_id, user_id },
        }).then(
          res
            .status(200)
            .json({ code: 200, message: '게시글 찜하기 삭제 성공' })
        );
        return;
      }

      const carpool = await Communities.findByPk(post_id);

      // 2-1. 작성자 본인이 경우
      if (carpool.user_id == user_id) {
        await CommunityLikes.create({
          user_id,
          community_id: post_id,
          is_checked: true,
        });
      } else {
        // 2-2. 외부인의 경우
        await CommunityLikes.create({ user_id, community_id: post_id });
      }
    }

    return res.status(200).json({ code: 200, message: '게시글 찜하기 성공' });
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

//  게시글 삭제
const deletePost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = ' 게시글 삭제'
        #swagger.description = ' 게시글 삭제' */

  /*  #swagger.responses[201] =  {  
            description: ' 게시글 삭제 성공',
            schema: {   "code" : 200,  "message" : "게시글 삭제 성공"  }}}

    /*  #swagger.responses[400] = { 
            description: ' 게시글 삭제 실패',
            schema: {   "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const { category, post_id } = req.params;

    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      // [오류] 내용 또는 권한이 없는 경우
      await Carpools.findByPk(post_id).then((carpool) => {
        if (!carpool || carpool.is_hidden) {
          throw new Error('해당 내용이 없습니다.');
        }
        if (carpool.user_id !== user.id) {
          throw new Error('해당 게시글의 작성자가 아닙니다.');
        }
      });

      // 카풀 게시글 상태변경 => is_hidden = true
      await Carpools.update({ is_hidden: true }, { where: { id: post_id } });
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      // [오류] 내용 또는 권한이 없는 경우
      await Communities.findByPk(post_id).then((community) => {
        if (!community || community.is_hidden) {
          throw new Error('해당 내용이 없습니다.');
        }
        if (community.user_id !== user.id) {
          throw new Error('해당 게시글의 작성자가 아닙니다.');
        }
      });

      // 커뮤니티 게시글 상태변경 => is_hidden = true
      await Communities.update({ is_hidden: true }, { where: { id: post_id } });
    }

    return res.status(200).json({ code: 200, message: '게시글 삭제 성공' });
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getAllPost,
  getOnePost,
  createPost,
  editPost,
  matchPost,
  banPost,
  likePost,
  deletePost,
};
