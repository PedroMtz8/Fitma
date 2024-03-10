import { CollaborativeApp } from './CollaborativeApp';
import { Room } from './Room';

export default async function Home() {

  return (
    <Room>
      <CollaborativeApp />
    </Room>
  );
}
