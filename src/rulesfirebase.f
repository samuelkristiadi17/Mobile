rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User hanya bisa baca data dirinya sendiri
    match /users/{uid} {
      allow read, write: if request.auth != null && uid == request.auth.uid;
    }

    // Inventory hanya ADMIN
    match /inventory/{id} {
      allow read, write: if request.auth.token.role == "admin";
    }

    // Transaksi
    match /sales/{id} {
      // kasir bisa create transaksi
      allow create: if request.auth.token.role == "kasir" || request.auth.token.role == "admin";

      // admin bisa lihat semua transaksi
      allow read: if request.auth.token.role == "admin";
    }
  }
}
