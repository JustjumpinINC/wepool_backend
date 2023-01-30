const { AppIntegrations } = require('aws-sdk');
const { boolean, string } = require('joi');
const swaggerAutogen = require('swagger-autogen')();
const user = require('./swagger/user');

const doc = {
  info: {
    title: 'Wepool Spec',
    description: 'Wepool API documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },

  components: {
    schemas: {
      // 회원인증 (User)====================================//
      // 회원인증_응답
      User: {
        user_info: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'email@email.com' },
                nick_name: { type: 'string', example: '닉네임' },
                gender: { type: 'string', example: 'FEMALE' },
                distance: { type: 'integer', example: 1 },
                profile_image_url: { type: 'string', example: 'image_url' },
                is_smoke: { type: 'boolean', example: true },
                is_chat_push: { type: 'boolean', example: false },
                is_carpool_push: { type: 'boolean', example: false },
                login_count: { type: 'integer', example: 1 },
              },
            },
            alarms: {
              type: 'object',
              properties: {
                carpool_likes_alarm: { type: 'integer', example: 2 },
                community_likes_alarm: { type: 'integer', example: 2 },
                chat_alarm: { type: 'integer', example: 7 },
              },
            },
          },
        },

        // 회원인증_로그인_요청
        login: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'email@email.com' },
            password: { type: 'string', example: '비밀번호' },
          },
        },

        // 회원인증_회원가입_요청
        singup: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'email@email.com' },
            nick_name: { type: 'string', example: '날아가는 짱구' },
            gender: { type: 'string', example: 'FEMALE' },
            is_smoke: { type: 'boolean', example: 'true' },
            address: { type: 'string', example: '서울시 동작구 대방동' },
            address_detail: { type: 'string', example: '다이소' },
            latitude: { type: 'integer', example: 12341.1234 },
            longitude: { type: 'integer', example: 12341.1234 },
          },
        },

        // 마이페이지 다른회원 조회_응답
        userpage: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                user_id: { type: 'integer', example: 3 },
                profile_image_url: {
                  type: 'string',
                  example: 'profile_image_url',
                },
                nick_name: { type: 'string', example: '닉네임' },
                is_smoke: { type: 'boolean', example: true },
                gender: { type: 'string', example: 'male' },
                good_review_count: { type: 'integer', example: 2 },
              },
            },
            auth_list: {
              type: 'array',
              example: [
                { self_auth: true },
                { crime_history: true, total_crime: 2 },
                { drive_lisence: true },
                { car_register: true },
                { car_insurance: false },
              ],
            },
            car: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 3 },
                user_id: { type: 'integer', example: 3 },
                number: { type: 'string', example: '125 가 1111' },
                created_at: { type: 'date', example: '2022-02-02 22:22:22' },
                updated_at: { type: 'date', example: '2022-02-02 22:22:22' },
                user_car_exterior_images: {
                  type: 'array',
                  example: [
                    { image_url: 'exterior_image_url_4' },
                    { image_url: 'exterior_image_url_5' },
                    { image_url: 'exterior_image_url_6' },
                  ],
                },
                user_car_interior_images: {
                  type: 'array',
                  example: [
                    { image_url: 'interior_image_url_4' },
                    { image_url: 'interior_image_url_5' },
                    { image_url: 'interior_image_url_6' },
                  ],
                },
              },
            },
            review_list: {
              type: 'array',
              example: [
                {
                  id: 1,
                  carpool_id: 2,
                  user_id: 5,
                  content: '차가 깔끔하고 운전자 분도 너무 친절하셨어요!',
                  created_at: '2022-02-02 22:22:22',
                  updated_at: '2022-02-02 22:22:22',
                  users: {
                    id: 5,
                    nick_name: '닉네임',
                    profile_image_url: 'profile_image_url',
                  },
                  riview_icon_categories: [
                    {
                      id: 12,
                      type: 'driver',
                      category_name: '약속을 잘지킴',
                    },
                    {
                      id: 14,
                      type: 'driver',
                      category_name: '차가 깨끗함',
                    },
                  ],
                },
                {
                  id: 1,
                  carpool_id: 2,
                  user_id: 5,
                  content: '차가 깔끔하고 운전자 분도 너무 친절하셨어요!',
                  created_at: '2022-02-02 22:22:22',
                  updated_at: '2022-02-02 22:22:22',
                  users: {
                    id: 5,
                    nick_name: '닉네임',
                    profile_image_url: 'profile_image_url',
                  },
                  riview_icon_categories: [
                    {
                      id: 12,
                      type: 'driver',
                      category_name: '약속을 잘지킴',
                    },
                    {
                      id: 14,
                      type: 'driver',
                      category_name: '차가 깨끗함',
                    },
                  ],
                },
              ],
            },
          },
        },

        ban_user: {
          type: 'object',
          example: {
            reason: '말이 험악합니다!',
          },
        },
      },

      // 게시글 (Post)====================================//
      Post: {
        // 게시글_메인화면 조회_응답
        post_main: {
          type: 'object',
          properties: {
            carpool_list: {
              type: 'array',
              example: [
                {
                  id: 1,
                  user_id: 3,
                  status: 'complete',
                  type: 'rider',
                  kind: 'commute',
                  title: '제목입니다.',
                  start_address: '출발지, 건대입구역 2번 출구',
                  start_latitude: 12341234.123412,
                  start_longitude: 12341234.123412,
                  arrive_address: '도착지, 광화문역 4번 출구',
                  arrive_latitude: 12341234.123412,
                  arrive_longitude: 12341234.123412,
                  start_date: '2022-02-22 22:22:22',
                  content: '같이 갈 사람.',
                  price: 4000,
                  image_url: 'image_url',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              ],
            },
          },
        },

        // 게시글_디테일화면 조회_응답
        post_detail: {
          type: 'object',
          example: {
            user: {
              id: 1,
              email: 'o119a@naver.com',
              nick_name: '애처로운 사과',
              gender: 'FEMALE',
              distance: 3,
              profile_image_url: 'image_url',
              is_smoke: true,
              is_chat_push: false,
              is_carpool_push: false,
              login_count: 1,
            },
            community: {
              id: 1,
              user_id: 4,
              type: 'free',
              title: '같이 탈래요?3',
              content: '같이 출근합시다.',
              image_url: 'image_url',
              is_hidden: false,
              view_count: 9,
              created_at: '2022-10-18T09:28:59.000Z',
              updated_at: '2022-10-19T06:12:45.000Z',
            },
            like_count: 0,
            users: {
              user_id: 4,
              profile_image_url: null,
              nick_name: '껌씹는 쇼콜라',
              is_smoke: false,
              gender: 'MALE',
              good_review_count: 1,
            },
          },
        },

        // 게시글_작성_요청
        create_post: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'rider' },
            kind: { type: 'string', example: 'commute' },
            title: { type: 'string', example: '제목입니다.' },
            start_address: {
              type: 'string',
              example: '출발지, 건대입구역 2번 출구',
            },
            start_latitude: { type: 'decimal', example: 12341234.123412 },
            start_longitude: { type: 'decimal', example: 12341234.123412 },
            arrive_address: {
              type: 'string',
              example: '도착지, 광화문역 4번 출구',
            },
            arrive_latitude: { type: 'decimal', example: 12341234.123412 },
            arrive_longitude: { type: 'decimal', example: 12341234.123412 },
            start_date: { type: 'date', example: '2022-02-22 22:22:22' },
            content: { type: 'string', example: '내용입니다' },
            price: { type: 'integer', example: 4000 },
            image_url: { type: 'string', example: 'image url' },
          },
        },

        // 게시글_신고_요청
        ban_post: {
          type: 'object',
          properties: {
            ban_type: {
              type: 'enum',
              example:
                'ads(광고) / bad_images(부적절한 사진) / scam(사기 글) / porno(음란물) / etc(기타)',
            },
            resaon: {
              type: 'string',
              example: '[기타로 선택된 경우] 너무 더러웠어요',
            },
          },
        },
      },

      // 마이페이지_메인 (Mypage Main)====================================//
      Mypage_main: {
        // 마이페이지 조회_응답
        mypage: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'test@email.com' },
                nick_name: { type: 'string', example: '닉네임' },
                gender: { type: 'string', example: 'male' },
                distance: { type: 'integer', example: 1 },
                profile_image_url: {
                  type: 'string',
                  example: 'profile_image_url',
                },
                is_smoke: { type: 'boolean', example: true },
                is_chat_push: { type: 'boolean', example: true },
                is_carpool_push: { type: 'boolean', example: false },
                login_count: { type: 'integer', example: 1 },
              },
            },
            count: {
              type: 'object',
              properties: {
                carpool_count: { type: 'integer', example: 3 },
                match_count: { type: 'integer', example: 0 },
                likes_count: { type: 'integer', example: 1 },
              },
            },
            auth_list: {
              type: 'object',
              properties: {
                certi1: { type: 'date', example: '아직 작업중이에요..' },
              },
            },
            car: {
              type: 'object',
              properties: {
                have_car: { type: 'boolean', example: true },
              },
            },
            wage: {
              type: 'object',
              properties: {
                wage_date: { type: 'date', example: '2022-02' },
                wage_paymen: { type: 'integer', example: 200000 },
              },
            },
          },
        },

        // 마이페이지_프로필_응답
        profile: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            profile_image_url: { type: 'string', example: 'profile_image_url' },
            nick_name: { type: 'string', example: '닉네임' },
            is_smoke: { type: 'boolean', example: true },
            gender: { type: 'string', example: 'MALE' },
          },
        },

        // 마이페이지_프로필 수정_요청
        edit_profile: {
          type: 'object',
          properties: {
            profile_image_url: { type: 'string', example: 'profile_image_url' },
            nick_name: { type: 'string', example: '닉네임' },
            is_smoke: { type: 'boolean', example: true },
            gender: { type: 'string', example: 'MALE' },
          },
        },

        // 마이페이지_게시글_응답
        carpool_list: {
          type: 'object',
          example: {
            user: {
              type: 'object',
              example: {
                id: 2,
                email: 'email@email.com',
                nick_name: '놀고싶은 스타벅스',
                gender: 'FEMALE',
                distance: 3,
                profile_image_url: null,
                is_smoke: false,
                is_chat_push: false,
                is_carpool_push: false,
                login_count: 1,
              },
            },
            carpool_list: [
              {
                id: 1,
                createdAt: '2022-02-22 22:22:22',
                updatedAt: '2022-02-22 22:22:22',
                carpool: {
                  id: 1,
                  user_id: 1,
                  status: 'complete',
                  type: 'driver',
                  kind: 'go_work',
                  title: '같이 탈래요?',
                  start_address: '서울',
                  start_latitude: 12344.1412,
                  start_longitude: 1234.112,
                  arrive_address: '경기',
                  arrive_latitude: 12344.1412,
                  arrive_longitude: 12344.1412,
                  start_date: '2022-02-02',
                  content: '같이 출근합시다.',
                  price: 3000,
                  is_hidden: false,
                  view_count: 0,
                  image_url: 'image_url',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              },
              {
                id: 2,
                createdAt: '2022-02-22 22:22:22',
                updatedAt: '2022-02-22 22:22:22',
                carpool: {
                  id: 2,
                  user_id: 1,
                  status: 'complete',
                  type: 'driver',
                  kind: 'go_work',
                  title: '같이 탈래요?',
                  start_address: '서울',
                  start_latitude: 12344.1412,
                  start_longitude: 1234.112,
                  arrive_address: '경기',
                  arrive_latitude: 12344.1412,
                  arrive_longitude: 12344.1412,
                  start_date: '2022-02-02',
                  content: '같이 출근합시다.',
                  price: 3000,
                  image_url: 'image_url',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              },
            ],
          },
        },

        // 마이페이지_이용 내역_응답
        carpool_history: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              example: {
                id: 2,
                email: 'email@email.com',
                nick_name: '놀고싶은 스타벅스',
                gender: 'FEMALE',
                distance: 3,
                profile_image_url: null,
                is_smoke: false,
                is_chat_push: false,
                is_carpool_push: false,
                login_count: 1,
              },
            },
            carpool_list: {
              type: 'array',
              example: [
                {
                  id: 3,
                  carpools: {
                    id: 3,
                    user_id: 2,
                    status: 'request',
                    type: 'driver',
                    kind: 'go_work',
                    title: '같이 탈래요?6',
                    start_address: '출발_경복궁역',
                    start_latitude: '37.5758790000',
                    start_longitude: '126.9735670000',
                    arrive_address: '도착_회사_주변(경기)',
                    arrive_latitude: '37.6483330000',
                    arrive_longitude: '486.8365840000',
                    start_date: '2022-02-01T15:00:00.000Z',
                    content: '같이 출근합시다',
                    price: 3000,
                    image_url: 'image_url',
                    is_hidden: false,
                    view_count: 0,
                    created_at: '2022-10-06T03:53:00.000Z',
                    updated_at: '2022-10-06T03:53:00.000Z',
                    users: {
                      id: 2,
                    },
                    reviews: [],
                  },
                  carpool_cancels: [
                    {
                      id: 1,
                    },
                  ],
                },
                {
                  id: 2,
                  carpools: {
                    id: 1,
                    user_id: 1,
                    status: 'request',
                    type: 'driver',
                    kind: 'go_work',
                    title: '같이 탈래요?7',
                    start_address: '출발_먼곳_주변(부천)',
                    start_latitude: '37.5001510000',
                    start_longitude: '486.7137560000',
                    arrive_address: '도착_회사_주변(경기)',
                    arrive_latitude: '37.6483330000',
                    arrive_longitude: '486.8365840000',
                    start_date: '2022-02-01T15:00:00.000Z',
                    content: '같이 출근합시다.',
                    price: 3000,
                    image_url: 'image_url',
                    is_hidden: false,
                    view_count: 0,
                    created_at: '2022-10-06T03:52:46.000Z',
                    updated_at: '2022-10-06T03:52:46.000Z',
                    users: {
                      id: 1,
                    },
                    reviews: [
                      {
                        id: 1,
                      },
                    ],
                  },
                  carpool_cancels: [
                    {
                      id: 2,
                    },
                  ],
                },
              ],
            },
          },
        },

        // 마이페이지_이용내역 카풀 취소 요청
        cancle_carpool: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example:
                'request   =>status= request(취소 요청) / accept_request(취소 동의) / fail_by_writer(게시자 취소) / fail_by_user(이용자 취소) 로만 입력해주세요.',
            },
            type: {
              type: 'string',
              example:
                'no_reason   => type= no_reason(단순 변심) / user_schedule(갑작스러운 일정변경) / bad_communication(의견 충돌) / bad_manner(비매너) / no_show(약속 불이행) / etc(기타) 로만 입력해주세요.',
            },
          },
        },
      },

      // 마이페이지_정산 (Mypage Wage)====================================//
      Mypage_wage: {
        // 정산 내역_응답
        wagelist: {
          type: 'object',
          properties: {
            wage_date: { type: 'date', example: '2022-02' },
            wage_price: { type: 'integer', example: '10000' },
            wage_list: {
              type: 'array',
              example: [
                {
                  wage_id: 1,
                  carpool_type: 'gohome',
                  price: 3000,
                  created_at: '2022-02-02 22:22:22',
                },
                {
                  wage_id: 2,
                  carpool_type: 'gowork',
                  price: 3000,
                  created_at: '2022-02-02 22:22:22',
                },
              ],
            },
          },
        },

        // 정산 계좌 등록_요청
        set_account: {
          type: 'object',
          properties: {
            account_bank: { type: 'string', example: '우리은행' },
            account_number: { type: 'integer', example: 1002020202010 },
            account_holder: { type: 'string', example: '김위플' },
          },
        },
      },

      // 마이페이지_내정보 (Mypage Info)====================================//
      Mypage_info: {
        // 마이페이지_리뷰_응답
        review_list: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'email@email.com' },
                nick_name: { type: 'string', example: '회원 닉네임' },
                gender: { type: 'string', example: 'FEMALE' },
                distance: { type: 'integer', example: 1 },
                profile_image_url: { type: 'string', example: 'image_url' },
                is_smoke: { type: 'boolean', example: true },
                is_chat_push: { type: 'boolean', example: false },
                is_carpool_push: { type: 'boolean', example: false },
                login_count: { type: 'integer', example: 1 },
              },
            },
            review_list: {
              type: 'array',
              example: [
                {
                  id: 1,
                  carpool_id: 3,
                  user_id: 4,
                  content: '운전자가 친절했어요.',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                  users: {
                    id: 4,
                    nick_name: '리뷰작성자 닉네임4',
                    profile_image_url: 'profile_image_url',
                  },
                  review_categories: [
                    {
                      id: 1,
                      riview_icon_categories: {
                        id: 12,
                        type: 'driver',
                        category_name: '약속을 잘 지킴',
                      },
                    },
                    {
                      id: 2,
                      riview_icon_categories: {
                        id: 14,
                        type: 'driver',
                        category_name: '차가 깨끗함',
                      },
                    },
                  ],
                },
                {
                  id: 3,
                  carpool_id: 1,
                  user_id: 2,
                  content: '운전자가 친절했어요.',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                  users: {
                    id: 4,
                    nick_name: '리뷰작성자 닉네임4',
                    profile_image_url: 'profile_image_url',
                  },
                  review_categories: [
                    {
                      id: 1,
                      riview_icon_categories: {
                        id: 12,
                        type: 'driver',
                        category_name: '약속을 잘 지킴',
                      },
                    },
                    {
                      id: 2,
                      riview_icon_categories: {
                        id: 14,
                        type: 'driver',
                        category_name: '차가 깨끗함',
                      },
                    },
                  ],
                },
              ],
            },
          },
        },

        // 마이페이지_리뷰 작성_요청
        create_review: {
          type: 'object',
          example: {
            review_icon: '최고였어요',
            review_icon_categories: ['차가 깨끗함', '친절함'],
            content: '차가 깔끔하고 운전자 분도 너무 친절하셨어요!',
          },
        },

        // 마이페이지_결제정보_응답
        payment_info: {
          type: 'object',
          properties: {
            post: {
              post_id: { type: 'integer', example: 1 },
              image_url: { type: 'string', example: 'profile_image_url' },
              title: { type: 'string', example: '제목입니다.' },
              departure: { type: 'string', example: '광화문' },
              arrival: { type: 'string', example: '건대' },
              created_at: { type: 'datetime', example: '2022-02-22 22:22:22' },
              matched_at: { type: 'datetime', example: '2022-02-22 22:22:22' },
            },
            user: {
              nickname: { type: 'string', example: '닉네임' },
              phone_number: { type: 'Integer', example: 01012343567 },
            },
            payment: {
              payment_method: { type: 'string', example: '네이버페이' },
              payment_price: { type: 'Integer', example: 5000 },
            },
          },
        },

        // 드라이버_응답
        driver: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'email@email.com' },
                nick_name: { type: 'string', example: '닉네임' },
                gender: { type: 'string', example: 'FEMALE' },
                distance: { type: 'integer', example: 1 },
                profile_image_url: { type: 'string', example: 'image_url' },
                is_smoke: { type: 'boolean', example: true },
                is_chat_push: { type: 'boolean', example: false },
                is_carpool_push: { type: 'boolean', example: false },
                login_count: { type: 'integer', example: 1 },
              },
            },
            car_info: {
              type: 'object',
              example: {
                id: 1,
                user_id: 1,
                number: '000 가 0000',
                created_at: '2022-09-07 22:22:22',
                updated_at: '2022-09-07 22:22:22',
                user_car_exterior_images: [
                  { id: 1, image_url: 'extrior_image_url_1' },
                  { id: 2, image_url: 'extrior_image_url_1' },
                  { id: 3, image_url: 'extrior_image_url_1' },
                ],
                user_car_interior_images: [
                  { id: 1, image_url: 'interior_image_url_1' },
                  { id: 2, image_url: 'interior_image_url_1' },
                  { id: 3, image_url: 'interior_image_url_1' },
                ],
              },
            },
          },
        },

        // 드라이버 등록_요청
        register_driver: {
          type: 'object',
          properties: {
            number: { type: 'string', example: '000 가 0000' },
            user_car_exterior_images: {
              type: 'array',
              example: ['image_url_1', 'image_url_2', 'image_url_3'],
            },
            user_car_interior_images: {
              type: 'array',
              example: ['image_url_1', 'image_url_2', 'image_url_3'],
            },
          },
        },

        // 마이페이지_인증 내역 조회_응답
        my_auth: {
          type: 'object',
          properties: {
            auth_list: {
              type: 'array',
              example: [
                { self_auth: true },
                { crime_history: true, total_crime: 2 },
                { drive_lisence: true },
                { car_register: true },
                { car_insurance: false },
              ],
            },
          },
        },

        // 마이페이지_인증 수정_요청
        edit_my_auth: {
          type: 'object',
          properties: {
            auth_list: {
              type: 'array',
              example: [
                { self_auth: true },
                { crime_history: true, total_crime: 2 },
                { drive_lisence: true },
                { car_register: true },
                { car_insurance: false },
              ],
            },
          },
        },

        // 마이페이지_주소_응답
        address_list: {
          type: 'object',
          properties: {
            address_list: {
              type: 'array',
              example: [
                {
                  id: 1,
                  location_name: '집',
                  address: '서울시 광진구 능동로 10길 10',
                  address_detail: '콘코디언빌딩',
                  start_selected: true,
                  arrive_selected: false,
                },
                {
                  id: 2,
                  location_name: '회사',
                  address: '서울시 광진구 능동로 10길 10',
                  address_detail: '콘코디언빌딩',
                  start_selected: false,
                  arrive_selected: true,
                },
              ],
            },
          },
        },

        // 마이페이지_주소 등록_요청
        set_address: {
          type: 'object',
          properties: {
            location_name: { type: 'string', example: '집' },
            address: {
              type: 'string',
              example: '서울시 광진구 능동로 10길 10',
            },
            address_detail: { type: 'string', example: '콘코디언빌딩' },
            latitude: { type: 'decimal', example: 12341234.123412 },
            longitude: { type: 'decimal', example: 12341234.123412 },
          },
        },
      },

      // 마이페이지_설정 (Mypage Setting)====================================//
      Mypage_setting: {
        // 마이페이지_알람 설정 수정_응답
        alarm: {
          type: 'object',
          properties: {
            alarm: {
              type: 'object',
              properties: {
                is_chat_push: { type: 'boolean', example: true },
                is_capool_push: { type: 'boolean', example: false },
              },
            },
          },
        },

        // 마이페이지_알람 조회_응답
        get_alarm: {
          type: 'object',
          properties: {
            user: {
              type: 'array',
              example: {
                id: 3,
                email: 'email3@email.com',
                nick_name: '찬란한 월요일',
                gender: 'FEMALE',
                distance: 3,
                profile_image_url: 'image_url',
                is_smoke: true,
                is_chat_push: true,
                is_carpool_push: true,
                login_count: 1,
              },
            },
            alarm_list: {
              type: 'array',
              example: [
                {
                  id: 4,
                  users: {
                    id: 2,
                    nick_name: '심란한 수요일',
                    profile_image_url: 'image_url',
                  },
                  carpools: {
                    title: '카풀 게시글 제목',
                  },
                },
                {
                  id: 5,
                  users: {
                    id: 2,
                    nick_name: '심란한 수요일',
                    profile_image_url: 'image_url',
                  },
                  communities: {
                    title: '낙서장 게시글 제목',
                  },
                },
              ],
            },
          },
        },

        // 마이페이지_알람 설정 수정_응답
        edit_alarm: {
          type: 'object',
          properties: {
            is_chat_push: { type: 'boolean', example: true },
            is_capool_push: { type: 'boolean', example: false },
          },
        },

        // 마이페이지_공지사항 조회_응답
        notice_list: {
          type: 'object',
          properties: {
            notices: {
              type: 'array',
              example: [
                {
                  id: 1,
                  title: '1월 26일 오후 11시 서버 점검 안내',
                  content: '내용입니다.',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
                {
                  id: 1,
                  title: '출석체크 이벤트 당첨자 안내',
                  content: '내용입니다.',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              ],
            },
          },
        },

        // 마이페이지_공지사항 조회_자세히_응답
        notice: {
          type: 'object',
          properties: {
            notice: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                title: {
                  type: 'string',
                  example: '1월 26일 오후 11시 서버 점검 안내',
                },
                content: { type: 'string', example: '내용입니다.' },
                created_at: {
                  type: 'datetime',
                  example: '2022-02-22 22:22:22',
                },
                updated_at: {
                  type: 'datetime',
                  example: '2022-02-22 22:22:22',
                },
              },
            },
          },
        },

        // 마이페이지_문의하기 조회_응답
        contact_us: {
          type: 'object',
          properties: {
            contact_info: {
              type: 'array',
              example: [
                {
                  id: 1,
                  type: 'call',
                  info: '02-6953-4977',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
                {
                  id: 2,
                  type: 'email',
                  info: 'help@jumpin.co.kr',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              ],
            },
          },
        },

        // 마이페이지_문의하기 수정 (보류)
        edit_contact_us: {
          type: 'object',
          properties: {
            info: { type: 'string', example: '02-6953-4977' },
          },
        },

        // 마이페이지_서비스 약관 조회
        get_service: {
          type: 'object',
          properties: {
            service: {
              type: 'array',
              example: [
                {
                  id: 1,
                  title: '개인정보 제공 및 위탁 동의서',
                  created_at: '2022-02-22 22:22:22',
                  updated_at: '2022-02-22 22:22:22',
                },
              ],
            },
          },
        },

        // 마이페이지_서비스 약관 조회_자세히
        get_service: {
          type: 'object',
          properties: {
            service: {
              type: 'object',
              example: {
                id: 1,
                title: '개인정보 제공 및 위탁 동의서',
                content:
                  '제1조 개인정보 처리 및 제공\n          ① 회사는 고객의 개인정보를 서비스이용약관 및 개인정보처리방침의 「개인정보의 수집목적 및 이용목적」에서 고지한 범위 또는 서비스이용약관에 명시한 범위 내에서 사용하며, 동 범위를 넘어 이용하거나 제3자에게 제공하지 않습니다. 특히, 다음의 경우에는 주의를 기울여 개인정보를 이용 및 제공할 것입니다.',
                created_at: '2022-02-22 22:22:22',
                updated_at: '2022-02-22 22:22:22',
              },
            },
          },
        },
      },

      // 채팅 (Caht)====================================//
      Chat: {
        // 채팅 목록 조회_응답
        get_chat: {
          type: 'object',
          example: {
            user: {
              id: 1,
              email: 'o119a@naver.com',
              nick_name: '애처로운 사과',
              gender: 'FEMALE',
              distance: 3,
              profile_image_url: 'image_url',
              is_smoke: true,
              is_chat_push: false,
              is_carpool_push: false,
              login_count: 1,
            },
            chat_list: [
              {
                chat_info: {
                  id: 4,
                  chat_id: 2,
                  user_id: 3,
                  is_join: true,
                  is_checked: false,
                  is_push: false,
                  created_at: '2022-10-17T09:34:50.000Z',
                  updated_at: '2022-10-17T09:34:50.000Z',
                },
                chat_message: [
                  {
                    id: 9,
                    chat_id: 2,
                    user_id: 3,
                    message_type: 'message',
                    message: '마지막 메세지 입니다!2',
                    is_checked: true,
                    created_at: '2022-10-17T09:34:50.000Z',
                    updated_at: '2022-10-17T09:34:50.000Z',
                  },
                ],
                unread_message: 0,
                chat_user: [
                  {
                    id: 3,
                    provider: 'KAKAO',
                    provider_uid: 12345,
                    email: 'email3@email.com',
                    nick_name: '어디로가니 할로윈',
                    gender: 'MALE',
                    distance: 3,
                    profile_image_url: null,
                    account_number: null,
                    account_holder: null,
                    bank_id: null,
                    is_smoke: false,
                    is_chat_push: false,
                    is_carpool_push: false,
                    is_community_push: false,
                    last_login_at: null,
                    login_count: 0,
                    created_at: null,
                    updated_at: null,
                  },
                ],
              },
            ],
          },
        },

        // 결제 요청 조회_응답
        request_for_pay: {
          type: 'object',
          example: {
            user: {
              id: 3,
              email: 'email3@email.com',
              nick_name: '발이 넓은 돈까스',
              gender: 'MALE',
              distance: 3,
              profile_image_url: null,
              is_smoke: true,
              is_chat_push: false,
              is_carpool_push: false,
              login_count: 1,
            },
            carpool_list: [
              {
                id: 2,
                user_id: 3,
                status: 'request',
                type: 'driver',
                kind: 'go_work',
                title: '중복이네요',
                start_address: '출발_먼곳_주변(부천)',
                start_latitude: '37.5001510000',
                start_longitude: '486.7137560000',
                arrive_address: '도착_회사_주변(경기)',
                arrive_latitude: '37.6483330000',
                arrive_longitude: '486.8365840000',
                start_date: '2022-02-01T15:00:00.000Z',
                content: '같이 출근합시다.',
                price: '3000',
                image_url: 'image_url',
                is_hidden: false,
                view_count: 0,
                created_at: '2022-10-19T07:29:20.000Z',
                updated_at: '2022-10-19T07:29:20.000Z',
              },
            ],
          },
        },
      },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
