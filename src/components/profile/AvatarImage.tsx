import { getAssetUrl } from '../../assets/registry/catalog';

interface AvatarImageProps {
  readonly assetId: string;
  readonly alt?: string;
  readonly className?: string;
}

export function AvatarImage({ assetId, alt = '', className }: AvatarImageProps) {
  return <img className={className} src={getAssetUrl(assetId)} alt={alt} draggable={false} />;
}
