package org.eynstudio.gifeditor;

import com.google.gson.Gson;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

public class GifMerger {

    MergeResp merge(HttpServletRequest req, String savePath) throws IOException {
        Gson gson = new Gson();
        MergeReq mergeReq = gson.fromJson(req.getReader(), MergeReq.class);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        AnimatedGifEncoder animatedGifEncoder = new AnimatedGifEncoder();
        animatedGifEncoder.start(os);
        animatedGifEncoder.setRepeat(0);
        for (int i = 0; i < mergeReq.Frames.size(); i++) {
            String x = mergeReq.Frames.get(i);
            String str = x.substring(22);
            BufferedImage bi = Utils.decodeToImage(str);
            animatedGifEncoder.setDelay(mergeReq.Delay);
            animatedGifEncoder.addFrame(bi);
        }
        animatedGifEncoder.finish();

        InputStream is = new ByteArrayInputStream(os.toByteArray());
        Qiniu.QiniuResp qiniuResp = new Qiniu().upload(is);
        MergeResp resp = new MergeResp();
        resp.Url = qiniuResp.key;

        if (mergeReq.IsSafari) {
            String path = new SimpleDateFormat("/yyyy/MM/dd/").format(Calendar.getInstance().getTime());
            resp.Url2 = path + qiniuResp.filename;
            File fp = new File(savePath + path);
            if (!fp.exists()) {
                fp.mkdirs();
            }
            FileOutputStream out = new FileOutputStream(savePath + path + qiniuResp.filename);
            os.writeTo(out);
        }
        Db.addRecord(req.getRemoteAddr(), resp.Url);

        return resp;
    }

    static class MergeReq {
        public int Delay;
        public int Width;
        public int Height;
        public boolean Trans;
        public boolean IsSafari;
        public int TransColor;
        public List<String> Frames;
    }

    public static class MergeResp {
        public String Msg;
        public String Url;
        public String Url2;
    }
}