document.getElementById("app").innerHTML = `
<h1>Image Upload Firebase</h1>
<div>
<input type="file" id="fileInput" />
</div>
`;

const fileInput = document.querySelector("#fileInput");

const uploadFile = (file) => {
  console.log("Uploading file...");
  const API_ENDPOINT =
    "https://us-central1-fir-cloud-587c5.cloudfunctions.net/uploadFile";
  const request = new XMLHttpRequest();
  const formData = new FormData();

  request.open("POST", API_ENDPOINT, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.responseText);
    }
  };
  formData.append("file", file);
  request.send(formData);
};

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  uploadFile(files[0]);
});
