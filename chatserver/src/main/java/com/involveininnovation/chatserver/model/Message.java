package com.involveininnovation.chatserver.model;

import com.involveininnovation.chatserver.model.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@ToString
public class Message {

    private String senderName;
    private String receiveName;
    private String message;
    private String date;
    private Status status;
}
