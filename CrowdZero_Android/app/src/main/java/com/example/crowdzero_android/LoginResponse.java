package com.example.crowdzero_android;

public class LoginResponse {
    public  String userid, success, fail;
}

public class DataParsingClass {
    static String Url;
    public static String Result;
    static JSONObject jsonString, subString;
    public static ArrayList<NameValuePair> nameValuePairs;

    public static void LoginData() {
        Url ="https://crowdzeromapi.herokuapp.com/";
        Result = HttpClass.getData(Url);

        try {

            jsonString = new JSONObject(Result);
            if (jsonString.length() > 0) {
                if (jsonString.has("userid")) {
                    LoginDataClass.userid= jsonString
                            .getString("userid");

                }
                if (jsonString.has("success")) {
                    LoginDataClass.success= jsonString
                            .getString("success");

                }
                if (jsonString.has("fail")) {
                    LoginDataClass.fail= jsonString
                            .getString("fail");

                }
            } catch (JSONException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }