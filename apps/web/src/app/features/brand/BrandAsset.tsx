import type { CSSProperties } from "react";

type BrandAssetName = "logo" | "mark" | "wordmark";

interface BrandAssetProps {
  asset: BrandAssetName;
  className?: string;
  label?: string;
}

const BRAND_ASSET_PATHS: Record<BrandAssetName, string> = {
  logo: "/brand/lifestep-logo.svg",
  mark: "/brand/lifestep-mark.svg",
  wordmark: "/brand/lifestep-wordmark.svg"
};

export function BrandAsset({ asset, className = "", label }: BrandAssetProps) {
  const style = {
    "--brand-asset-url": `url("${BRAND_ASSET_PATHS[asset]}")`
  } as CSSProperties;

  return (
    <span
      className={`brand-asset ${className}`.trim()}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
