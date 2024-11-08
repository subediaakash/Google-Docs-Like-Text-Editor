import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const [value, setValue] = useState("hi");

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
}

export default App;
