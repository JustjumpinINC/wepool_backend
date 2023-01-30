const { PhotoImages } = require('../../../../models');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

// 이미지 업로드
const uploadImage = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Util']
        #swagger.summary = '이미지 업로드'
        #swagger.description = '이미지 업로드'

    /*  #swagger.responses[200] =  {  
            description: '이미지 업로드 성공',
            schema: {   "code" : 200,  "message" : "이미지 업로드 성공"}}

    /*  #swagger.responses[400] = { 
            description: '이미지 업로드  실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const images = req.files;
    // console.log(images);

    console.log('파일업로드했습니다');

    let values = [];
    req.files.map((data) => {
      console.log(data.location);
      values.push({ image_url: data.location });
    });

    // 1. DB에 저장
    await PhotoImages.bulkCreate(values, { returning: true });

    res.status(200).send({ message: '이미지 여러개 업로드 성공' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 이미지 삭제
const deleteImage = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Util']
        #swagger.summary = '이미지 삭제'
        #swagger.description = '이미지 삭제'

    /*  #swagger.responses[200] =  {  
            description: '이미지 삭제 성공',
            schema: {   "code" : 200,  "message" : "이미지 삭제 성공"}}

    /*  #swagger.responses[400] = { 
            description: '이미지 삭제  실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/

  try {
    const { image_id } = req.params;

    const existImage = await PhotoImages.findByPk(image_id);

    if (existImage) {
      const photoFileURL = existImage.image_url;
      const deleteImageFile = photoFileURL.split('/')[4];
      const keyURL =
        'uploads/' + decodeURI(deleteImageFile).replaceAll('+', ' ');
      s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: keyURL,
        },
        (error, data) => {
          if (error) {
            console.log(error);
            throw new Error('오류가 발생하였습니다.');
          }
        }
      );
      await PhotoImages.destroy({ where: { id: existImage.id } });

      return res.status(200).json({ code: 200, message: '이미지 삭제 성공' });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
