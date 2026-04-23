import { NearbyClient } from "@/components/nearby-client";

type SearchParams = {
  coffee?: string;
};

export default async function NearbyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;

  return <NearbyClient coffeeName={resolved.coffee} />;
}