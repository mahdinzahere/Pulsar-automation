"use client";
import { useState } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);

  async function handleUpload() {
    if (!files?.length) return alert("Pick files first");
    alert("For MVP, upload via Supabase dashboard; programmatic upload route comes next.");
  }

  return (
    <main style={{padding:'2rem'}}>
      <h1 style={{fontSize:'1.25rem', fontWeight:600}}>Upload product photos</h1>
      <input type="file" accept="image/*" multiple onChange={(e)=>setFiles(e.target.files)} style={{marginTop:12}} />
      <button onClick={handleUpload} style={{marginTop:12, background:'#111', color:'#fff', padding:'8px 14px', borderRadius:8}}>Upload</button>
    </main>
  );
}
