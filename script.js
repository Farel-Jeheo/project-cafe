import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pfjyvskpoygmjctszoeq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmanl2c2twb3lnbWpjdHN6b2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5Mjc0ODcsImV4cCI6MjA2NjUwMzQ4N30.ieU9djwHI2jYx6W811fQJj5yPoITwC0FhbjKB0i2wBY"
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

  if (error) {
    container.innerHTML = "<p>Gagal memuat data.</p>";
    return;
  }

  if (data.length === 0) {
    container.innerHTML = "<p>Belum ada reservasi.</p>";
    return;
  }

  const table = `
    <h3>Daftar Reservasi</h3>
    <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Telepon</th>
          <th>Tanggal</th>
          <th>Waktu</th>
          <th>Jumlah Tamu</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (d) => `
            <tr>
              <td>${d.name}</td>
              <td>${d.email}</td>
              <td>${d.phone}</td>
              <td>${d.date}</td>
              <td>${d.time}</td>
              <td>${d.guests}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = table;
}

// Panggil saat pertama buka
tampilkanData();
