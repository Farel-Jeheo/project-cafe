import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://gfdkeutgojqefygoxnow.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZGtldXRnb2pxZWZ5Z294bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mjk5NDksImV4cCI6MjA2NTQwNTk0OX0.vWQ70YA7egXTLg8glagWKhhjmIqpohxByA5Vgnv_eMk"
);

window.kirimReservasi = async function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = parseInt(document.getElementById("guests").value);

  if (!name || !email || !phone || !date || !time || !guests) {
    Swal.fire("Oops!", "Semua kolom wajib diisi!", "warning");
    return;
  }

  const { error } = await supabase.from("reservasi").insert([
    { name, email, phone, date, time, guests }
  ]);

  if (error) {
    Swal.fire("Gagal!", error.message, "error");
  } else {
    Swal.fire("Sukses!", "Reservasi berhasil dikirim", "success");
    document.getElementById("reservation-form").reset();
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

  const table = `
    <h3 style="margin-bottom: 10px;">Daftar Reservasi</h3>
    <table style="width:100%; border-collapse:collapse; box-shadow:0 0 8px rgba(0,0,0,0.1); border-radius:8px; overflow:hidden;">
      <thead style="background: linear-gradient(to right, #007bff, #00c6ff); color: white;">
        <tr>
          <th style="padding:12px; text-align:left;">No</th>
          <th style="padding:12px; text-align:left;">Nama</th>
          <th style="padding:12px; text-align:left;">Email</th>
          <th style="padding:12px; text-align:left;">Telepon</th>
          <th style="padding:12px; text-align:left;">Tanggal</th>
          <th style="padding:12px; text-align:left;">Waktu</th>
          <th style="padding:12px; text-align:left;">Tamu</th>
          <th style="padding:12px; text-align:center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (d, i) => `
            <tr style="background-color:${i % 2 === 0 ? '#ffffff' : '#f0f8ff'};">
              <td style="padding:10px;">${i + 1}</td>
              <td style="padding:10px;">${d.name}</td>
              <td style="padding:10px;">${d.email}</td>
              <td style="padding:10px;">${d.phone}</td>
              <td style="padding:10px;">${d.date}</td>
              <td style="padding:10px;">${d.time}</td>
              <td style="padding:10px;">${d.guests}</td>
              <td style="padding:10px; text-align:center;">
                <button onclick="editData(${d.id}, '${d.name}', '${d.email}', '${d.phone}', '${d.date}', '${d.time}', ${d.guests})"
                  style="background:#ffc107; border:none; padding:5px 10px; border-radius:4px; margin-right:5px;">Edit</button>
                <button onclick="hapusData(${d.id})"
                  style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px;">Hapus</button>
              </td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = table;
}

// Modal logic
window.editData = function (id, name, email, phone, date, time, guests) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = name;
  document.getElementById("edit-email").value = email;
  document.getElementById("edit-phone").value = phone;
  document.getElementById("edit-date").value = date;
  document.getElementById("edit-time").value = time;
  document.getElementById("edit-guests").value = guests;
  document.getElementById("edit-modal").style.display = "flex";
};

window.tutupModalEdit = function () {
  document.getElementById("edit-modal").style.display = "none";
};

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;

  const data = {
    name: document.getElementById("edit-name").value,
    email: document.getElementById("edit-email").value,
    phone: document.getElementById("edit-phone").value,
    date: document.getElementById("edit-date").value,
    time: document.getElementById("edit-time").value,
    guests: parseInt(document.getElementById("edit-guests").value),
  };

  const { error } = await supabase.from("reservasi").update(data).eq("id", id);
  if (error) {
    Swal.fire("Gagal!", error.message, "error");
  } else {
    Swal.fire("Sukses!", "Data berhasil diubah", "success");
    document.getElementById("edit-modal").style.display = "none";
    tampilkanData();
  }
});

// Hapus data
window.hapusData = async function (id) {
  const confirm = await Swal.fire({
    title: "Yakin ingin menghapus?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal"
  });

  if (confirm.isConfirmed) {
    const { error } = await supabase.from("reservasi").delete().eq("id", id);
    if (error) {
      Swal.fire("Gagal!", error.message, "error");
    } else {
      Swal.fire("Berhasil!", "Data dihapus", "success");
      tampilkanData();
    }
  }
};

tampilkanData();
