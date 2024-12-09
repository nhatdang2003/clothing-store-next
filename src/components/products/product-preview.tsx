import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductData } from "@/types/product";

interface ProductPreviewProps {
  product: ProductData;
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-2xl font-bold">Product Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-bold text-2xl text-primary">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold text-green-600">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.images.map((image: any, index: any) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />
            ))}
          </div>
          <div>
            <p className="font-semibold text-lg mb-2">Variants:</p>
            <ul className="space-y-2">
              {product.variants.map((variant: any, index: any) => (
                <li key={index} className="bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    {variant.images[0] && (
                      <img
                        src={variant.images[0]}
                        alt={`Variant ${index + 1}`}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <span className="font-medium">
                        {variant.color} - {variant.size}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        (Qty: {variant.quantity})
                      </span>
                      {variant.differencePrice !== 0 && (
                        <span className="text-sm text-gray-600 ml-2">
                          ($
                          {(product.price + variant.differencePrice).toFixed(2)}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {product.isFeatured && (
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Featured Product
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
