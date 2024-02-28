import React from 'react';
import { createRoot } from 'react-dom/client';
import Assistant from './components/Assistant';

const App = function () {
  return (
    <>
      <Assistant />
    </>
  );
};
console.log('page_assistant_root----------loaded---------');
const container = document.createElement('div') as HTMLElement;
container.id = 'page_assistant_root';
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
