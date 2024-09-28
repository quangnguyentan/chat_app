import { useState } from "react";

function CldUploadButton() {
  const [images, setImages] = useState("");
  const submitImage = () => {
    const data = new FormData();
    data.append("file", images);
    data.append("upload_preset", "i96i6rvi");
    data.append("cloud_name", "dlwx7hywr");
    fetch("https://api.cloudinary.com/v1_1/dlwx7hywr/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  return (
    <main className="main">
      <div>
        <input type="file" onChange={(e) => setImages(e.target.files[0])} />
        <button onClick={submitImage}>Upload</button>
      </div>
    </main>
  );
}

export default CldUploadButton;
