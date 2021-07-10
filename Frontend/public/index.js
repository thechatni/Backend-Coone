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
      document.getElementById("result").innerHTML = `
      <h3 id='correct'>Image uploaded to firebase storage bucket successfully!</h3>
      `;
    } else {
      document.getElementById("result").innerHTML = `
      <h3 id='wrong'>Image upload failed</h3>
      `;
    }
  };
  formData.append("file", file);
  request.send(formData);
};

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  if (files[0].type === "image/png" || files[0].type === "image/jpeg") {
    uploadFile(files[0]);
  } else {
    document.getElementById("result").innerHTML = `
      <h3 id='wrong'>Invalid upload type. Only png/jpeg images can be uploaded.</h3>
      `;
  }
});
