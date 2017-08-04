package org.eynstudio.gifeditor;

import com.google.gson.Gson;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class Resp {
    public static void respJson(HttpServletResponse resp, Object obj) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String str = new Gson().toJson(obj);
        PrintWriter out = resp.getWriter();
        out.println(str);
    }

    public static void respJsonErr(HttpServletResponse resp, String msg) throws IOException {
        respJson(resp, new Status(1, msg));
    }

    static class Status {
        public int Code;
        public String Msg;

        public Status(int code, String msg) {
            this.Code = code;
            this.Msg = msg;
        }
    }

    static class GifFrame {
        public String Data;
        public int Delay;
    }

    static class GifFrames {
        static String IoErr = "GIF图片网址无效，请填写有效的GIF图片网址";
        static String FmtErr = "GIF图片格式错误，请上传有效的GIF图片";
        public String Msg;
        public int Width;
        public int Height;
        public boolean Trans;
        public int TransColor;
        public List<GifFrame> Frames = new ArrayList<>();

        public void addFrame(String str, Integer delay) {
            GifFrame f = new GifFrame();
            f.Data = str;
            f.Delay = delay;
            Frames.add(f);
        }

        public void setIoErr() {
            this.Msg = IoErr;
        }

        public void setFmtErr() {
            this.Msg = FmtErr;
        }
    }
}

