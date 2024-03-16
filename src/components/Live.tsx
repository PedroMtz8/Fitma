'use client';
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '../../liveblocks.config'
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

export default function Live() {
  const others = useOthers();

  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const [cursorState, setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden });

  const [reaction, setReaction] = useState<Reaction[]>([]);

  const broadcast = useBroadcastEvent();

  useInterval(() => {
    if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
      setReaction((reactions) => [
        ...reactions,
        {
          point: {
            x: cursor.x,
            y: cursor.y,
          },
          value: cursorState.reaction,
          timestamp: Date.now(),
        }
      ])
      broadcast({
        // type: 'reaction',
        // reaction: cursorState.reaction,
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      })
    }
  }, 100)

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;

    setReaction((reactions) => [
      ...reactions,
      {
        point: {
          x: event.x,
          y: event.y,
        },
        value: event.value,
        timestamp: Date.now(),
      }
    ])
  })

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector){
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
  
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
      updateMyPresence({
        cursor: {
          x,
          y,
        }
      });
    }

  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    
    setCursorState({ mode: CursorMode.Hidden })

    updateMyPresence({
      cursor: null,
      message: null,
    });


  }, []);

  /* POINTER UP */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed: false } : state )
  }, [cursorState.mode, setCursorState]);

  /* POINTER DOWN */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {

    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;

    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({
      cursor: {
        x,
        y,
      }
    });

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed: true } : state )

  }, [cursorState.mode, setCursorState]);

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
      } else if (e.key === 'e') {
        setCursorState({ mode: CursorMode.ReactionSelector });
        // updateMyPresence({ message: cursorState.message });
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

  const setReactions = useCallback((reaction: string) => {
    setCursorState({
      mode: CursorMode.Reaction,
      reaction,
      isPressed: true,
    })
  },[]) 

  return (
    <div
      className='h-[100vh] w-full flex justify-center items-center text-center '
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
    >
      <h1 className='text-2xl text-white'>Hello World</h1>

      {
        reaction.map((r, index) => (
          <FlyingReaction 
            key={r.timestamp.toString()}
            x={r.point.x}
            y={r.point.y}
            timestamp={r.timestamp}
            value={r.value}
          />
        ))
      }

      { cursor &&  (
        <CursorChat 
          cursor={cursor} 
          cursorState={cursorState}
          setCursorState={setCursorState} 
          updateMyPresence={updateMyPresence}
        />
      ) }
      { cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={setReactions}

        />
      )}
      <LiveCursors others={others} />
    </div>
  )
}
