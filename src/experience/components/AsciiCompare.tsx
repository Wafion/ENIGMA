import { Figure } from './primitives';

export function AsciiCompare({ assetId }: { assetId: string }) {
  return (
    <Figure
      assetId={assetId}
      className="figure--woods-compare"
      caption="Late-October hardwood forest in Seneca Creek State Park, Maryland. The film’s forest expedition was staged in this park, where bare canopy and camera grain blurred the distinction between trees and stick effigies."
      note="Seneca Creek State Park, Montgomery County, MD. Photograph by randomduck, CC BY-SA 2.0."
    />
  );
}
