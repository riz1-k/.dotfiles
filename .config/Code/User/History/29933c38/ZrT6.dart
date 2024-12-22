import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Arifs Basic Flutter App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'SourGummy', // Use the custom font as the default
      ),
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  final List<String> localImages = [
    'assets/images/cat1.jpg',
    'assets/images/cat2.jpg',
    'assets/images/cat3.jpg',
  ];

  final List<String> remoteImages = [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    'https://images.pexels.com/photos/1633522/pexels-photo-1633522.jpeg'
  ];

  HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Basic Flutter App'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            // Horizontal ListView with remote images
            SizedBox(
              height: 150,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: remoteImages.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Image.network(remoteImages[index]),
                  );
                },
              ),
            ),
            const SizedBox(height: 20), // Space between ListViews and ListTiles

            // ListTile items with different font variants
            const ListTile(
              leading: Icon(Icons.star),
              title: Text(
                'this is my Regular Font',
                style: TextStyle(fontFamily: 'SourGummy'),
              ),
            ),
            const ListTile(
              leading: Icon(Icons.favorite),
              title: Text(
                'this is my Bold Font',
                style: TextStyle(
                    fontFamily: 'SourGummy', fontWeight: FontWeight.bold),
              ),
            ),
            const ListTile(
              leading: Icon(Icons.lightbulb),
              title: Text(
                'Italic Font',
                style: TextStyle(
                    fontFamily: 'SourGummy', fontStyle: FontStyle.italic),
              ),
            ),
            const ListTile(
              leading: CircleAvatar(child: Icon(Icons.person)),
              title: Text(
                'Default Device Font',
              ),
            ),
            const SizedBox(height: 20),

            // Horizontal ListView with local images
            SizedBox(
              height: 150,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: localImages.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Image.asset(localImages[index]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
