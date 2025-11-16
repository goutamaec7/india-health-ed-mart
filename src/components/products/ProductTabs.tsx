import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Package, RotateCcw } from "lucide-react";
import type { Product } from "@/pages/Products";

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs = ({ product }: ProductTabsProps) => {
  const certifications = Array.isArray(product.certifications) 
    ? product.certifications 
    : [];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
        <TabsTrigger value="description" className="gap-2">
          <FileText className="h-4 w-4" />
          Description
        </TabsTrigger>
        <TabsTrigger value="specifications" className="gap-2">
          <Package className="h-4 w-4" />
          Specifications
        </TabsTrigger>
        <TabsTrigger value="certifications" className="gap-2">
          <Shield className="h-4 w-4" />
          Certifications
        </TabsTrigger>
        <TabsTrigger value="shipping" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Shipping & Returns
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">Product Description</h3>
          {product.description ? (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          ) : (
            <p className="text-muted-foreground">
              {product.product_name} is a high-quality {product.category} product 
              designed for professional use. This product meets industry standards 
              and is suitable for {product.subcategory} applications.
            </p>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Professional {product.category} applications</li>
              <li>Laboratory and research use</li>
              <li>Educational demonstrations</li>
              <li>Clinical settings</li>
            </ul>
          </div>
        </div>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications" className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y">
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-muted-foreground w-1/3">
                  Product Name
                </td>
                <td className="px-4 py-3">{product.product_name}</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  SKU
                </td>
                <td className="px-4 py-3">{product.sku}</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  Category
                </td>
                <td className="px-4 py-3 capitalize">{product.category}</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  Subcategory
                </td>
                <td className="px-4 py-3">{product.subcategory}</td>
              </tr>
              {product.manufacturer && (
                <tr className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-muted-foreground">
                    Manufacturer
                  </td>
                  <td className="px-4 py-3">{product.manufacturer}</td>
                </tr>
              )}
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  GST Rate
                </td>
                <td className="px-4 py-3">{product.gst_rate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Certifications Tab */}
      <TabsContent value="certifications" className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Product Certifications</h3>
        {certifications.length > 0 ? (
          <div className="space-y-4">
            {certifications.map((cert: any, idx: number) => (
              <div 
                key={idx}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {cert.name || cert}
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </h4>
                    {cert.code && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Code: {cert.code}
                      </p>
                    )}
                    {cert.authority && (
                      <p className="text-sm text-muted-foreground">
                        Issued by: {cert.authority}
                      </p>
                    )}
                    {cert.expiry && (
                      <p className="text-sm text-muted-foreground">
                        Valid until: {cert.expiry}
                      </p>
                    )}
                  </div>
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No certifications available for this product</p>
          </div>
        )}
      </TabsContent>

      {/* Shipping & Returns Tab */}
      <TabsContent value="shipping" className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">📦 Shipping Information</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Estimated delivery: 3-5 business days</li>
              <li>• Free shipping on orders above ₹5,000</li>
              <li>• Express delivery available</li>
              <li>• Secure packaging for delicate items</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">↩️ Return Policy</h4>
            <p className="text-muted-foreground mb-2">
              We accept returns within 7 days of delivery for unused products 
              in original packaging.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Item must be in original condition</li>
              <li>• Original packaging required</li>
              <li>• Refund processed within 5-7 business days</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> For healthcare and laboratory products, 
              specific regulations may apply. Contact our support team for details.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
