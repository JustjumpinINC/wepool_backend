'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'services',
      [
        {
          title: '개인정보 제공 및 위탁 동의서',
          content: `제1조 개인정보 처리 및 제공
          ① 회사는 고객의 개인정보를 서비스이용약관 및 개인정보처리방침의 「개인정보의 수집목적 및 이용목적」에서 고지한 범위 또는 서비스이용약관에 명시한 범위 내에서 사용하며, 동 범위를 넘어 이용하거나 제3자에게 제공하지 않습니다. 특히, 다음의 경우에는 주의를 기울여 개인정보를 이용 및 제공할 것입니다.
          ② 회사는 고객에 대하여 보다 더 질 높은 서비스 제공 등을 위해 아래와 같이 제휴사에게 개인정보를 제공하고 있습니다. 회사는 고객님의 개인정보를 회사의 서비스와 무관한 타 기업, 기관에 공개하지 않습니다. 단, 고객님의 개인정보를 제공하는 경우 다음과 같으며, 고객이 아래 제공을 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.- 크루즈 및 해운업체- 이용 목적: 탑승예약목적- 제공 기간: 목적에 따른 개인정보 제공 시부터 제공 목적 달성 시까지- 시설물 예약 중개 - 제공 항목: 성명, 여권번호, 여권만료일- 이용 목적: 현지 행상진행 및 고객관리목적- 제공 기간: 목적에 따른 개인정보 제공 시부터 제공 목적 달성 시까지- 기타 현지 랜드업체- 제공 항목: 성명, 여권번호, 여권만료일- 이용 목적: 현지 행상진행 및 고객관리목적- 제공 기간: 목적에 따른 개인정보 제공 시부터 제공 목적 달성 시까지- 철도업체 - 제공 항목: 성명, 여권번호, 여권만료일- 이용 목적: 탑승예약목적- 제공 기간: 목적에 따른 개인정보 제공 시부터 제공 목적 달성 시까지- 숙박서비스 제공업체 - 제공 항목: 예약자명, 휴대전화번호, 이메일- 이용 목적: 서비스 제공 확인 및 이용자 정보 확인의 목적- 제공 기간: 예약 서비스 제공 완료 후 1년
          ③ 회사는 보다 나은 서비스 제공을 위하여 제2항 외에도 고객의 개인정보를 제휴사에게 제공할 수 있으며, 이에 따라 개인정보를 제공할 경우 회사는 사전에 고객께 제휴사가 누구인지, 제공되는 개인정보항목이 무엇인지, 왜 그러한 개인정보가 제공되어야 하는지, 그리고 언제까지 어떻게 보호ㆍ관리되는지에 대해 개별적으로 서면 또는 전자우편 등을 통해 고지하여 동의를 구하는 절차를 거치게 되며, 고객께서 동의하지 않는 경우에는 제휴사에게 제공하지 않습니다. 제휴관계에 변화가 있거나 제휴관계가 종결될 때도 같은 절차에 의하여 고지하거나 동의를 구합니다.④ 회사는 기타 아래의 경우에도 고객의 개인정보를 제3자에게 제공할 수 있습니다.- 관계법령에 의하여 수사상의 목적으로 관계기관으로부터의 요구가 있을 경우- 통계작성학술연구나 시장조사를 위하여 특정 개인을 식별할 수 없는 형태로 광고주 협력사나 연구단체 등에 제공하는 경우- 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우- 서비스 제공에 따른 요금정산을 위하여 필요한 경우- 문화관광부 인증 우수상품에 관한 해당 관련기관의 요청이 있는 경우- 홈페이지에 게시한 이용약관 또는 운영원칙을 위반한 경우- 점핀 서비스를 이용하여 타인에게 정신적, 물질적 피해를 줌으로써 그에대한 법적인 조치를 취하기 위하여 개인정보를 제공해야 한다고 판단되는 충분한 근거가 있는 경우- 캠페인 프로모션 및 각종 이벤트나 기획전으로 발생되는 경품 당첨등의 서비스를 위하여 위탁업체로 정보를 제공할 수 있으며, 이때 필요한 정보의 종류 및 이용용도 및 기간등을 명시하여 고객에게 사전 동의를 받은 경우
          ⑤ 관계법령에 의하거나 수사기관의 요청에 의해 정보를 제공한 경우에도 이를 당사자에게 고지하는 것을 원칙으로 운영하고 있습니다. 법률상의 근거에 의해 부득이하게 고지를 하지 못할 수도 있습니다. 본래의 수집 및 이용목적에 반하여 무분별하게 정보가 제공되지 않도록 최대한 노력하겠습니다.
          ⑥ 회사는 새로운 기술개발이나 보다 나은 서비스의 제공을 위하여 이용자들의 개인정보를 제공할 수 있습니다. 이 경우에도 정보제공 이전에 개인정보를 제공할 기관이나 단체가 누구인지, 어떤 정보가 왜 필요한지, 그리고 언제까지 어떻게 보호되고 관리되는지 알려드리고 동의를 구하는 절차를 거치게 되며, 이용자들의 동의가 없는 경우에는 추가적인 정보를 임의로 수집하거나 제공하지 않습니다.
          ⑦ 회사는 이용자들께 다른 회사의 웹사이트 또는 자료에 대한 링크를 제공할 수 있습니다. 이 경우 회사는 외부사이트 및 자료에 대한 아무런 통제권이 없으므로 그로부터 제공받는 서비스나 자료의 유용성에 대해 책임질 수 없으며 보증할 수 없습니다. 회사가 포함하고 있는 링크를 통해 타 사이트의 페이지로 옮겨갈 경우 해당 사이트의 개인정보처리방침은 회사와 무관하므로 새로 방문한 사이트의 정책을 검토해 보시기 바랍니다. `,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  },
};
