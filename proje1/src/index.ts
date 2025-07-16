import express from "express";
import notesRouter from "./routes/notes";

const app = express(); // Yeni bir expresss uygulaması başlatıyoruz.
const port = 3000; // Sunucunun çalışacağı port numarası

app.use(express.json()); // EXpress'in gövde verilerini JSON olarak işlemesini sağlıyoruz

app.get("/", (req, res) => {
    // Ana rotaya (/) istek gelirse basit bir yanıt dönülüyor
    res.send("Not Defteri API çalışıyor!");
});

// /notes ile başlayan rotaları, notesRouter üzerinden yönlendiriyoruz
app.use("/notes", notesRouter);

// Sunucuyu başlatıyoruz
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});


