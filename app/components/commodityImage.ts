export function getCommodityImage(commodity?: string | null): string {
  const c = (commodity || "").toLowerCase();
  if (/cabai|chili|rawit|paprika/.test(c)) return "/assets/asset-cabai.jpg";
  if (/tomat/.test(c)) return "/assets/asset-tomat.jpg";
  if (/jagung|corn/.test(c)) return "/assets/asset-jagung.jpg";
  if (/pakcoy|sawi|bok ?choy|sayur/.test(c)) return "/assets/asset-pakcoy.jpg";
  if (/beras|padi|rice|pandan/.test(c)) return "/assets/asset-beras.jpg";
  if (/kopi|coffee|arabika/.test(c)) return "/assets/asset-kopi.jpg";
  if (/bawang|onion/.test(c)) return "/assets/asset-bawang.jpg";
  return "/assets/asset-generik.jpg";
}
