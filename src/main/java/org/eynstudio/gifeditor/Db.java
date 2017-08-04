package org.eynstudio.gifeditor;

import java.sql.*;

public class Db {
    static String sql = "insert into action_history(ip,url) values(?,?)";

    public static void addRecord(String ip, String url) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e1) {
            System.out.println("找不到MySQL驱动!");
            e1.printStackTrace();
        }

        PreparedStatement preStmt = null;
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/gif", "gif", "gif");
            preStmt = conn.prepareStatement(sql);
            preStmt.setString(1, ip);
            preStmt.setString(2, url);
            preStmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (preStmt != null) try {
                preStmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
