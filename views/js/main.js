
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

const uploadModal = document.getElementsByClassName('upload-modal')[0]
let exitedTimer
window.addEventListener('dragenter', e => {
  clearTimeout(exitedTimer)
  uploadModal.classList.remove('drag-exit')
  uploadModal.classList.add('drag-over')
})

uploadModal.addEventListener('dragleave', ev => {
  if (!uploadModal.classList.contains('drag-over')) {
    return;
  }

  uploadModal.classList.replace('drag-over', 'drag-exit')
  if (exitedTimer) {
    clearTimeout(exitedTimer)
  }
  exitedTimer = setTimeout(() => {
    uploadModal.classList.remove('drag-exit', 'drag-over')
  }, 1000)
})
uploadModal.addEventListener('dragover', e => {
  e.dataTransfer.dropEffect = 'copy';
  e.preventDefault();
  e.stopPropagation();
})
uploadModal.addEventListener('drop', e => {
  uploadModal.dispatchEvent(new Event('dragleave'))
  e.preventDefault();
  e.stopPropagation();
})