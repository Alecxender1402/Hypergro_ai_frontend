import React from "react";
import Header from "@/components/Header";
import PropertyList from "@/components/properties/PropertyList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PropertyList />
    </div>
  );
};

export default Index;
