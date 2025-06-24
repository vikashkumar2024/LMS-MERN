import { Description } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for the editor

const  RichTextEditor=({input,setInput})=> {
  const [value, setValue] = useState('');
 const handleChange=(content)=>{
    setInput({
      ...input,
      description:content
    });
 }
  return <ReactQuill theme="snow" value={input.description} onChange={handleChange} />;
}
export default RichTextEditor;