// 댓글 쓸 때, 이미 db에 해당 user_no 있으면 막기.
// 채택 버튼을 누를 경우, 글쓴이가 아니면 아무런 이벤트도 나타나지 않게 하기

// 칼바람 나락 선택 시 게임 옵션 사라지게 하기
$('#category-map').on('change',function(){

	var map = document.getElementById('category-map');
	
	if(map.options[map.selectedIndex].value=='칼바람 나락'){
		document.querySelector('div.game-mode').setAttribute('hidden','');	
	}else{
		document.querySelector('div.game-mode').removeAttribute('hidden');	
	}
})


// 친구 추가 기능

$('.befriend').on('click', function(){
	
	alert($(this).val())
	
	$.ajax({
		url:'/board_view/befriend.do',
		type : "POST",
		data : {
			asked_user_id : $(this).val()
		}
	})
	alert('친구 신청이 완료되었습니다.')
})


$('.chg-friend-status').on('click', function(){
	
	alert("sdad")
	
	$.ajax({
		url:'/board_view/chgFriendStatus.do',
		type : "POST",
		data : {
			action : $(this).attr('action'),
			user_no : document.getElementById('session-user-no').value,
			friend : $(this).val()
		}
	})
	
	alertOnStatus(action);
	location.reload();
})

function alertOnStatus(action){
	if(action == 'deleteFriend'){
		alert('친구 삭제가 완료되었습니다.')
	}else if(action == 'cancelFriendRequest'){
		alert('친구 신청이 취소되었습니다.')
	}else if(action == 'cancelBan'){
		alert('차단이 취소되었습니다.')
	}else if(action == 'acceptFriendRequest'){
		alert('친구 신청이 수락되었습니다.')
	}
}
// 모달
var reportBtn = document.querySelector('.report-btn');
var modalBg = document.querySelector('.modal-bg');
var modalClose = document.querySelector('.modal-close');

$('.report-btn').on("click", function() {
	modalBg.classList.add('bg-active');
	document.querySelector('#report-target').setAttribute('value',$(this).val())
})


$('.modal-close').on("click", function() {
	modalBg.classList.remove('bg-active');
	
})

$('#submitReport').on("click", function() {
	// reporter의 user_no은 컨트롤러에서 세션으로 얻어오기
	var report_title = document.querySelector('#report-title').value
	var report_content = document.querySelector('#report-content').value
	var report_target = document.querySelector('#report-target').value
	var post_no = document.querySelector('#post-no').value
		
	$.ajax({
		url:'/board_view/submitReport.do',
		type : "POST",
		data : {
			report_title : report_title,
			report_content : report_content,
			report_target : report_target,
			post_no : post_no
		}
	})
	
	alert('신고 접수가 완료되었습니다.')
	modalBg.classList.remove('bg-active');
});


// 문제
$('.delete-reply').on("click", function() {

	$.ajax({
		url:'/board_view/deleteReply.do',
		type : "POST",
		data : {
			user_re_no : $(this).val()
		}
	})
	
	alert('댓글이 삭제되었습니다.');
	// 이거 부분 눈속임 hidden으로 바꿀까
	window.location.reload();
});

function checkValidation(){
	var title = document.getElementById('title').value;
	var context = document.getElementById('content').value;
	var map = document.getElementById('category-map');
	var game = document.getElementById('category-game');
	var cru_max = document.getElementById('category-cru-max');

	var map_value = map.options[map.selectedIndex].value
	var game_value = game.options[game.selectedIndex].value
	var cru_max_value = cru_max.options[cru_max.selectedIndex].value
	
	if(title==""){
		alert("제목을 입력해주세요");
		return false;
	}
	else if(context==""){
		alert("내용을 입력해주세요");
		return false;
	}
	else if(map_value=="none"){
		alert("맵을 선택해주세요");
		return false;
	}
	else if(!(map_value=="칼바람 나락") && (game_value=="none")){
		alert("게임 모드를 선택해주세요");
		return false;
	}
	else if(cru_max_value=="none"){
		alert("모집 인원을 선택해주세요");
		return false;
	}
}

/* 삭제 버튼 */
function confirmPostDelete(){
	return confirm("정말로 게시글을 삭제하시겠습니까?");
}

/* 수정 취소 */
function cancelPostUpdate(){
	if(confirm("수정한 내용을 저장하지 않고 끝내시겠습니까?")){
		window.location.href = 'http://localhost:8080/board_view/viewBoard.do?post_no='+document.getElementById('post_no').value;
	}
}

/* 작성 취소 */
function cancelPostInsert(){
	if(confirm("작성한 내용을 저장하지 않고 끝내시겠습니까?")){
		window.location.href = 'http://localhost:8080/board_list/board_list.do';
	}
}

// 채택 버튼 눌렀을 때
$(function() { 
	$('.choose-user').on("click", function() {
		if(!canChooseMore()){
			alert('이미 모집된 인원이 플레이 인원을 충족하였습니다.')
			return;
		}
		var post_no = document.getElementById('post-no').value;
		var writer_no = document.getElementById('writer-no').value;
		var reply_user_no = $(this).children().attr('value'); // 댓글 단 유저 user_no
		
			// 채택을 위해 누른 거라면
			if(!alreadyChosen(reply_user_no)){
				alert('올레디쵸슨 결과 확인 진입 - 이번이 채택임')
				$.ajax({
					url:'/board_view/chooseUser.do',
					type : "POST",
					data : {
						writer_no :  writer_no,
						chosen_user_no : reply_user_no,
						post_no : post_no
					}
				})
				$('.chosen-user-list').append('<input class="chosen-users" value="'+reply_user_no+'">');
			// 채택 해제를 위해 누른 거라면
			}else{
				alert('올레디쵸슨 결과 확인 진입 - 이미 채택됐었음')
				$.ajax({
					url:'/board_view/cancelUser.do',
					type : "POST",
					data : {
						writer_no :  writer_no,
						chosen_user_no : reply_user_no,
						post_no : post_no
					},
				})
				deleteChosenUser(reply_user_no);
				$(this).children().attr('src', '../resources/imgs/post_detail/unchecked.png');
			}
			checkChosenUsers()
	})
});

// 채택이 이미 돼 있던 댓글의 채택 버튼을 누른 것인가 확인
function alreadyChosen(reply_user_no){
	
	var chosen_user_no = document.getElementsByClassName('chosen-users').length;
	
	for(var i = 0; i< chosen_user_no; i++){
		if(reply_user_no === document.getElementsByClassName('chosen-users')[i].value){
			return true;
		}
	}
	
	return false;
	
}
	
	
function deleteChosenUser(reply_user_no){
	
	var chosen_user_no = document.getElementsByClassName('chosen-users').length;
	
	for(var i = 1; (i-1) < chosen_user_no; i++){
		if(reply_user_no == document.querySelector("div.chosen-user-list > input:nth-child("+i+")").value){
			document.querySelector("div.chosen-user-list > input:nth-child("+i+")").remove();
		}
	}
	
}

function canChooseMore() {
	//ajax로 올라가는 chosen-users를 선택하는 게, 새로 고침해야 오르는 cru-pre보다 낫다
	var chosen_user_no = document.getElementsByClassName('chosen-users').length;
	
	if((chosen_user_no + 1) >= document.getElementById('cru-max').value){
		document.querySelector('.choose-user').setAttribute('disabled','');
		return false;
	}
}

function checkChosenUsers(){
	
	var chosen_user_no = document.getElementsByClassName('chosen-users').length;
	var reply_user_no = document.getElementsByClassName('reply-content-repeat').length;
	
	for(var i = 1; (i-1) < reply_user_no; i++){
		for(var ii = 1; (ii-1)< chosen_user_no; ii++){
			if(document.querySelector(".reply-content-repeat:nth-child("+i+") > input").value == document.querySelector("div.chosen-user-list > input:nth-child("+ii+")").value){
				document.getElementsByClassName('check-img')[i-1].setAttribute('src','../resources/imgs/post_detail/checked.png');
			}
		}
	}
}

function checkReplyValidation(){
	if(document.getElementById('new-reply-text').value == ""){
		alert('댓글 내용을 작성해주세요.')
		return false;
	}
	
	var reply_user_no = document.getElementsByClassName('reply-content-repeat').length;
	
	for(var i = 1; (i-1) < reply_user_no; i++){
		if(document.getElementById('session-user-no').value == document.querySelector(".reply-content-repeat:nth-child("+i+") > input").value){
			alert('이미 신청 댓글을 작성하셨습니다.')
			return false;
		}
	}
	
	// 중복 작성 방지
	document.querySelector('.submit-reply').setAttribute('disabled','');	
}

// 로드 시 실행.
// 이후 viewBoard.jsp만을 위한 js를 만들어 따로 분리시키기.
window.onload = function() {
	checkChosenUsers();
	canChooseMore();
}
