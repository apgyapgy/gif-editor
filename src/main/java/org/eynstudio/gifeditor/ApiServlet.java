package org.eynstudio.gifeditor;

import com.google.gson.Gson;
import sun.security.ssl.Debug;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URLEncoder;
import java.util.Collection;
import java.util.List;


@WebServlet("/api/up")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 24, // 2MB
        maxFileSize = 1024 * 1024 * 40,      // 40MB
        maxRequestSize = 1024 * 1024 * 50)   // 50MB
public class ApiServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getContentType().startsWith("application/json")) {
            Gson gson = new Gson();
            ReqUrl reqUrl = gson.fromJson(request.getReader(), ReqUrl.class);
            GifSpilter gifSpilter = new GifSpilter();
            Resp.respJson(response, gifSpilter.fromJson(reqUrl));
            return;
        }

        Resp.GifFrames frames = new Resp.GifFrames();
        Collection<Part> parts = request.getParts();
        if (parts.size() != 1) {
            frames.Msg = "必须上传1个GIF图片";
            Resp.respJson(response, frames);
            return;
        }

        Part part = parts.iterator().next();
        if (part.getSize() > 1024 * 1024 * 20) {
            frames.Msg = "GIF图片大小不能超过20M";
            Resp.respJson(response, frames);
            return;
        }
        GifSpilter gifSpilter = new GifSpilter();
        frames = gifSpilter.fromStream(part.getInputStream());
        Resp.respJson(response, frames);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String fileName = request.getParameter("file");
        String filePath = this.getServletContext().getRealPath("/files") + fileName;
        File downloadFile = new File(filePath);
        if (downloadFile.exists()) {
            response.setContentType("application/octet-stream");
            Long length = downloadFile.length();
            response.setContentLength(length.intValue());
            fileName = URLEncoder.encode(downloadFile.getName(), "UTF-8");
            response.addHeader("Content-Disposition", "attachment; filename=" + fileName);

            ServletOutputStream servletOutputStream = response.getOutputStream();
            FileInputStream fileInputStream = new FileInputStream(downloadFile);
            BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
            int size = 0;
            byte[] b = new byte[4096];
            while ((size = bufferedInputStream.read(b)) != -1) {
                servletOutputStream.write(b, 0, size);
            }
            servletOutputStream.flush();
            servletOutputStream.close();
            bufferedInputStream.close();
        }
    }

    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        GifMerger gifMerger = new GifMerger();
        try {
            Resp.respJson(response, gifMerger.merge(request, this.getServletContext().getRealPath("/files")));
        } catch (IOException e) {
            GifMerger.MergeResp resp = new GifMerger.MergeResp();
            resp.Msg = "操作失败，请重试。";
            Resp.respJson(response, resp);
        }
    }

    static class ReqUrl {
        public String Url;
        public String Data;
    }

}
