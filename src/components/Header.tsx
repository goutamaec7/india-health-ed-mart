import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderAuth } from "./HeaderAuth";
import { SearchBar } from "./search/SearchBar";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-xl font-bold text-foreground">MedEduTrade</span>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Products
              </a>
              <a href="#healthcare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Healthcare
              </a>
              <a href="#educational" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Educational
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:block w-80">
              <SearchBar />
            </div>
            
            <HeaderAuth />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* Mobile Search */}
                  <div className="mb-4">
                    <SearchBar />
                  </div>
                  
                  <a href="/products" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Products
                  </a>
                  <a href="#healthcare" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Healthcare Products
                  </a>
                  <a href="#educational" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Educational Products
                  </a>
                  <a href="#about" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                  <a href="#contact" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
