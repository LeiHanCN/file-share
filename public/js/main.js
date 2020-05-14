
const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
document.getElementsByClassName('upload-btn')[0].addEventListener('click', () => {
  uploadInput.click()
});

uploadInput.addEventListener('change', (e) => {
  upload()
});

function upload() {
  const formData = new FormData(uploadForm)
  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadForm.action, true);
  xhr.onload = function (e) {
    window.location.reload()
  }
  xhr.send(formData);
}
