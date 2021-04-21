package com.seecen.tencent.web;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller // 由spring创建实例化该类的对象
public class WebController {
    // url访问的映射地址，用户访问register.action可以进入到register方法
    @RequestMapping("/register.html")
    public String register() {
        // 转发跳转到templates下面的register.html页面
        return "register";
    }

    @RequestMapping("/login.html")
    public String login() {
        return "login";
    }

    @RequestMapping("/index.html")
    public String index() {
        return "index";
    }
}
