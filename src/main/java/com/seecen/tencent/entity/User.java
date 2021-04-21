package com.seecen.tencent.entity;

import java.io.Serializable;

/**
 * javabean
 * 封装： 属性私有化
 * 提供共有的get,set方法
 */
public class User implements Serializable {
    private String username;
    private String password;
    private byte[] faceByte;
    // code  generate  getterAndSetter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public byte[] getFaceByte() {
        return faceByte;
    }

    public void setFaceByte(byte[] faceByte) {
        this.faceByte = faceByte;
    }
}
