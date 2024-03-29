'use client';
import { useEffect, useRef, useState} from 'react';
import { fabric } from 'fabric';
import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { handleCanvasMouseDown, handleResize, initializeFabric } from '@/lib/canvas';
import { ActiveElement } from '@/types/type';
import { useMutation, useStorage } from '../../liveblocks.config';

export default function Home() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);

  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  });

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if(!object) return;

    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get('canvasObjects');

    canvasObjects.set(objectId, shapeData);
  },[])


  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;
  }


  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({ 
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current });
    });
  }, []);


  return (
    <main className='h-screen overflow-hidden ' >
      <Navbar 
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        
      />
      <section className='flex h-full flex-row'>
        <LeftSidebar />
        <Live canvasRef={canvasRef}  />
        <RightSidebar />
      </section>
    </main>
  );
}
