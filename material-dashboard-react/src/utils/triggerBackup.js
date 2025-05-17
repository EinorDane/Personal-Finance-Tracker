import api from "../api";

export default async function triggerBackup() {
  try {
    const res = await api.post("/api/admin/backup");
    alert(res.data || "Backup completed successfully.");
  } catch (err) {
    alert((err.response && err.response.data) || "Backup failed. Check server logs for details.");
  }
}
