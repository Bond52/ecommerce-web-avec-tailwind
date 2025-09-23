import 'package:flutter/material.dart';
import 'login_page.dart'; // 👈 ton écran de login

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // enlève le bandeau "debug"
      title: "App Livreur",
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginPage(), // 👈 page de login comme écran principal
    );
  }
}
