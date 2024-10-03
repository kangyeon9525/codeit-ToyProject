# 코드잇 프로젝트 - 조각집 (백엔드 파트)
<div align="center">
  <img src="image.png" alt="alt text" />
</div>

## 📌 프로젝트 개요
**제목:** 조각집  
**소개:** 기억 저장 및 공유 서비스

---

## 📅 개발 기간
**기간:** 2024년 9월 16일 ~ 10월 6일

---

## 🔗 배포 주소
- **웹 사이트 주소:** (추후 업데이트)
- **프론트엔드 주소:** (추후 업데이트)
- **백엔드 주소:** [https://codeit-toyproject.onrender.com](https://codeit-toyproject.onrender.com)

---

## 👥 팀원
- **Frontend:** 박성진 (한국항공대학교 소프트웨어학과 2021121081)
- **Backend:** 김강연 (한국항공대학교 소프트웨어학과 2021129004)

---

## 🛠 기술 스택
- **Environment:** Visual Studio Code, Git, GitHub
- **Frontend:** React, Axios
- **Backend:** Node.js, MongoDB, AWS S3
- **Deployment** Render (백엔드 서버 배포)
- **Communication:** Notion, GoogleMeet

---

## 💡 주요 기능

### 🔹 그룹 기능
- **그룹 등록** - 그룹명, 대표 이미지, 그룹 소개, 그룹 공개 여부, 비밀번호를 입력하여 그룹을 등록
- **그룹 수정** - 비밀번호를 입력하여 그룹 등록 시 입력했던 비밀번호와 일치할 경우 그룹 정보 수정이 가능
- **그룹 삭제** - 비밀번호를 입력하여 그룹 등록 시 입력했던 비밀번호와 일치할 경우 그룹 삭제가 가능
- **그룹 목록 조회** - 등록된 각 그룹의 이미지(한 장), 그룹명, 그룹 소개, 그룹 공개 여부, 디데이(생성 후 지난 일수), 획득 배지수, 추억수, 그룹 공감수가 표시
- **그룹 상세 조회** - 그룹 목록 페이지에서 그룹을 클릭할 경우 그룹 상세 조회가 가능. 각 그룹의 대표 이미지, 그룹명, 그룹 소개, 그룹 공개 여부, 디데이(생성 후 지난 일수), 획득 배지 목록, 추억수, 그룹 공감수가 표시
- **그룹 조회 권한 확인** - 비공개 그룹의 경우 비밀번호를 입력하여 그룹 등록시 입력한 비밀번호와 일치할 경우 조회 가능
- **그룹 공감하기** - 공감 보내기 버튼을 클릭할 경우 그룹의 공감수를 높일 수 있으며, 공감은 클릭할 때마다 중복해서 보낼 수 있음
- **그룹 공개 여부 확인** - 공개 그룹 목록과 비공개 그룹 목록을 구분하여 조회

### 🔹 게시글 기능
- **게시글 등록** - 닉네임, 제목, 이미지(한 장), 본문, 태그, 장소, 추억의 순간, 추억 공개 여부, 비밀번호를 입력하여 추억 등록이 가능
- **게시글 수정** - 비밀번호를 입력하여 추억 등록 시 입력했던 비밀번호와 일치할 경우 추억 수정이 가능
- **게시글 삭제** - 비밀번호를 입력하여 추억 등록 시 입력했던 비밀번호와 일치할 경우 추억 삭제가 가능
- **게시글 목록 조회** - 그룹 상세 조회를 할 경우 그 그룹에 해당되는 추억 목록이 같이 조회. 각 추억의 닉네임, 추억 공개 여부, 제목, 이미지, 태그, 장소, 추억의 순간, 추억 공감수, 댓글수가 표시
- **게시글 상세 조회** - 추억 목록에서 추억을 클릭할 경우 추억 상세 조회가 가능. 닉네임, 제목, 이미지(한 장), 본문, 태그, 장소, 추억의 순간, 추억 공개 여부, 추억 공감수, 댓글수가 표시 
- **게시글 조회 권한 확인** - 비공개 게시글의 경우 비밀번호를 입력하여 게시글 등록시 입력한 비밀번호와 일치할 경우 조회 가능
- **게시글 공감하기** - 공감 보내기 버튼을 클릭할 경우 그룹의 공감수를 높일 수 있으며, 공감은 클릭할 때마다 중복해서 보낼 수 있음
- **게시글 공개 여부 확인** - 공개 추억 목록과 비공개 추억 목록을 구분하여 조회

### 🔹 댓글 기능
- **댓글 등록** - 닉네임, 댓글 내용, 비밀번호를 입력하여 댓글 등록이 가능
- **댓글 수정** - 비밀번호를 입력하여 댓글 등록 시 입력했던 비밀번호와 일치할 경우 댓글 수정이 가능
- **댓글 삭제** - 비밀번호를 입력하여 댓글 등록 시 입력했던 비밀번호와 일치할 경우 댓글 삭제가 가능
- **댓글 목록 조회** - 추억을 조회할 경우 그 추억에 해당되는 댓글 목록이 조회. 각 닉네임, 댓글 생성 날짜, 댓글 내용이 표시

### 🔹 배지 기능
- 그룹은 일정 조건을 달성하면 자동으로 배지를 획득
- **배지 종류**
  - 7일 연속 추억 등록
  - 추억 수 20개 이상 등록
  - 그룹 생성 후 1년 달성
  - 그룹 공감 1만 개 이상 받기
  - 게시글(추억) 공감 1만 개 이상 받기 (공감 1만 개 이상의 추억이 하나라도 있으면 획득)

