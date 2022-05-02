package com.lol.java.chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@RequestMapping("/echo")
public class EchoHandler extends TextWebSocketHandler{
    //세션 리스트
    private List<WebSocketSession> sessionList = new ArrayList<WebSocketSession>();
    
    private static Logger logger = LoggerFactory.getLogger(EchoHandler.class);

    //클라이언트가 연결 되었을 때 실행
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    	Map<String,Object> map = session.getAttributes();
    	System.out.println(map);
    	
    	String user_no = (String)map.get("user_no");
    	String summoner_id = (String)map.get("summoner_id");
    	
    	
    	System.out.println("로그인 한 아이디 : " + user_no);
    	System.out.println("소환사 아이디 : " + summoner_id);
    	sessionList.add(session);
        
        logger.info("세션 아이디:{}연결됨", session.getId());
        System.out.println("접속한 user_no:"+ user_no +" 소환사명:"+ summoner_id);
    }

    //클라이언트가 웹소켓 서버로 메시지를 전송했을 때 실행
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    	Map<String,Object> map = session.getAttributes();
    	System.out.println(map);
    	
    	String user_no = (String)map.get("user_no");
    	String summoner_id = (String)map.get("summoner_id");
    	
    	logger.info("{}로 부터 {} 받음", session.getId(), message.getPayload());
    	System.out.println("메세지 보냄 user_no:"+ user_no +" 소환사명:"+ summoner_id);
//    	System.out.println("접속한 user_no:"+ user_no +" 소환사명:{}"+ summoner_id);
        //모든 유저에게 메세지 출력
        for(WebSocketSession sess : sessionList){
            sess.sendMessage(new TextMessage(message.getPayload()));
        }
    }
    //클라이언트 연결을 끊었을 때 실행
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    	Map<String,Object> map = session.getAttributes();
    	System.out.println(map);
    	
    	String user_no = (String)map.get("user_no");
    	String summoner_id = (String)map.get("summoner_id");
    	
    	sessionList.remove(session);
        
        logger.info("{} 연결 끊김.", session.getId());
        System.out.println("나간사람 user_no:"+ user_no +" 소환사명:"+ summoner_id);
    }
}