import { useState, useEffect } from 'react';
import md5 from 'md5';

export default function Gavatar({ email, size = 40, className = '' }) {
  const [gravatarUrl, setGravatarUrl] = useState('');

  useEffect(() => {
    if (email) {
      const hash = md5(email.trim().toLowerCase());
      setGravatarUrl(`https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`);
    } else {
      setGravatarUrl(`https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=mp`);
    }
  }, [email, size]);

  return (
    <img
      src={gravatarUrl}
      alt="User avatar"
      className={`rounded-full ${className}`}
      width={size}
      height={size}
    />
  );
}
