import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pfjyvskpoygmjctszoeq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmanl2c2twb3lnbWpjdHN6b2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5Mjc0ODcsImV4cCI6MjA2NjUwMzQ4N30.ieU9djwHI2jYx6W811fQJj5yPoITwC0FhbjKB0i2wBY"
);

  const form = document.getElementById("reservation-form");
  const submitBtn = document.getElementById("submit-btn");
  const editIdInput = document.getElementById("edit-id");

  window.prosesReservasi = async () => {
    const id = editIdInput.value;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      date: form.date.value,
      time: form.time.value,
      guests: parseInt(form.guests.value),
    };

    if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
      Swal.fire("Oops!", "Semua kolom wajib diisi!", "warning");
      return;
    }

    if (id) {
      // UPDATE DATA
      const { error } = await supabase.from("reservasi").update(data).eq("id", id);
      if (error) return Swal.fire("Gagal", error.message, "error");
      Swal.fire("Berhasil", "Reservasi berhasil diperbarui!", "success");
    } else {
      // INSERT DATA
      const { error } = await supabase.from("reservasi").insert([data]);
      if (error) return Swal.fire("Gagal", error.message, "error");
      Swal.fire("Sukses", "Reservasi berhasil dikirim!", "success");
    }

    form.reset();
    editIdInput.value = "";
    submitBtn.textContent = "Kirim Reservasi";
    tampilkanData();
  };

  window.editData = (id, name, email, phone, date, time, guests) => {
    form.name.value = name;
    form.email.value = email;
    form.phone.value = phone;
    form.date.value = date;
    form.time.value = time;
    form.guests.value = guests;
    editIdInput.value = id;
    submitBtn.textContent = "Update Reservasi";
  };

  window.hapusData = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal"
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase.from("reservasi").delete().eq("id", id);
      if (error) return Swal.fire("Gagal", error.message, "error");
      Swal.fire("Berhasil", "Data dihapus", "success");
      tampilkanData();
    }
  };

 async function tampilkanData() {
  const { data, error } = await supabase
    .from("reservasi")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("tabel-reservasi");
  if (error || !data) {
    container.innerHTML = "<p>Gagal memuat data.</p>";
    return;
  }

  // Buat baris data
  const rows =
    data.length > 0
      ? data
          .map(
            (d, i) => `
          <tr style="background:${i % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
            <td style="padding:8px;">${i + 1}</td>
            <td style="padding:8px;">${d.name}</td>
            <td style="padding:8px;">${d.email}</td>
            <td style="padding:8px;">${d.phone}</td>
            <td style="padding:8px;">${d.date}</td>
            <td style="padding:8px;">${d.time}</td>
            <td style="padding:8px;">${d.guests}</td>
            <td style="padding:8px; text-align:center;">
              <button onclick="editData(${d.id}, '${d.name}', '${d.email}', '${d.phone}', '${d.date}', '${d.time}', ${d.guests})"
                style="padding:4px 8px; background:#ffc107; border:none; border-radius:4px;">Edit</button>
              <button onclick="hapusData(${d.id})"
                style="padding:4px 8px; background:#dc3545; border:none; color:#fff; border-radius:4px;">Hapus</button>
            </td>
          </tr>`
          )
          .join("")
      : `
          <tr>
            <td colspan="8" style="text-align:center; padding:16px; font-style:italic; color:#666;">
              Belum ada data reservasi.
            </td>
          </tr>`;

  // Tampilkan ke HTML
  const tabel = `
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" class="table">
      <thead style="background:#007bff; color:#fff;">
        <tr>
          <th style="padding:8px;">No</th>
          <th style="padding:8px;">Nama</th>
          <th style="padding:8px;">Email</th>
          <th style="padding:8px;">Telepon</th>
          <th style="padding:8px;">Tanggal</th>
          <th style="padding:8px;">Waktu</th>
          <th style="padding:8px;">Tamu</th>
          <th style="padding:8px;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
  container.innerHTML = tabel;
}


  tampilkanData();
