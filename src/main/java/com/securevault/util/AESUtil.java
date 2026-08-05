package com.securevault.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESUtil {

    private static final String SECRET_KEY = "1234567890123456";

    private static final SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");

    public static String encrypt(String data) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            byte[] encrypted = cipher.doFinal(data.getBytes());

            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public static String decrypt(String data) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            byte[] decoded = Base64.getDecoder().decode(data);

            return new String(cipher.doFinal(decoded));

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

}