import React from "react";
import styles from "./avatar.module.css";
import Image from 'next/image';

export function Avatar({ name, otherStyles }: { otherStyles: string; name: string }) {
  return (
    <div className={`${styles.avatar} ${otherStyles} w-9 h-9`} data-tooltip={name}>
      <Image
        src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
        fill
        alt='avatar picture'
        className={styles.avatar_picture}
      />
    </div>
  );
}