import api from "../api";

export default function triggerRestore() {
  // Create a hidden file input
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".sql";
  input.style.display = "none";
  document.body.appendChild(input);

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/admin/restore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data || "Restore completed successfully.");
    } catch (err) {
      alert(
        (err.response && err.response.data) || "Restore failed. Check server logs for details."
      );
    }
    document.body.removeChild(input);
  };

  input.click();
}
