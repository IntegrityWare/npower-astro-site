import React from "react";
import { ShoppingCart } from "lucide-react";

export default function BuyButton({ product }) {
  if (!product.buyUrl) return null;
  return (
    <a
      href={product.buyUrl}
      className="btn-anim inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg whitespace-nowrap"
    >
      <ShoppingCart className="w-4 h-4" /> Buy {product.shortName}
    </a>
  );
}
