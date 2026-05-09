import { MarketplaceClient } from "@/features/marketplace/marketplace-client";

export const metadata = {
  title: "Crop Marketplace | AgriHold AI",
};

export default function MarketplacePage() {
  return (
    <div className="h-full w-full">
      <MarketplaceClient />
    </div>
  );
}
