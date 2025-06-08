'use client';
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { getDocs, productsCollection } from "../../helpers/firebaseConfig";
import Image from "next/image";
import ProductDrawer from "../../components/ProductDrawer";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [drawerProductId, setDrawerProductId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(productsCollection);
      const fetchedProducts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          images: Array.isArray(data.images) ? data.images : [],
        };
      });
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const handleFilter = () => {
    const [min, max] = priceRange;
    const filtered = products.filter(
      (product) => product.price >= min && product.price <= max
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h2>

          {/* Sidebar Filter Trigger */}
          <Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filter</Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
    <SheetHeader>
      <SheetTitle>Filter Products</SheetTitle>
    </SheetHeader>
    <div className="mt-6 space-y-6">
      <div>
        <Label className="text-sm">Price Range (₹)</Label>
        <Slider
          min={0}
          max={500} // ✅ updated max to ₹500
          step={10}
          defaultValue={priceRange}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
      <Button onClick={handleFilter} className="w-full">
        Apply Filters
      </Button>
    </div>
  </SheetContent>
</Sheet>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition"
            >
              <Image
                src={product.images[0] || "/placeholder.png"}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-md w-full h-64 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">₹{product.price}</p>

              <div className="mt-4 flex space-x-2 justify-center">
                <Button onClick={() => setDrawerProductId(product.id)} variant="default">
                  <FaEye className="mr-2" /> View
                </Button>
                <Button onClick={() => handleAddToCart(product)} className="bg-green-600 hover:bg-green-700">
                  <FaShoppingCart className="mr-2" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {drawerProductId && (
        <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} />
      )}
    </section>
  );
}
