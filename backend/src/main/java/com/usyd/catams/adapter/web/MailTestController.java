package com.usyd.catams.adapter.web;

import com.usyd.catams.application.service.MailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class MailTestController {
    private final MailService mailService;

    public MailTestController(MailService mailService) {
        this.mailService = mailService;
    }

    @GetMapping("/mail")
    public String sendMail() {
        mailService.sendMail(
                "1842640660@qq.com",
                "CATAMS 工时审批提醒",
                "您好，您的工时记录已被讲师批准，请登录 CATAMS 系统查看详情。"
        );
        return "邮件已发送";
    }
}
