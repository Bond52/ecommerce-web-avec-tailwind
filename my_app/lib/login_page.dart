import 'package:flutter/material.dart';
import 'api_service.dart';
import 'orders_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  String error = "";

  void handleLogin() async {
    bool ok = await ApiService.login(emailCtrl.text, passCtrl.text);
    if (ok) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OrdersPage()),
      );
    } else {
      setState(() => error = "❌ Identifiants incorrects");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Login Livreur")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: emailCtrl, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: passCtrl, decoration: InputDecoration(labelText: "Mot de passe"), obscureText: true),
            SizedBox(height: 20),
            ElevatedButton(onPressed: handleLogin, child: Text("Se connecter")),
            if (error.isNotEmpty) Text(error, style: TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }
}
