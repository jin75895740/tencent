package com.seecen.tencent.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seecen.tencent.entity.Message;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;


public class IndexController extends AbstractWebSocketHandler {
    // 保存所有在线用户session的集合容器
    private static CopyOnWriteArrayList<WebSocketSession> sessions =
            new CopyOnWriteArrayList<>();
    // 保存所有在线用户名
    private static CopyOnWriteArrayList<String> usernames =
            new CopyOnWriteArrayList<>();
    // 用来将后台对象转换为前台用的json对象
    ObjectMapper om = new ObjectMapper();

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = (String)session.getAttributes().get("username");
        // 保存连接的这个人的session和用户名
        usernames.add(username);
        sessions.add(session);
        // 发送一个谁谁谁上线了的消息给所有人
        Message message = new Message("系统消息", username + "上线了", 1);
        String jsonStr = om.writeValueAsString(message);
        // 将转换好的数据，发给所有人
        sendAll(jsonStr);
        //  发送所有在线用户列表
        jsonStr = om.writeValueAsString(usernames);
        sendAll(jsonStr);
    }
    // 给所有人发送消息
    private void sendAll(String jsonStr) throws IOException {
        // 给每个人发jsonStr消息
        for (WebSocketSession session : sessions) {
            // 防止发送的过程中，用户退出。所以session是正常打开的状态才发
            if(session.isOpen()) {
                session.sendMessage(new TextMessage(jsonStr));
            }
        }
    }

    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = (String)session.getAttributes().get("username");
        // 移除这个session
        sessions.remove(session);
        usernames.remove(username);
        // 发送一个谁谁谁下线了的消息给所有人
        Message message = new Message("系统消息", username + "下线了", 1);
        String jsonStr = om.writeValueAsString(message);
        sendAll(jsonStr);
        //  发送所有在线用户列表
        jsonStr = om.writeValueAsString(usernames);
        sendAll(jsonStr);
    }

    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String username = (String)session.getAttributes().get("username");
        // 获取用户发来的消息内容
        String msgStr = message.getPayload().toString();
        // 如果是\0（抖动暗号）
        Message msg = null;
        if("\0".equals(msgStr)) {
            msg = new Message("系统消息", username + "发送了一个窗口抖动。", 5);
        } else if (msgStr.startsWith("\1")) {
            String messageId = msgStr.substring(1); // 截取\1后面的字符
            msg = new Message("系统消息", username + "撤回了一条消息", 6, messageId);
        }else {
            msg = new Message(username, msgStr, 4, UUID.randomUUID().toString());
        }
        String jsonStr = om.writeValueAsString(msg);
        sendAll(jsonStr);
    }

    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    }

}

