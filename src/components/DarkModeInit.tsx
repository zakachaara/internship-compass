import { useEffect } from 'react';

// Set dark mode by default
if (!document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.add('dark');
}

export default function DarkModeInit() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return null;
}
