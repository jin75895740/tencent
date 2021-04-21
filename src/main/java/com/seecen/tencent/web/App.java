package com.seecen.tencent.web;

public class App {
    public static void main(String[] args) {
        byte num = 127;
        num++;
        System.out.println((int)(char)(byte)-1);
    }

    private static void aa() {
        try {
            System.out.println("try");
            aa();
        } catch (Throwable e) {
            System.out.println("catch....");
            e.printStackTrace();
        } finally {
            System.out.println("finally");
        }
    }
}
