package backend;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/FileUploadServlet")
@MultipartConfig
public class FileUploadServlet extends HttpServlet {

    private final Gson gson = new Gson();


    /* ───────────────────────── CSV helper ────────────────────────── */
    /** very small RFC‑4180 parser that returns one row as a List<String> */
    private static List<String> parseCsvLine(String line) {
        List<String> out = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        boolean inQuote = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (inQuote) {
                if (c == '"') {
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        cur.append('"');   // escaped quote
                        i++;               // skip next "
                    } else {
                        inQuote = false;   // closing quote
                    }
                } else {
                    cur.append(c);
                }
            } else {
                if (c == '"') {
                    inQuote = true;
                } else if (c == ',') {
                    out.add(cur.toString().trim());
                    cur.setLength(0);
                } else {
                    cur.append(c);
                }
            }
        }
        out.add(cur.toString().trim());
        return out;
    }
    /* ─────────────────────────────────────────────────────────────── */

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        String email = req.getParameter("email");
        Part   file  = req.getPart("file");

        if (email == null || email.isBlank() || file == null || file.getSize() == 0) {
            resp.sendError(400,"email and CSV file are required");
            return;
        }

        try (Connection conn = DBManager.getConnection()) {

            /* ───── get user_id ───── */
            int uid = -1;
            try (PreparedStatement ps =
                     conn.prepareStatement("SELECT user_id FROM Users WHERE email=?")){
                ps.setString(1,email.trim());
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) uid = rs.getInt(1);
                }
            }
            if (uid == -1){ resp.sendError(404,"user not found"); return; }

            conn.setAutoCommit(false);

            PreparedStatement selCourse = conn.prepareStatement(
                    "SELECT courseID FROM Course WHERE courseName=?");
            PreparedStatement insCourse = conn.prepareStatement(
                    "INSERT INTO Course (courseName,courseDates,courseTime) VALUES (?,?,?)",
                    Statement.RETURN_GENERATED_KEYS);
            PreparedStatement insAssign = conn.prepareStatement(
                    "INSERT INTO Assignment (courseID,aName,descr,dueDate,dueTime) VALUES (?,?,?,?,?)");
            PreparedStatement insUC = conn.prepareStatement(
                    "INSERT IGNORE INTO UserCourse (user_id,courseID) VALUES (?,?)");

            int added = 0;
            try (BufferedReader r = new BufferedReader(
                    new InputStreamReader(file.getInputStream()))) {

                String line; boolean header=true;
                while ((line = r.readLine()) != null) {

                    if (header){ header=false; continue; }   // skip header

                    List<String> f = parseCsvLine(line);
                    if (f.size() < 5) continue;

                    String cName = f.get(0);
                    String aName = f.get(1);
                    String descr = f.get(2);
                    String dueD  = f.get(3);
                    String dueT  = f.get(4);
                    if (cName.isEmpty()||aName.isEmpty()||dueD.isEmpty()||dueT.isEmpty())
                        continue;

                    /* ─ find / create course ─ */
                    int cid;
                    selCourse.setString(1, cName);
                    try (ResultSet rs = selCourse.executeQuery()) {
                        if (rs.next()) {
                            cid = rs.getInt(1);
                        } else {
                            insCourse.setString(1, cName);
                            insCourse.setString(2, "TBA");
                            insCourse.setString(3, "TBA");
                            insCourse.executeUpdate();
                            try (ResultSet k = insCourse.getGeneratedKeys()) {
                                k.next(); cid = k.getInt(1);
                            }
                        }
                    }

                    /* ─ insert assignment ─ */
                    insAssign.setInt   (1, cid);
                    insAssign.setString(2, aName);
                    insAssign.setString(3, descr);
                    insAssign.setString(4, dueD);
                    insAssign.setString(5, dueT);
                    insAssign.executeUpdate();
                    added++;

                    /* ─ ensure enrollment ─ */
                    insUC.setInt(1, uid);
                    insUC.setInt(2, cid);
                    insUC.addBatch();
                }
            }
            insUC.executeBatch();
            conn.commit();

            out.write(gson.toJson(Map.of(
                    "status","ok",
                    "assignmentsAdded",added)));

        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(500,"db error");
        }
    }
}
