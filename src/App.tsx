import React, { useState, useMemo, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle2, XCircle, Info, Settings, Wrench, Printer, Droplets, RefreshCw, Share2, Check, User, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 전문가 및 고객용 데이터 통합 가이드
const AS_DATA = [
  {
    id: 1,
    model: ["L8050", "L18050"],
    category: "에러 코드",
    symptom: "모든 경고등 점멸 (Fatal Error)",
    cause: "프린터 내부 장치 이동 방해 또는 센서 오류",
    customerCheck: "프린터를 끄고 5분 뒤에 다시 켜보세요. 덮개를 열어 내부에 걸린 종이나 이물질이 없는지 꼼꼼히 확인해 주세요.",
    expertCheck: "캐리지 이동 저항, 엔코더 스트립 오염, 캡핑스테이션 고착 점검",
    replacement: "O",
    part: "메인보드 또는 프린트 헤드",
    customerTip: "전원을 껐다 켜도 계속 에러가 난다면 기계적인 점검이 필요할 수 있습니다.",
    expertTip: "센서 오염 청소로 해결되지 않으면 보드/헤드 쇼트 여부를 판단하세요."
  },
  {
    id: 2,
    model: ["L8050", "L18050"],
    category: "에러 코드",
    symptom: "잉크패드 오류 (잉크패드 가득참)",
    cause: "프린터 내부 폐잉크 흡수 패드 수명 종료",
    customerCheck: "프린터 뒷면이나 아래쪽에 있는 '유지보수 박스'를 새것으로 갈아주세요.",
    expertCheck: "유지보수박스 교체 및 WIC(Waste Ink Counter) 리셋 프로그램 실행",
    replacement: "O",
    part: "유지보수 박스",
    customerTip: "잉크 패드는 소모품입니다. 에러가 뜨기 전에 미리 여분을 준비해두면 업무가 중단되는 것을 막을 수 있습니다.",
    expertTip: "L18050/L8050은 교체형 유지보수 박스를 사용하므로 칩 리세터가 유용합니다."
  },
  {
    id: 3,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "용지 걸림 에러 (실제로는 없음)",
    cause: "종이 감지 센서 오염 또는 작은 종이 조각 잔류",
    customerCheck: "종이가 들어가는 곳과 나오는 곳을 밝은 빛으로 비춰보세요. 아주 작은 종이 조각이라도 있다면 조심스럽게 제거해 주세요.",
    expertCheck: "PE센서 알코올 청소 및 내부 구동부 이물질 정밀 제거",
    replacement: "X",
    part: "PE센서 (청소)",
    customerTip: "종이가 걸리지 않았는데도 에러가 난다면 먼지 때문일 수 있습니다. 가볍게 바람을 불어 청소해 보세요.",
    expertTip: "전사지 코팅 가루가 고착된 경우 에어건이나 세척액이 필요할 수 있습니다."
  },
  {
    id: 4,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이 급지가 안됨 (탁탁 소리)",
    cause: "급지롤러 마모, 전사용지 분진, 롤러 고무 경화",
    customerCheck: "종이를 너무 많이 넣지 마세요. 종이 입구의 고무 부분을 물티슈로 가볍게 닦아주면 잘 올라갑니다.",
    expertCheck: "롤러 청소 및 여러 장 급지 테스트 후 동일 증상 시 교체 판단",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "롤러가 돌면서 탁탁/드르륵 소리가 나는데도 종이가 안 들어간다면 부품 마모일 가능성이 높습니다.",
    expertTip: "전사지 분진으로 인한 슬립이 잦으므로 롤러 상태를 정밀 확인하세요."
  },
  {
    id: 5,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이가 비스듬히 들어감 (사선 급지)",
    cause: "ASF 롤러 마모 또는 급지 스프링 장력 약화",
    customerCheck: "용지 가이드를 종이에 딱 맞게 조절해 주세요. 다른 종류의 종이로도 테스트해 보세요.",
    expertCheck: "롤러 청소 및 용지 교체 후에도 한쪽으로 기울어짐 지속 시 교체",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "출력물이 한쪽으로 기울어져 나온다면 종이가 들어갈 때부터 삐딱하게 들어가는지 확인해 보세요.",
    expertTip: "한쪽 롤러만 먼저 종이를 채는 경우 스프링이나 롤러 편마모를 의심하세요."
  },
  {
    id: 6,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이 2~3장 동시 급지",
    cause: "분리패드 마모 또는 급지롤러 압력 감소",
    customerCheck: "종이를 넣기 전에 한 번 털어서 붙어 있는 종이를 떼어주세요. 습기가 많은 곳은 피하는 것이 좋습니다.",
    expertCheck: "용지 교체 및 롤러 세척 후에도 중복 급지 발생 시 교체",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "한 번에 여러 장이 빨려 들어가서 종이가 걸린다면 내부 분리 장치가 닳았을 수 있습니다.",
    expertTip: "분리패드(Separation Pad)의 마찰력이 떨어지면 중복 급지가 빈번해집니다."
  },
  {
    id: 7,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "빈 종이 출력 (급지 타이밍 오류)",
    cause: "급지대 위치 불량 또는 급지 타이밍 센서 오류",
    customerCheck: "컴퓨터 설정에서 '헤드 청소'가 아닌 '노즐 점검'을 먼저 해보세요. 종이가 그냥 통과하는지 확인합니다.",
    expertCheck: "PE센서 청소 후에도 종이가 그냥 통과하거나 타이밍이 안 맞으면 교체",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "인쇄 명령을 내렸는데 종이는 들어가지만 아무것도 안 찍히고 그냥 나온다면 급지 위치 문제일 수 있습니다.",
    expertTip: "PE센서가 정상임에도 타이밍 오류가 나면 ASF 유닛의 기계적 결함입니다."
  },
  {
    id: 8,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이가 중간에서 멈춤",
    cause: "급지기어 마모 또는 롤러 미끄러짐",
    customerCheck: "내부에 걸린 종이 조각이 없는지 다시 한번 확인해 주세요. 롤러를 물티슈로 닦아보세요.",
    expertCheck: "롤러 청소 후에도 종이가 절반만 들어가고 멈추는 증상 지속 시 교체",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "종이가 들어가다가 중간에 멈춰서 인쇄가 중단된다면 기어가 헛돌고 있을 수 있습니다.",
    expertTip: "급지 기어의 이빨이 뭉개지거나 이물질이 끼면 중간 정지 현상이 발생합니다."
  },
  {
    id: 9,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "노즐 막힘 (청소로 해결 안됨)",
    cause: "전사잉크 침전 또는 헤드 노즐 영구 막힘",
    customerCheck: "헤드 청소를 3번 정도 해보세요. 그래도 안 나온다면 12시간 정도 기다렸다가 다시 해보세요.",
    expertCheck: "헤드청소 3~5회 및 파워클리닝 후에도 특정 라인 끊김 지속 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "헤드 청소를 여러 번 해도 노즐 점검 패턴이 똑같이 끊겨 나온다면 헤드 수명이 다한 것일 수 있습니다.",
    expertTip: "전사 잉크는 침전이 빠르므로 장기 방치 시 헤드 내부에서 굳어버립니다."
  },
  {
    id: 10,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "특정 색상 완전 출력 안됨",
    cause: "헤드 채널 막힘 또는 내부 전기회로 손상",
    customerCheck: "잉크 탱크에 해당 색상이 충분한지 확인하세요. 잉크 공급선에 공기가 차 있는지 확인해 보세요.",
    expertCheck: "잉크 공급 및 에어 유무 확인 후에도 특정 색(예: 검정) 미출력 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "특정 색상이 아예 안 나온다면 잉크가 공급되지 않거나 헤드 내부 회로 고장일 수 있습니다.",
    expertTip: "회로 쇼트로 인해 특정 채널의 피에조 소자가 동작하지 않는 경우입니다."
  },
  {
    id: 11,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "출력 줄무늬 (밴딩 현상)",
    cause: "헤드 노즐 손상 또는 일부 노즐 수명 종료",
    customerCheck: "인쇄 설정에서 '고품질'을 선택해 보세요. 헤드 정렬 메뉴를 통해 정렬을 다시 해보세요.",
    expertCheck: "헤드 정렬 및 노즐 체크 시 동일한 패턴의 줄무늬 지속 발생 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "일정한 간격으로 줄이 생긴다면 노즐 일부가 손상되어 잉크를 제대로 뿌리지 못하는 상태입니다.",
    expertTip: "소프트웨어 보정으로 해결되지 않는 물리적 노즐 손상은 교체가 답입니다."
  },
  {
    id: 12,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "잉크 번짐 / 헤드 잉크 맺힘",
    cause: "헤드 노즐 파손 또는 잉크 과다 토출",
    customerCheck: "프린터 내부 바닥에 잉크가 고여 있는지 확인하세요. 헤드 청소 후에도 번짐이 심하면 점검이 필요합니다.",
    expertCheck: "헤드 밑면 잉크 뭉침 및 출력물 번짐 현상 개선 불가 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "출력물에 잉크가 뭉쳐서 나오거나 번진다면 헤드 바닥면이 손상되었을 수 있습니다.",
    expertTip: "노즐 플레이트 손상으로 잉크 제어가 안 되면 과다 토출 및 번짐이 발생합니다."
  },
  {
    id: 13,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "출력 색상 틀어짐",
    cause: "헤드 일부 채널 약화 또는 잉크 혼색",
    customerCheck: "정품 프로파일을 사용 중인지 확인하세요. 노즐 점검 패턴의 색상이 선명한지 확인해 보세요.",
    expertCheck: "정상 프로파일 환경에서도 색상이 눈에 띄게 틀어지는 경우 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "설정은 그대로인데 갑자기 색감이 이상해졌다면 헤드 내부에서 잉크가 섞이거나 채널이 약해진 것일 수 있습니다.",
    expertTip: "헤드 내부 격벽 손상으로 인한 혼색은 세정으로 해결되지 않습니다."
  },
  {
    id: 14,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "글자나 이미지가 겹쳐 보임 (이중 찍힘)",
    cause: "프린터 내부 투명 띠(엔코더) 오염",
    customerCheck: "덮개를 열면 가로로 길게 늘어진 '투명한 띠'가 보입니다. 여기에 잉크가 묻었다면 면봉으로 살살 닦아주세요.",
    expertCheck: "엔코더 스트립 정밀 청소 및 양방향 헤드 정렬 재수행",
    replacement: "X",
    part: "엔코더 스트립",
    customerTip: "투명 띠는 아주 약해서 세게 당기면 빠질 수 있습니다. 아주 조심스럽게 닦아주세요.",
    expertTip: "전사 잉크 분진은 알코올 솜으로 가볍게 닦아내는 것이 가장 효과적입니다."
  },
  {
    id: 15,
    model: ["L8050", "L18050"],
    category: "시스템/통신",
    symptom: "컴퓨터에서 프린터를 찾을 수 없음",
    cause: "연결 케이블 불량 또는 드라이버 설정 오류",
    customerCheck: "컴퓨터와 연결된 선을 뽑았다가 다시 꽉 꽂아보세요. 다른 USB 구멍에 꽂아보는 것도 좋습니다.",
    expertCheck: "메인보드 USB 단자 칩셋 불량 점검 및 네트워크 리셋",
    replacement: "O",
    part: "USB 케이블 또는 메인보드",
    customerTip: "선이 너무 길면 연결이 불안정할 수 있습니다. 가급적 짧은 정품 선을 사용해 주세요.",
    expertTip: "포트 변경 후에도 안 되면 보드 통신 칩셋 손상을 의심해야 합니다."
  },
  {
    id: 16,
    model: ["L8050", "L18050"],
    category: "내부 오염",
    symptom: "프린터 바닥으로 잉크가 샘",
    cause: "폐잉크 배출 통로가 막히거나 넘침",
    customerCheck: "바닥에 잉크가 샌다면 즉시 전원을 끄고 코드를 뽑으세요. 더 이상 인쇄하지 말고 수리를 요청해야 합니다.",
    expertCheck: "폐잉크 튜브 막힘 확인 및 캡핑 스테이션 펌프 동작 점검",
    replacement: "O",
    part: "캡핑 스테이션 또는 잉크 튜브",
    customerTip: "잉크가 기계 안으로 들어가면 더 큰 고장이 날 수 있으니 바로 사용을 멈추는 것이 중요합니다.",
    expertTip: "전사 잉크는 점도가 높아 튜브가 잘 막힙니다. 주기적인 세척이 필수입니다."
  },
  {
    id: 17,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "급지 시 종이를 못 잡고 헛돎",
    cause: "급지롤러 고무 경화, 전사용지 분진으로 마찰력 감소",
    customerCheck: "종이 급지 롤러를 물티슈나 알코올 솜으로 깨끗이 닦아보세요. 종이를 너무 많이 넣지 말고 적당량만 넣어보세요.",
    expertCheck: "롤러 세척 후에도 동일하게 헛도는 증상 발생 시 교체 판단",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "전사용지에서 나오는 가루가 롤러에 묻으면 미끄러질 수 있습니다. 주기적으로 닦아주는 것이 좋습니다.",
    expertTip: "고무 경화는 세척으로 해결되지 않으며, 전사잉크 환경에서는 롤러 수명이 더 빨리 단축됩니다."
  },
  {
    id: 18,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "첫 장만 급지 실패 (두 번째부터 정상)",
    cause: "분리패드 마모 또는 롤러 압력 약화",
    customerCheck: "종이를 넣기 전에 한 번 털어주시고, 종이 가이드가 너무 꽉 조여져 있지 않은지 확인해 보세요.",
    expertCheck: "분리패드 마찰력 저하 및 롤러 압력 테스트 후 교체 판단",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "첫 장만 안 올라가고 다음 장부터 잘 된다면 내부의 종이 분리 장치가 닳았을 가능성이 큽니다.",
    expertTip: "초기 급지 시 토크가 부족하거나 패드 마모로 인해 슬립이 발생하는 전형적인 증상입니다."
  },
  {
    id: 19,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이 넣으면 바로 용지걸림 에러",
    cause: "급지 기어 마모 또는 급지 타이밍 센서 오류",
    customerCheck: "프린터 내부에 아주 작은 종이 조각이나 이물질이 끼어 있는지 확인해 보세요.",
    expertCheck: "급지 기어 파손 여부 및 타이밍 센서(PE 센서) 동작 정밀 점검",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "종이가 들어가지도 않았는데 걸림 에러가 난다면 기계적인 고장일 확률이 높습니다.",
    expertTip: "기어 이빨이 하나라도 나가면 타이밍이 어긋나며 즉시 에러를 발생시킵니다."
  },
  {
    id: 20,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "종이가 들어갔다가 다시 빠짐 (역방향 배출)",
    cause: "급지 기어 슬립 또는 롤러 압력 부족",
    customerCheck: "종이가 들어가는 입구에 이물질이 없는지 확인하고, 종이를 평평하게 펴서 넣어보세요.",
    expertCheck: "급지 구동부 기어 슬립 현상 확인 및 롤러 장력 체크",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "종이를 빨아들였다가 다시 뱉어낸다면 내부 기어가 헛돌고 있는 상태입니다.",
    expertTip: "ASF 유닛 내부의 원웨이 클러치나 기어 결합 부위 결함 시 발생합니다."
  },
  {
    id: 21,
    model: ["L8050", "L18050"],
    category: "급지 문제",
    symptom: "특정 두께 용지만 급지 실패 (전사용지 등)",
    cause: "급지 롤러 마모로 인한 마찰력 부족",
    customerCheck: "일반 A4 용지는 잘 올라가는데 두꺼운 전사용지만 안 올라간다면 롤러를 닦아보세요.",
    expertCheck: "용지 종류별 급지 테스트 수행 후 특정 용지에서만 슬립 발생 시 교체",
    replacement: "O",
    part: "급지대 (ASF Unit)",
    customerTip: "전사용지는 일반 종이보다 미끄러워서 롤러가 조금만 닳아도 못 잡을 수 있습니다.",
    expertTip: "롤러의 고무 돌기가 마모되면 고평량/고광택 용지부터 급지 불량이 시작됩니다."
  },
  {
    id: 22,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "출력 시 잉크가 튀는 현상 (잉크 점 발생)",
    cause: "헤드 노즐 손상 또는 토출 불안정",
    customerCheck: "인쇄 설정에서 '양방향 인쇄'를 끄고 테스트해 보세요. 헤드 청소를 한 번 진행해 보세요.",
    expertCheck: "노즐 체크 시 잉크 비산 현상 확인 및 청소 후에도 개선 안 될 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "종이에 깨끗하게 인쇄되지 않고 주변에 잉크 가루가 튄 것처럼 나온다면 헤드 이상을 의심해야 합니다.",
    expertTip: "노즐 내부의 압력 제어가 안 되어 잉크 방울이 일정하게 맺히지 않고 흩뿌려지는 현상입니다."
  },
  {
    id: 23,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "출력 중 특정 색이 랜덤으로 사라짐",
    cause: "헤드 내부 채널 불량 또는 댐퍼 공기 유입",
    customerCheck: "잉크 탱크의 양을 확인하고, 잉크 공급 호스에 공기가 많이 차 있는지 확인해 보세요.",
    expertCheck: "잉크 공급 라인(댐퍼) 에어 제거 후에도 랜덤하게 색 빠짐 지속 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "잘 나오다가 갑자기 한 가지 색이 안 나오고, 다시 하면 또 나오는 증상은 헤드 내부 문제입니다.",
    expertTip: "헤드 내부 필터 막힘이나 채널 손상으로 인해 잉크 공급 속도가 소모 속도를 못 따라가는 경우입니다."
  },
  {
    id: 24,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "헤드청소 후 오히려 노즐 더 끊김",
    cause: "헤드 내부 격벽 손상 또는 노즐 막힘 심화",
    customerCheck: "청소를 너무 많이 하면 오히려 헤드에 무리가 갈 수 있습니다. 1시간 정도 휴식을 준 뒤 다시 해보세요.",
    expertCheck: "파워 클리닝 후에도 노즐 상태가 악화되거나 혼색 발생 시 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "청소를 할수록 상태가 나빠진다면 헤드 내부가 이미 손상되었을 가능성이 매우 높습니다.",
    expertTip: "펌핑 압력으로 인해 손상된 격벽 사이로 잉크가 넘어가거나 노즐이 완전히 터지는 경우입니다."
  },
  {
    id: 25,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "헤드에서 잉크 누수 (내부 고임)",
    cause: "헤드 노즐 파손 또는 내부 씰(Seal) 손상",
    customerCheck: "프린터 바닥이나 헤드 주변에 잉크가 흥건하다면 즉시 사용을 중단하고 전원을 끄세요.",
    expertCheck: "헤드 하단부 잉크 누출 지점 확인 및 챔버 파손 여부 점검",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "잉크가 새어 나오면 전기 회로에 닿아 메인보드까지 고장 낼 수 있으니 주의해야 합니다.",
    expertTip: "물리적인 충격이나 과도한 압력으로 인해 헤드 하우징이 파손된 상태입니다."
  },
  {
    id: 26,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "특정 패턴(사진 등)에서만 출력 불량",
    cause: "일부 노즐 손상 또는 헤드 정렬 불량",
    customerCheck: "일반 문서는 잘 나오는데 사진만 줄이 간다면 인쇄 품질을 '최상'으로 높여보세요.",
    expertCheck: "고해상도 출력 테스트 시 특정 채널의 노즐 비산 및 끊김 확인 후 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "글자는 괜찮은데 그림에서만 줄이 생긴다면 미세한 노즐들이 손상된 상태입니다.",
    expertTip: "Draft 모드에서는 티가 안 나지만 고밀도 출력 시 노즐 불량이 도드라지는 경우입니다."
  },
  {
    id: 27,
    model: ["L8050", "L18050"],
    category: "인쇄 품질",
    symptom: "노즐체크 패턴이 매번 달라짐",
    cause: "헤드 내부 압력 불균형 또는 에어 유입",
    customerCheck: "잉크 공급선이 꼬여 있지 않은지 확인하고, 헤드 청소를 1회만 진행한 뒤 지켜보세요.",
    expertCheck: "댐퍼 교체 및 에어 제거 후에도 노즐 끊김 위치가 계속 변하면 교체",
    replacement: "O",
    part: "프린트 헤드",
    customerTip: "끊기는 위치가 계속 바뀐다면 잉크 공급이 불안정하거나 헤드 안에 공기가 찬 것입니다.",
    expertTip: "헤드 내부 챔버의 기밀성이 떨어져 외부 공기가 유입되거나 압력이 유지되지 않는 증상입니다."
  },
  {
    id: 28,
    model: ["L8050", "L18050"],
    category: "전사잉크 특이사항",
    symptom: "전사잉크 사용 시 주의사항 (종합)",
    cause: "전사잉크의 높은 점도 및 분진 발생",
    customerCheck: "전사잉크는 일반 잉크보다 잘 굳습니다. 매일 한 장 이상 출력해 주시고 롤러를 자주 닦아주세요.",
    expertCheck: "전사잉크 침전으로 인한 헤드 막힘 및 용지 분진으로 인한 롤러 슬립 정기 점검",
    replacement: "X",
    part: "정기 관리",
    customerTip: "전사용지 가루가 롤러에 쌓이면 급지 불량의 주원인이 됩니다. 물티슈로 자주 닦아주세요.",
    expertTip: "미세 노즐 막힘, 특정 색 약화, 줄무늬 등은 전사잉크 환경에서 매우 빈번하므로 예방 정비가 중요합니다."
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [isExpertMode, setIsExpertMode] = useState(false);

  const categories = ["All", ...new Set(AS_DATA.map(item => item.category))];
  const models = ["All", "L8050", "L18050"];

  const filteredData = useMemo(() => {
    return AS_DATA.filter(item => {
      const matchesSearch = item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (isExpertMode ? item.expertTip : item.customerTip).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModel = selectedModel === "All" || item.model.includes(selectedModel);
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesModel && matchesCategory;
    });
  }, [searchTerm, selectedModel, selectedCategory, isExpertMode]);

  const handleShareItem = (item: typeof AS_DATA[0]) => {
    const mode = isExpertMode ? "[전문가용]" : "[고객용]";
    const check = isExpertMode ? item.expertCheck : item.customerCheck;
    const tip = isExpertMode ? item.expertTip : item.customerTip;
    
    const textToShare = `${mode} EPSON ${item.model.join('/')} A/S 가이드\n⚠️ 증상: ${item.symptom}\n🔍 원인: ${item.cause}\n🛠️ 조치: ${check}\n💡 팁: ${tip}`;
    
    const textArea = document.createElement("textarea");
    textArea.value = textToShare;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setToastMessage("가이드 내용이 복사되었습니다!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error('복사 실패', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setToastMessage("앱 링크가 복사되었습니다! 팀원에게 공유하세요.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error('복사 실패', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      
      {/* 알림 메시지 (Toast) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 transition-all print:hidden"
          >
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center relative print:mb-6"
        >
          <div className="flex justify-center items-center gap-3 mb-2">
            <Printer className="w-10 h-10 text-blue-700" />
            <h1 className="text-3xl font-bold text-slate-800">
              서블리원 A/S 가이드
            </h1>
          </div>
          <p className="text-slate-500 font-medium">L18050 / L8050 고장 진단 및 수리 가이드</p>
          
          {/* View Mode Toggle */}
          <div className="mt-6 flex justify-center gap-2 print:hidden">
            <button
              onClick={() => setIsExpertMode(false)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                !isExpertMode ? 'bg-white text-blue-600 shadow-md border-2 border-blue-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              고객용 모드
            </button>
            <button
              onClick={() => setIsExpertMode(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                isExpertMode ? 'bg-slate-800 text-white shadow-md border-2 border-slate-800' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              전문가/팀원용
            </button>
          </div>
        </motion.header>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 space-y-4 print:hidden"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="증상, 원인, 키워드 검색..."
                className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isExpertMode && (
              <button 
                onClick={handleCopyLink}
                className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 font-bold text-sm"
                title="앱 링크 복사"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">팀원 공유</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">모델</label>
              <div className="flex gap-2">
                {models.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedModel === m ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">카테고리</label>
              <select
                className="w-full p-2 bg-slate-100 rounded-lg text-sm outline-none border-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c === "All" ? "전체 카테고리" : c}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {/* List */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow print:break-inside-avoid print:shadow-none print:border-slate-300 print:mb-4 ${
                    isExpertMode ? 'border-slate-800/20' : 'border-slate-200'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          isExpertMode ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.category}
                        </span>
                        {item.model.map(m => (
                          <span key={m} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                            {m}
                          </span>
                        ))}
                      </div>
                      {isExpertMode && (
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">부품 교체</span>
                          {item.replacement === "O" ? (
                            <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
                              <CheckCircle2 className="w-4 h-4" /> 필요
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-500 font-bold text-sm">
                              <XCircle className="w-4 h-4" /> 불필요
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 shrink-0 ${isExpertMode ? 'text-slate-800' : 'text-amber-500'}`} />
                        {item.symptom}
                      </h3>
                      
                      <button 
                        onClick={() => handleShareItem(item)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors print:hidden"
                      >
                        <Copy className="w-4 h-4" />
                        <span>복사</span>
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-500 flex items-center gap-1 mb-2">
                          <Info className="w-4 h-4" /> 주요 원인
                        </h4>
                        <p className="text-slate-700 text-sm leading-relaxed">{item.cause}</p>
                      </div>
                      <div className={`${isExpertMode ? 'bg-slate-800/5 border-slate-800/10' : 'bg-blue-50 border-blue-100'} p-4 rounded-xl border`}>
                        <h4 className={`text-sm font-bold flex items-center gap-1 mb-2 ${isExpertMode ? 'text-slate-800' : 'text-blue-600'}`}>
                          <Wrench className="w-4 h-4" /> {isExpertMode ? '전문가 조치사항' : '간편 해결 방법'}
                        </h4>
                        <p className="text-slate-700 text-sm font-medium leading-relaxed">
                          {isExpertMode ? item.expertCheck : item.customerCheck}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
                      {isExpertMode && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                          <Settings className="w-4 h-4 text-slate-400" />
                          대상 부품: <span className="font-semibold text-slate-800">{item.part}</span>
                        </div>
                      )}
                      <div className={`text-sm px-4 py-3 rounded-xl flex items-start gap-2 flex-1 min-w-[250px] border ${
                        isExpertMode ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-amber-50 text-amber-800 border-amber-100'
                      }`}>
                        <RefreshCw className={`w-4 h-4 mt-0.5 shrink-0 ${isExpertMode ? 'text-slate-500' : 'text-amber-600'}`} />
                        <span className="leading-relaxed">
                          <strong>{isExpertMode ? '기술 팁:' : '도움말:'}</strong> {isExpertMode ? item.expertTip : item.customerTip}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 print:hidden"
              >
                <p className="text-slate-400 font-medium">검색 결과가 없습니다.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 bg-slate-800 text-white rounded-2xl shadow-lg print:break-inside-avoid print:bg-slate-50 print:text-slate-900 print:border print:border-slate-300 print:shadow-none"
        >
          <h4 className="font-bold mb-4 flex items-center gap-2 text-xl">
            <Droplets className="w-6 h-6 text-blue-400" />
            전사 프린터 핵심 관리 가이드
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="text-sm text-slate-300 print:text-slate-700 space-y-3 list-disc ml-5 leading-relaxed">
              <li><strong>주 2~3회 필수 인쇄:</strong> 전사 잉크는 입자가 커서 쉽게 굳습니다. 최소 2~3일에 한 번은 노즐 점검이나 인쇄를 수행하세요.</li>
              <li><strong>잉크 탱크 관리:</strong> 일주일에 한 번 잉크 탱크를 가볍게 흔들어 잉크 침전을 방지해 주세요.</li>
              <li><strong>최적 환경 유지:</strong> 온도 15~25℃, 습도 40~60%의 안정적인 환경에서 보관 및 사용하세요.</li>
              <li><strong>전원 관리:</strong> 반드시 프린터 본체의 전원 버튼으로 끄세요. 그래야 헤드가 안전하게 보호 구역(Cap)으로 이동합니다.</li>
            </ul>
            <ul className="text-sm text-slate-300 print:text-slate-700 space-y-3 list-disc ml-5 leading-relaxed">
              <li><strong>먼지 및 이물질 차단:</strong> 사용하지 않을 때는 반드시 덮개를 닫아주세요. 작은 먼지도 노즐 막힘의 원인이 됩니다.</li>
              <li><strong>전용 잉크 사용:</strong> 서블리원 전용 고품질 전사 잉크 사용을 권장하며, 다른 종류의 잉크와 혼합하지 마세요.</li>
              <li><strong>장기 방치 금지:</strong> 일주일 이상 방치할 경우 헤드가 영구적으로 손상될 수 있습니다. 휴가 시에도 원격 인쇄 등을 활용하세요.</li>
            </ul>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
