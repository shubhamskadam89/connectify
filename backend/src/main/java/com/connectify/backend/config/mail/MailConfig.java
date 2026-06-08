package com.connectify.backend.config.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${SMTP_HOST}")
    private String host;

    @Value("${SMTP_PORT:587}")
    private int port;

    @Value("${SMTP_USERNAME}")
    private String username;

    @Value("${SMTP_PASSWORD}")
    private String password;

    @Value("${SMTP_AUTH:true}")
    private String auth;

    @Value("${SMTP_STARTTLS_ENABLE:true}")
    private String startTlsEnable;

    @Value("${SMTP_SSL_TRUST:${SMTP_HOST}}")
    private String sslTrust;

    @Value("${SMTP_DEBUG:false}")
    private String debug;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(username);
        sender.setPassword(password);

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", startTlsEnable);
        props.put("mail.smtp.ssl.trust", sslTrust);
        props.put("mail.debug", debug);
        props.put("mail.mime.charset", "UTF-8");

        return sender;
    }
}
