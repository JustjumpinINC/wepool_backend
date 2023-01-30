const { dayjsTime } = require('../../../../src/dayjsTime');
const { Op } = require('sequelize');
const {
  Carpools,
  Reviews,
  ReviewCategories,
  ReviewIconCategories,
  Users,
  UserLocations,
  UserCars,
  UserCarExteriorImages,
  UserCarInteriorImages,
  CarpoolUsers,
  CarpoolCancels,
  sequelize,
} = require('../../../../models');

// 리뷰 작성
const createReview = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '리뷰 작성'
        #swagger.description = '리뷰 작성'

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_info/create_review'  }}

    /*  #swagger.responses[201] =  {  
            description: '리뷰 작성 성공',
            schema: {   "code" : 200,
                        "message" : "리뷰 작성 성공"}}
                        
    /*  #swagger.responses[400] = { 
            description: '리뷰 작성 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { carpool_id } = req.params;
    const { review_icon, review_icon_categories, content } = req.body;

    const icon_category = {
      별로였어요: 1,
      괜찮았어요: 2,
      최고였어요: 3,
    };

    // [오류] 작성할 카풀 게시글이 없는 경우
    await CarpoolUsers.findOne({
      where: { carpool_id, user_id },
    }).then((carpool) => {
      if (carpool == null) {
        throw new Error('리뷰가 필요한 카풀게시글이 아닙니다.');
      }
    });

    // [오류] 리뷰가 이미 작성되어 있는 경우
    await Reviews.findOne({ where: { carpool_id, user_id } }).then((review) => {
      if (review != null) {
        throw new Error('리뷰가 이미 작성되었습니다.');
      }
    });

    // 1. 오류없으면, 리뷰 생성
    const review = await Reviews.create({ carpool_id, user_id, content });

    // 2. 리뷰 작성자가 Driver/ Rider 인지 구분
    const carpool = await Carpools.findByPk(carpool_id);
    let carpool_type = carpool.type;

    if (carpool.user_id !== user_id) {
      carpool_type = carpool_type == 'driver' ? 'rider' : 'driver';
    }

    // console.log("이 게시물의 작성자 : ", carpool.user_id, "작성자 type: ", carpool.type)
    // console.log("이 게시물의 리뷰의 작성자: ", user_id, "작성자 type: ", carpool_type)

    // 3. 생성된 review_id에 연결하여 category 생성
    const review_categories = await ReviewIconCategories.findAll({
      where: {
        type: carpool.type,
        review_icon_id: icon_category[review_icon],
        category_name: {
          [Op.or]: review_icon_categories,
        },
      },
    });

    let values = [];
    for (category of review_categories) {
      values.push({
        review_id: review.id,
        review_icon_category_id: category.id,
      });
    }
    // console.log(values);

    await ReviewCategories.bulkCreate(values, {
      returning: true,
    });

    return res.status(201).json({ code: 201, message: '리뷰 작성 성공' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 리뷰 조회
const getMyReview = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '리뷰 조회'
        #swagger.description = '리뷰 조회'

    /*  #swagger.responses[200] =  {  
            description: '리뷰 조회 성공',
            schema: {   "code" : 200,
                        "message" : "리뷰 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_info/review_list' }}}

    /*  #swagger.responses[400] = { 
            description: '리뷰 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    // 1. 회원이 작성한 게시글 조회
    let carpool_list = [];
    await Carpools.findAll({
      where: { user_id },
    }).then((carpools) => {
      // [오류] 조회할 게시글이 없는 경우
      if (!carpools || carpools == '') {
        throw new Error('리뷰가 없습니다.');
      }
      for (carpool of carpools) {
        carpool_list.push(carpool.id);
      }
    });

    // 2. 회원이 작성한 게시글의 리뷰ID 조회
    let review_id_list = [];
    await Reviews.findAll({
      where: {
        carpool_id: { [Op.or]: carpool_list },
      },
      attributes: ['id'],
    }).then((reviews) => {
      console.log(reviews);
      // [오류] 조회할 리뷰가 없는 경우
      if (!reviews) {
        throw new Error('리뷰가 없습니다.');
      }
      for (review of reviews) {
        review_id_list.push(review.id);
      }
    });

    console.log(review_id_list);

    // 3. 리뷰ID 기준 조회
    const review_list = await Reviews.findAll({
      where: {
        id: {
          [Op.or]: review_id_list,
        },
      },
      attributes: [
        'id',
        'carpool_id',
        'user_id',
        'content',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'nick_name', 'profile_image_url'],
        },
        {
          model: ReviewCategories,
          as: 'review_categories',
          attributes: ['id'],
          include: [
            {
              model: ReviewIconCategories,
              as: 'review_icon_categories',
              attributes: ['id', 'type', 'category_name'],
            },
          ],
          group: ['review_id'],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: '리뷰 조회 성공',
      data: {
        user, // user: 회원정보
        review_list, //review_list의 user: 리뷰작성자 정보
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 결제 정보 조회
const getMyPayment = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '결제 조회 (보류)'
        #swagger.description = '결제 조회'
    /*  #swagger.responses[200] =  {  
            description: '결제 조회 성공',
            schema: {   "code" : 200,
                        "message" : "결제 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_info/payment_info' }}}
    /*  #swagger.responses[400] = { 
            description: '결제 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 결제 취소
const cancelMyPayment = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '결제 취소 (보류)'
        #swagger.description = '결제 취소'
    /*  #swagger.responses[200] =  {  
            description: '결제 취소 성공',
            schema: {   "code" : 200,
                        "message" : "결제 취소 성공" }}
    /*  #swagger.responses[400] = { 
            description: '결제 취소 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { match_id, status } = req.params;
    const now = await dayjsTime();
    let request_at;
    let complete_at;
    let fail_at;

    // 1. 이용한 카풀 게시글 조회
    const carpool = await CarpoolUsers.findByPk(match_id);

    let values = {
      carpool_user_id: parseInt(match_id),
      status: status,
    };

    // 2-1. 취소 요청의 경우
    if (status == 'request') {
      values.request_at = now;
    }

    console.log(request_at);
    console.log(values);
    // 2.
    await CarpoolCancels.create(values);
    return res.status(200).json({ code: 200, message: '결제 취소 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 내 차 정보 / 드라이버 등록
const setCarInfo = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '내 차 정보 등록'
        #swagger.description = '내 차 정보 등록'
    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_info/register_driver'  }}
    /*  #swagger.responses[201] =  {  
            description: '내 차 정보 / 드라이버 등록 성공',
            schema: {   "code" : 201,
                        "message" : "내 차 정보 등록 성공"}}
    /*  #swagger.responses[400] = { 
            description: '내 차 정보 등록 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { number, user_car_exterior_images, user_car_interior_images } =
      req.body;

    // 1. 회원 차량 찾기
    const user_car = await UserCars.findOne({
      where: {
        user_id,
      },
    });

    let user_car_id;
    // 2. 차량 없으면 생성 / 차량 있으면 변경
    if (user_car == '' || user_car == null) {
      await UserCars.create({ user_id, number }).then(
        (car) => (user_car_id = car.id)
      );
    } else {
      throw new Error('등록된 차가 이미 있습니다.');
      // await UserCars.update({ number }, { where: { user_id } });
      // user_car_id = user_car.id;
    }

    // 이미지 변수 정리
    let exterior_images = [];
    let interior_images = [];

    for (exterior of user_car_exterior_images) {
      exterior_images.push({
        user_car_id,
        image_url: exterior,
      });
    }

    for (interior of user_car_interior_images) {
      interior_images.push({
        user_car_id,
        image_url: interior,
      });
    }

    // 3. exterior 이미지 저장
    await UserCarExteriorImages.bulkCreate(exterior_images, {
      returning: true,
    });

    // 4. interior 이미지 저장
    await UserCarInteriorImages.bulkCreate(interior_images, {
      returning: true,
    });

    return res.status(201).json({ code: 201, message: '내 차 정보 등록 성공' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 내 차 정보 조회
const getCarInfo = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '내 차 정보 조회'
        #swagger.description = '내 차 정보 조회'
    /*  #swagger.responses[200] =  {  
            description: '내 차 정보 조회 성공',
            schema: {   "code" : 200,
                        "message" : "내 차 정보 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_info/driver' }}}
    /*  #swagger.responses[400] = { 
            description: '내 차 정보 조회 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    const car_info = await UserCars.findOne({
      where: { user_id },
      attributes: ['id', 'user_id', 'number', 'created_at', 'updated_at'],
      include: [
        {
          model: UserCarExteriorImages,
          as: 'user_car_exterior_images',
          attributes: ['id', 'image_url', 'created_at', 'updated_at'],
        },
        {
          model: UserCarInteriorImages,
          as: 'user_car_interior_images',
          attributes: ['id', 'image_url', 'created_at', 'updated_at'],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: '내 차 정보 조회 성공',
      data: { user, car_info },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 인증 조회
const getMyAuth = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '인증 조회'
        #swagger.description = '인증 조회 (보류)'
    /*  #swagger.responses[200] =  {  
            description: '인증 조회 성공',
            schema: {   "code" : 200,
                        "message" : "인증 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_info/my_auth' }}}
    /*  #swagger.responses[400] = { 
            description: '인증 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    return res.status(200).json({ code: 200, message: '인증 조회 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 인증 수정 (보류)
const editMyAuth = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '인증 수정 (보류)'
        #swagger.description = '인증 수정'
    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_info/edit_my_auth' }}
    /*  #swagger.responses[200] =  {  
            description: '인증 수정 성공',
            schema: {   "code" : 200,
                        "message" : "인증 수정 성공",
                        "data": { $ref: '#/components/schemas/Mypage_info/my_auth' }}}
    /*  #swagger.responses[400] = { 
            description: '인증 수정 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    return res.status(200).json({ code: 200, message: '인증 수정 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 주소 등록
const registerAddress = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '주소 등록'
        #swagger.description = '주소 등록'

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {  $ref: '#/components/schemas/Mypage_info/set_address'  }}

    /*  #swagger.responses[201] =  {  
            description: '주소 등록 성공',
            schema: {   "code" : 201, "message" : "주소 등록 성공"}}

    /*  #swagger.responses[400] = { 
            description: '주소 등록 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { location_name, address, address_detail, latitude, longitude } =
      req.body;

    // 1. location_name 중복될때 => 주소 등록 불가
    const myDuplicateAddress = await UserLocations.findOrCreate({
      where: {
        user_id,
        location_name,
      },
      defaults: { address, address_detail, latitude, longitude },
    });

    // [오류] 주소 이름이 중복된 경우
    if (myDuplicateAddress[1] == false) {
      throw new Error('중복된 주소 이름이 존재합니다.');
    }

    return res.status(201).json({ code: 201, message: '주소 등록 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 주소 조회
const getAddress = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '주소 조회'
        #swagger.description = '주소 조회'
        
    /*  #swagger.responses[200] =  {  
            description: '주소 조회 성공',
            schema: {   "code" : 200,
                        "message" : "주소 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_info/address_list' }}}

    /*  #swagger.responses[400] = { 
            description: '주소 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    const address_list = await UserLocations.findAll({
      where: { user_id },
      attributes: [
        'id',
        'location_name',
        'address',
        'address_detail',
        'start_selected',
        'arrive_selected',
      ],
    });

    return res
      .status(200)
      .json({ code: 200, message: '주소 조회 성공', data: { address_list } });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 주소 삭제
const deleteAddress = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '주소 삭제'
        #swagger.description = '주소 삭제'

    /*  #swagger.responses[200] =  {  
            description: '주소 삭제 성공',
            schema: {   "code" : 200, "message" : "주소 삭제 성공"}}

    /*  #swagger.responses[400] = { 
            description: '주소 삭제 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { address_id } = req.params;

    await UserLocations.findByPk(address_id).then((location) => {
      if (!location) {
        throw new Error('해당 주소를 찾을 수 없습니다.');
      }
    });

    // 1. [오류] 주소 등록시 회원정보가 일치하지 않는 경우
    await UserLocations.findAll({
      where: { user_id },
    }).then((addresses) => {
      if (addresses.length == 1) {
        throw new Error('주소 1개 이상인 경우만 삭제 가능합니다.');
      }
    });

    // 2. 주소가 출발지 선택된 경우, total_user_count가 높은 주소로 출발지 선택
    await UserLocations.findByPk(address_id).then((selectedAddress) => {
      if (selectedAddress.start_selected == true) {
        // 2-1. 선택한 주소지 삭제
        UserLocations.destroy({ where: { id: address_id } });

        // 2-2. 사용성이 높은 주소지 조회 및 수정
        UserLocations.findAll({
          where: { user_id },
          order: sequelize.literal('max(total_use_count) DESC'),
          group: ['id'],
          limit: 1,
        }).then((address) => {
          console.log(address);
          address[0].set({ start_selected: true, arrive_selected: false });
          address[0].save();
        });
      }
    });

    // 3. 주소 1개 이상인 경우, 주소 삭제
    console.log(' 주소 1개 이상, 삭제됨~');
    await UserLocations.destroy({ where: { id: address_id } });

    return res.status(200).json({ code: 200, message: '주소 삭제 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 주소 선택
const selectAddress = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Info']
        #swagger.summary = '주소 선택'
        #swagger.description = '주소 선택'

    /*  #swagger.responses[200] =  {  
            description: '주소 선택 성공',
            schema: {   "code" : 200, "message" : "주소 선택 성공"}}

    /*  #swagger.responses[400] = { 
            description: '주소 선택 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { type, address_id } = req.params; // type= 'start/arrive'

    const selectedLocation = {
      start: 'start_selected',
      arrive: 'arrive_selected',
    };

    // 1. 출발지 선택하는 경우
    if (selectedLocation[type] == 'start_selected') {
      console.log(1);
      // 모든 출발지 주소 => false로 상태 변경
      await UserLocations.update(
        { start_selected: false },
        {
          where: { user_id },
        }
      );

      // 선택한 출발지 주소 => true로 상태 변경
      await UserLocations.update(
        { start_selected: true },
        {
          where: {
            id: address_id,
          },
        }
      );
    }

    // 2. 도착지 선택하는 경우
    if (selectedLocation[type] == 'arrive_selected') {
      // 모든 도착지 주소 => false로 상태 변경
      await UserLocations.update(
        { arrive_selected: false },
        {
          where: { user_id },
        }
      );

      // 선택한 출발지 주소 => true로 상태 변경
      await UserLocations.update(
        { arrive_selected: true },
        {
          where: {
            id: address_id,
          },
        }
      );
    }

    // // 모든 주소 => false로 상태 변경
    // await UserLocations.update(
    //   { is_selected: false },
    //   {
    //     where: { user_id },
    //   }
    // );

    // // 선택한 주소 => true로 상태 변경
    // await UserLocations.update(
    //   { is_selected: true },
    //   {
    //     where: {
    //       id: address_id,
    //     },
    //   }
    // );

    return res.status(200).json({ code: 200, message: '주소 선택 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  createReview,
  getMyReview,
  getMyPayment,
  cancelMyPayment,
  setCarInfo,
  getCarInfo,
  getMyAuth,
  editMyAuth,
  registerAddress,
  getAddress,
  deleteAddress,
  selectAddress,
};
