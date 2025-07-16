import express from "express"; // Express framework
import bodyParser from "body-parser"; // JSON body parse etmek için
import cors from "cors"; // CORS ayarları
import authRoutes from "./routes/auth"; // Auth işlemleri route dosyası

const app = express(); // Uygulama nesnesi oluşturmak
const PORT = 3000; // Sunucunun dinleyeceği port

app.use(cors()); //CORS middleware'ini aktif etme
app.use(bodyParser.json()); // Gelen veriyi JSON olarak parse etme

app.use("/api", authRoutes); // "/api" ile başlayan istekleri authRoutes yönetecek

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Sunucuyu başlat
})
