import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const products = [
  {
    title: "Notebook Lenovo IdeaPad 3",
    description: "Notebook 15.6'' Ryzen 5, 8GB RAM, 512GB SSD",
    price: 379990,
    category: "Tecnología",
    stock: 15,
    
  },
  {
    title: "Smart TV Samsung 55'' 4K UHD",
    description: "Pantalla LED con resolución 4K y conexión WiFi",
    price: 449990,
    category: "Electrodomésticos",
    stock: 8,
    
  },
  {
    title: "Celular Xiaomi Redmi Note 13 Pro",
    description: "Pantalla AMOLED, 256GB almacenamiento, 8GB RAM",
    price: 299990,
    category: "Telefonía",
    stock: 20,
    
  },
  {
    title: "Audífonos Bluetooth Sony WH-CH520",
    description: "Auriculares inalámbricos con micrófono y batería de 50h",
    price: 89990,
    category: "Audio",
    stock: 25,
    
  },
  {
    title: "Mouse Logitech G Pro X Superlight",
    description: "Mouse gamer inalámbrico ultraligero, sensor HERO 25K",
    price: 129990,
    category: "Periféricos",
    stock: 30,
    
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(" Productos insertados correctamente");
  } catch (error) {
    console.error(" Error al insertar productos:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
