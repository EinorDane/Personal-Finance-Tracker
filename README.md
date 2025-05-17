# Running This Project on a Different Device

## Prerequisites

1. **Java JDK 17 or newer**  
   Download and install from [Adoptium](https://adoptium.net/) or [Oracle](https://www.oracle.com/java/technologies/downloads/).

2. **Node.js (v16 or newer)**  
   Download and install from [https://nodejs.org/](https://nodejs.org/).

3. **MySQL Community Server**  
   Download and install from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/).  
   Remember your MySQL root password.

---

## Step 1: Set Up the Database

1. **Start MySQL Server** (use MySQL Workbench or Services app).
2. **Create the database and tables:**
   - Open MySQL Command Line or MySQL Workbench.
   - Run the following SQL:
     ```sql
     CREATE DATABASE IF NOT EXISTS financetracker;
     USE financetracker;

     CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) UNIQUE,
       email VARCHAR(255),
       password VARCHAR(255)
     );

     CREATE TABLE IF NOT EXISTS categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
    );

        CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE,
    category VARCHAR(255),
    date DATE,
    description VARCHAR(255),
    recurrence_rule VARCHAR(255),
    recurring BIT
    );

        CREATE TABLE IF NOT EXISTS budget (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE,
    category VARCHAR(255)
    );

        CREATE TABLE IF NOT EXISTS goal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    saved DOUBLE,
    target DOUBLE
    );
        ```
        
3. **(Optional) Restore from a backup:**  
   If you have a backup file (e.g., `db_backups\financetracker_backup_YYYY-MM-DD_HH-MM-SS.sql`), run:
   ```
   mysql -u root -p financetracker < db_backups\financetracker_backup_YYYY-MM-DD_HH-MM-SS.sql
   ```

---

## Step 2: Configure the Backend

1. Open `src/main/resources/application.properties`.
2. Set your database credentials:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/financetracker
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```
   Replace `YOUR_PASSWORD` with your MySQL root password.

---

## Step 3: Run the Backend

1. Open Command Prompt.
2. Navigate to the backend folder:
   ```
   cd d:\PROJECT\financetracker
   ```
3. Run the backend:
   ```
   gradlew bootRun
   ```
   *(or `./gradlew bootRun` in Git Bash/WSL, or use `mvn spring-boot:run` if using Maven)*

---

## Step 4: Run the Frontend

1. Open a new Command Prompt.
2. Navigate to the frontend folder:
   ```
   cd d:\PROJECT\financetracker\material-dashboard-react
   ```
3. Install dependencies (first time only):
   ```
   npm install
   ```
4. Start the frontend:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 5: Database Backup & Restore

**To back up the database:**
1. Double-click `backup.bat` or run:
   ```
   cd d:\PROJECT
   backup.bat
   ```
2. The backup file will be saved in the `db_backups` folder.

**To restore a backup:**
1. Open MySQL Command Line or Workbench.
2. Run:
   ```
   mysql -u root -p financetracker < db_backups\financetracker_backup_YYYY-MM-DD_HH-MM-SS.sql
   ```

---

## Troubleshooting

- **Port conflicts:** Make sure nothing else is using ports 8080 (backend) or 3000 (frontend).
- **Database errors:** Ensure MySQL is running and credentials are correct.
- **Dependencies:** If `npm install` or `gradlew bootRun` fails, check Node.js and Java installations.

---

## Summary Checklist

- [ ] Install Java, Node.js, MySQL
- [ ] Create database and tables (or restore backup)
- [ ] Configure `application.properties`
- [ ] Run backend (`gradlew bootRun`)
- [ ] Run frontend (`npm start`)
- [ ] Use `backup.bat` to back up data
- [ ] Use MySQL to restore backups

---

**This will ensure your project works on any device with minimal setup.**