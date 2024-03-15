import React from 'react'
import CursorSVG from '../../../public/assets/CursorSVG';


type Props = {
  color: string;
  x: number;
  y: number;
  message: string;
}

export default function Cursor({ color, x, y, message }: Props) {
  console.log('message', message)
  return (
    <div 
      className='pointer-events-none absolute top-0 left-0' 
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }} 
    
    >
      <CursorSVG color={color} />

      {/* MESSAGE */}

      {
        message && (
          <div 
            className='absolute left-2 top-5 bg-blue-500 px-4 py-2  text-white rounded-3xl'
            style={{ backgroundColor: color, /* transform: `translateX(-50%) translateY(-100%)` */ }}
          >
            <p className='text-white whitespace-nowrap text-sm leading-relaxed'>{message}</p>
          </div>
        )
      }

    </div>
  )
}
