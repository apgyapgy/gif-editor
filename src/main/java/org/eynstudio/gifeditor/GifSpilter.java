package org.eynstudio.gifeditor;

import sun.misc.BASE64Decoder;

import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class GifSpilter {

    public Resp.GifFrames fromJson(ApiServlet.ReqUrl json) throws IOException {
        if (json.Url != null) {
            return fromUrl(json.Url);
        }
        String imageString = json.Data.substring(22);
        BASE64Decoder decoder = new BASE64Decoder();
        byte[] imageByte = decoder.decodeBuffer(imageString);
        ByteArrayInputStream in = new ByteArrayInputStream(imageByte);
        return fromStream(in);
    }

    public Resp.GifFrames fromUrl(String urlStr) {
        InputStream in = null;
        try {
            in = getStreamFromUrl(urlStr);
        } catch (IOException e) {
            Resp.GifFrames frames = new Resp.GifFrames();
            frames.setIoErr();
            return frames;
        }
        return fromStream(in);
    }

    private InputStream getStreamFromUrl(String urlStr) throws IOException {
        URL url = new URL(urlStr);
        ;
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2979.0 Safari/537.36");
        conn.connect();
        if (!conn.getContentType().startsWith("image/gif")) {
            throw new IOException();
        }
        return conn.getInputStream();
    }

    public Resp.GifFrames fromStream(InputStream in) {
        Resp.GifFrames frames = new Resp.GifFrames();
        GifDecoder gifDecoder = new GifDecoder();
        if (gifDecoder.read(in) != 0) {
            frames.setFmtErr();
            return frames;
        }

        int c = gifDecoder.getFrameCount();
        frames.Width = gifDecoder.width;
        frames.Height = gifDecoder.height;

        frames.Trans = gifDecoder.transparency;
        if (frames.Trans) {
            frames.TransColor = gifDecoder.gct[gifDecoder.transIndex];
        }

        for (int i = 0; i < c; i++) {
            BufferedImage img = gifDecoder.getFrame(i);
            String result = "data:image/gif;base64," + Utils.encodeToString(img, "gif");
            frames.addFrame(result, gifDecoder.getDelay(i));
        }
        return frames;
    }
}
