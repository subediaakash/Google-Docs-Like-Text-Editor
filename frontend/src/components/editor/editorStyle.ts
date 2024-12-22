const styles = `
  .editor-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 1rem;
    background-color: #f3f4f6;
  }
  .editor-header {
    width: 100%;
    max-width: 800px;
    padding: 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
    display: flex;
    justify-content: center;
    
    align-items: center;
  }
  .document-title {
    font-size: 1.5rem;
    font-weight: 600;

    color: #111827;
    margin: 0;
  }
  .menu-bar-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  .editor-content-container {
    width: 100%;
    max-width: 800px; 
    flex-grow: 1;
    overflow-y: auto;
    padding: 2rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
   
  }
  .ProseMirror {
    width: 100%;
    min-height: 600px; 
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    outline: none;
    font-size: 1rem;
    line-height: 1.8;
    color: #111827;
    
  }
  .ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.8;
  }
  .ProseMirror:focus {
    outline: none;
  }
  .bubble-menu {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .bubble-menu button {
    padding: 0.5rem 0.75rem;
    border: none;
    background-color: transparent;
    color: #374151;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;
  }
  .bubble-menu button:hover {
    background-color: #f3f4f6;
  }
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .editor-header {
      flex-direction: column;
      align-items: flex-start;
    }
    .menu-bar-container {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .editor-content-container {
      margin: 0.5rem;
      padding: 1rem;
      max-width: 100%;
      box-shadow: none;
    }
    .ProseMirror {
      padding: 1rem;
      min-height: 400px; 
    }
  }
`;
export default styles;
