'use client';
import React, { useCallback } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useMyPresence, useOthers } from '../../liveblocks.config'

export default function Live() {
  const others = useOthers();

  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

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
    e.preventDefault();

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

  return (
    <div
      className='h-[100vh] w-full flex justify-center items-center relative'
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <h1 className='text-2xl text-white'>Hello World</h1>

      <LiveCursors others={others} />
    </div>
  )
}