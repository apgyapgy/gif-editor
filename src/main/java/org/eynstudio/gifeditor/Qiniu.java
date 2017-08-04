package org.eynstudio.gifeditor;

import com.qiniu.common.Zone;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

public class Qiniu {
    static String ACCESS_KEY = "epZ_Z3u8vSUYwsD6w7wJst-d-KF0Xr-E3bL7jNsp";
    static String SECRET_KEY = "8qI28KE3_kNnYG-t6g2mDnCcQx_90Blj6jR9HhVw";
    static String bucketname = "soogif-tools";
    static String host="http://img.whatthehell.cn/";

    private Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
    private Zone z = Zone.autoZone();
    private Configuration c = new Configuration(z);
    private UploadManager uploadManager = new UploadManager(c);

    private String getUpToken() {
        return auth.uploadToken(bucketname);
    }

    public QiniuResp upload(InputStream in) throws IOException {
        String key = UUID.randomUUID().toString() + ".gif";
        Response res = uploadManager.put(in, key, getUpToken(), null, null);
        QiniuResp resp= res.jsonToObject(QiniuResp.class);
        resp.key=host+resp.key;
        resp.filename=key;
        return resp;
    }

    public static class QiniuResp {
        public String hash;
        public String key;
        public String filename;
    }
}
