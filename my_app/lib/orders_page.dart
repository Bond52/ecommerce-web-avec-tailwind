import 'package:flutter/material.dart';
import 'api_service.dart';

class OrdersPage extends StatefulWidget {
  @override
  _OrdersPageState createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  List<dynamic> orders = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  void fetchOrders() async {
    try {
      var data = await ApiService.getAllOrders();
      setState(() {
        orders = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  void updateStatus(String id, String status) async {
    bool ok = await ApiService.updateOrderStatus(id, status);
    if (ok) fetchOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("📦 Commandes à livrer")),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (context, i) {
                final o = orders[i];
                return Card(
                  child: ListTile(
                    title: Text("Commande #${o["_id"].substring(o["_id"].length - 6)} - ${o["status"]}"),
                    subtitle: Text("Total: ${o["total"]}\$"),
                    trailing: ElevatedButton(
                      onPressed: () => updateStatus(o["_id"], "terminee"),
                      child: Text("Marquer livrée"),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
