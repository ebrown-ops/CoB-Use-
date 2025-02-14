import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function ComparisonModal({ isOpen, onClose, products }) {
  const [open, setOpen] = useState(isOpen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSaveComparison = async () => {
    setLoading(true);
    try {
      // Simulating an API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) { // 80% success rate
            resolve();
          } else {
            reject(new Error('Failed to save comparison'));
          }
        }, 1000);
      });
      console.log('Saving comparison:', products);
      toast({
        title: "Comparison Saved",
        description: "Your comparison has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast({
        title: "Error",
        description: "Failed to save comparison. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  const commonFeatures = ['price', 'rating'];
  const features = [...new Set(products.flatMap(product => 
    Object.keys(product).filter(key => !['id', 'name', 'category'].includes(key))
  ))];

  const chartData = commonFeatures.map(feature => {
    const data = { name: feature };
    products.forEach(product => {
      data[product.name] = typeof product[feature] === 'number' ? product[feature] : 0;
    });
    return data;
  });

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Comparison</DialogTitle>
              <DialogDescription>Compare features of selected products</DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Table className="mb-8">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Feature</TableHead>
                    {products.map((product) => (
                      <TableHead key={product.id} className="w-1/4">{product.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature}>
                      <TableCell className="font-medium">{feature}</TableCell>
                      {products.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <span data-tooltip-id={`${product.id}-${feature}`} data-tooltip-content={`${product.name} - ${feature}`}>
                            {typeof product[feature] === 'boolean' 
                              ? (product[feature] ? '✅' : '❌')
                              : product[feature] || 'N/A'}
                          </span>
                          <ReactTooltip id={`${product.id}-${feature}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mb-8 h-64 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {products.map((product, index) => (
                      <Bar key={product.id} dataKey={product.name} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveComparison} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Comparison
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}