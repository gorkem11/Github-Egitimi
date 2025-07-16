import express from "express"; //Express modulünü içe aktar
import jwt from "jsonwebtoken"; // Sahte JWT üretmek için
import {Request, Response} from "express"; // Tip güvenliği için 
import authMiddleware from "../middleware/authMiddleware"; //Token kontrolü

const router = express.Router(); // Express Router oluşturma

// Kullanıcıları tutacağımız geçici dizi
const users: {email: string; password: string}[] = [];

// Register endpoint - Yeni kullanıcı oluşturur
router.post("/register", (req: Request, res: Response) => {
    const {email, password} = req.body; // Body'den e-posta ve şifre al

    // E-posta zaten varsa hata dön 
    if(!email || !password){
        return res.status(400).json({message: "Email ve şifre gereklidir."});
    }

    // Yeni kullanıcıyı diziye ekle 
    users.push({email, password});

    res.status(201).json({message: "Kullanıcı başarıyla oluşturuldu."});
});

// Login endpoint - Giriş yapan kullanıcıya sahte JWT verir
router.post("/login", (req: Request, res: Response) => {
    const{email, password}  = req.body;

    // Giriş bilgileri eksikse hata dön 
    if(!email || !password) {
        return res.status(400).json({message: "Email ve şifre zorunludur."});
    }

    // KUllanıcıyı listede bul 
    const user = users.find(u => u.email === email && u.password === password);

    if(!user) {
        return res.status(401).json({message: "Geçersiz e-posta veya şifre."});
    }

    // Sahte JWT token üret
    const token = jwt.sign({email: user.email}, "secretkey", {
        expiresIn: "1h", // Token 1 saat geçerli
    });

    // Me endpoint - Token geçerliyse kullanıcıya döner
    router.get("/me", authMiddleware, (req: Request, res: Response) => {
        const userEmail = (req as any).user?.email;

        // Kullanıcı email'ine göre bilgiyi getir
        const user = users.find(u => u.email === userEmail);

        if(!user) {
            return res.status(404).json({message: "Kullanıcı bulunamadı."});
        }

        res.json({email: user.email});
    })


})



export default router;