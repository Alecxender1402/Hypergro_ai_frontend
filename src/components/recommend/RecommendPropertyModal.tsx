import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { recommendationsAPI } from "@/services/api";

interface Props {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RecommendPropertyModal: React.FC<Props> = ({ propertyId, isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleRecommend = async () => {
    try {
      await recommendationsAPI.recommendProperty(propertyId, email, message);
      toast({ title: "Recommendation sent!" });
      setEmail("");
      setMessage("");
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || err.message, variant: "destructive" });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Recommend Property</h2>
        <Input
          placeholder="Recipient's Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Optional message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleRecommend} className="flex-1">Send</Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendPropertyModal;
