'use client';
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useMyPresence, useOthers } from '../../liveblocks.config'
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState } from '@/types/type';

export default function Live() {
  const others = useOthers();

  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const [curstorState, setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;

    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
    updateMyPresence({
      cursor: {
        x,
        y,
      }
    });
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    
    setCursorState({ mode: CursorMode.Hidden })

    updateMyPresence({
      cursor: null,
      message: null,
    });


  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {

    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;

    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({
      cursor: {
        x,
        y,
      }
    });
  }, []);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({ 
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '', 
        });
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' });
        setCursorState({ mode: CursorMode.Hidden });
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        // setCursorState({ mode: CursorMode.Hidden });
      }
    }

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    }

  }, [updateMyPresence]);

  return (
    <div
      className='h-[100vh] w-full flex justify-center items-center text-center '
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <h1 className='text-2xl text-white'>Hello World</h1>
      { cursor &&  (
        <CursorChat 
          cursor={cursor} 
          cursorState={curstorState}
          setCursorState={setCursorState} 
          updateMyPresence={updateMyPresence}
        />
      ) }
      <LiveCursors others={others} />
    </div>
  )
}
