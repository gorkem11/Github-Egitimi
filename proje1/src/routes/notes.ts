import express from 'express'; //Express framework'ünü projeye dahil etme
import {v4 as uuidv4} from 'uuid'; //Benzersiz ID üretmek için uuid kütüphaneisnden v4 fonksiyonunu alıyoruz

const router = express.Router(); //Yeni bir Ezpress Router objesi oluşturuyoruz. Bu sayede bu dosyada kendi rotalarımızı tanımlayabiliriz

// Notların yapısını belirleyen Typescript arayüzü
interface Note {
    id: string; // Her notun benzersiz kimliği
    title: string; // Notun Başlığı
    content: string; // Notun içeriği
    createdAt: string; // Oluşturulma tarihi
}
// Geçici notları tutan dizi (Veritabanı kullanmadığımız için bellekte saklanıyor.)
const notes: Note[] = [];

// GET /notes - Tüm notları getirir
router.get('/', (req, res) => {
    res.json(notes); // JSON formatında notları döner
})

// POST /notes - Yeni bir not ekler 
router.post('/', (req, res) => {
    // İstek gövdesinden başlık ve içerik bilgilerini alıyoruz
    const {title, content} = req.body;

    // Başlık veya içerik eksikse kullanıcıya hata mesajı gönder
    if(!title || !content) {
        return res.status(400).json({message: "Başlık ve içerik zorunludur. "});
    }

    // Yeni not nesnesi oluşturluyor
    const newNote: Note = {
        id: uuidv4(), // Benzersiz ID oluşturuluyor
        title,
        content,
        createdAt: new Date().toISOString() // ISO formatında oluşturulma tarihi ekleniyor
    };

    // Yeni notu diziye ekliyoruz
    notes.push(newNote);

    // Kullanıcıya başarılı şekilde oluşturulduğunu blirten cevap dönülüyor
    res.status(201).json(newNote);
})

export default router; // Bu router dosyasını dışa aktarıyoruz ki index.ts içinde kullanılabilsin  

// Belirli bir notu ID ile getirir
router.get("/:id", (req, res) => {
    const noteId = req.params.id; // URL'den gelen id parametresini al
 
// notlar dizisinde bu id'ye sahip notu bul 
const foundNote = notes.find(note => note.id === noteId);

// Eğer not bulunmazsa 404 döndür
if (!foundNote) {
    return res.status(404).json({message: "Not bulunamadı."});
}


// Not bulunduysa kullanıcıya JSON formatında gönder
res.json(foundNote);
});

router.delete("/:id", (req, res) => {
    const noteId = req.params.id;

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1){
        return res.status(404).json({message: "Silinecek not bulunamadı."});
    }

    notes.splice(noteIndex, 1); // Bu satır diziden notu kaldırır

    res.json({message: "Not başarıyla silindi."});

})

// PUT Metodu notun tamamını günceller
router.put("/:id", (req, res) => {
    const noteId = req.params.id;

    const {title, content} = req.body;
    
    if(!title || !content) {
        return res.status(400).json({message: "Başlık ve içerik zorunludur."});
    }

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if(noteIndex === -1){
        return res.status(404).json({message: "Güncellenecek not bulunamadı."});
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        content
    };

    res.json({message: "Not başarıyla güncellendi.", note: notes[noteIndex]})

})

// PATCH metodu  Kısmi Günceleme yapar. Sadece değişen kısmı değiştirir
router.proppatch("/:id", (req, res) => {
    const noteId = req.params.id;

    const {title, content} = req.body;

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json({message: "Güncellenecek not bulunmadı."})
    }

    if (title) {
        notes[noteIndex].title = title
    }

    if (content){
        notes[noteIndex].content = content;
    }

    res.json({message: "Not başarıyla güncellendi.", note: notes[noteIndex]});

})






