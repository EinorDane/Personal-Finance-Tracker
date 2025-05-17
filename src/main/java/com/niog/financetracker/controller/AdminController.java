package com.niog.financetracker.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PostMapping("/backup")
    public ResponseEntity<?> backupDatabase() {
        try {
            // Run the backup.bat script in the project directory
            ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", "backup.bat");
            pb.directory(new File("d:/PROJECT/financetracker"));
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                return ResponseEntity.ok("Backup completed successfully.");
            } else {
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                StringBuilder errorMsg = new StringBuilder();
                String line;
                while ((line = errorReader.readLine()) != null) {
                    errorMsg.append(line).append("\n");
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Backup failed. Error: " + errorMsg.toString());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Backup failed: " + e.getMessage());
        }
    }

    @PostMapping("/restore")
    public ResponseEntity<?> restoreDatabase(@RequestParam("file") MultipartFile file) {
        try {
            // Save the uploaded file to a temp location
            File tempFile = File.createTempFile("restore-", ".sql");
            file.transferTo(tempFile);

            // Run the mysql restore command
            ProcessBuilder pb = new ProcessBuilder(
                "cmd.exe", "/c",
                "mysql -u root -pDontForget123 financetracker < " + tempFile.getAbsolutePath()
            );
            pb.directory(new File("d:/PROJECT/financetracker"));
            Process process = pb.start();
            int exitCode = process.waitFor();

            tempFile.delete();

            if (exitCode == 0) {
                return ResponseEntity.ok("Restore completed successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Restore failed. Check server logs.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Restore failed: " + e.getMessage());
        }
    }
}