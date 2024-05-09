import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  /** Loaded by index.html. */
  FBInstant
  .initializeAsync()
  .then(() => {
    FBInstant.setLoadingProgress(100);
  })
  .then(FBInstant.startGameAsync)
  .catch(error => console.log(error))
  .then(onStart);
});

function onStart() {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
