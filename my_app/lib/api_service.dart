import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "https://ecommerce-web-avec-tailwind.onrender.com/api";

  static String? token; // stocke le JWT

  // 🔑 Login livreur
  static Future<bool> login(String email, String password) async {
    final res = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      token = data["token"];
      return true;
    } else {
      return false;
    }
  }

  // 📦 Récupérer toutes les commandes
  static Future<List<dynamic>> getAllOrders() async {
    final res = await http.get(
      Uri.parse("$baseUrl/orders/all"),
      headers: {"Authorization": "Bearer $token"},
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body);
    } else {
      throw Exception("Erreur chargement commandes");
    }
  }

  // 🔄 Mettre à jour le statut d’une commande
  static Future<bool> updateOrderStatus(String id, String status) async {
    final res = await http.patch(
      Uri.parse("$baseUrl/orders/$id/status"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({"status": status}),
    );

    return res.statusCode == 200;
  }
}
