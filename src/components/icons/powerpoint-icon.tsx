import React from 'react';

function PowerpointIcon({ className }: { className?: string }) {
  return (
    <svg className={className} x="0" y="0" viewBox="0 0 48 48">
      <path
        fill="#FF8A65"
        d="M41 10H25v28h16a1 1 0 001-1V11a1 1 0 00-1-1z"
      ></path>
      <path
        fill="#FBE9E7"
        d="M24 29h14v2H24zm0 4h14v2H24zm6-18a6 6 0 000 12 6 6 0 006-6h-6v-6z"
      ></path>
      <path fill="#FBE9E7" d="M32 13v6h6a6 6 0 00-6-6z"></path>
      <path fill="#E64A19" d="M27 42L6 38V10l21-4z"></path>
      <path
        fill="#FFF"
        d="M16.828 17H12v14h3v-4.823h1.552c1.655 0 2.976-.436 3.965-1.304.988-.869 1.484-2.007 1.482-3.412C22 18.487 20.275 17 16.828 17zm-.534 6.785H15v-4.364h1.294c1.641 0 2.461.72 2.461 2.158 0 1.472-.82 2.206-2.461 2.206z"
      ></path>
    </svg>
  );
}

export { PowerpointIcon };
