import LoadingSpinner from "@/components/Loading";
import { Product } from "@/app/api/stripe/products/route";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { Template } from "@prisma/client";

export default function FixedPricing({ template, onPriceChange }: { template: Template, onPriceChange: (priceId: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      const products = await fetch(`/api/stripe/products`).then((res) => res.json());
      setProducts(products);
      setSelectedPriceId(template.priceId);
    }
    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriceId(e.target.value);
    onPriceChange(e.target.value);
  }

  return (
    <div className="p-5">
      {products.length === 0 && <LoadingSpinner size={64} />}
      <label htmlFor="priceId">Select a product for the template</label>
      <Input type="select" name="priceId" onChange={handlePriceChange} value={selectedPriceId}>
        <option value="dummy">Select a product</option>
        {products.flatMap(product => product.prices?.map(price => (
          <option key={price.id} value={price.id}>{product.name} - {price.unit_amount ? (price.unit_amount / 100).toFixed(2) : "N/A"} {price.currency.toLocaleUpperCase()}</option>
        )))}
      </Input>
    </div>
  );
}