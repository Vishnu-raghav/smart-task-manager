const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmYesBtn = document.getElementById("confirmYes");
const confirmNoBtn = document.getElementById("confirmNo");

let confirmAction = null;

export function openConfirmModal(message, onConfirm) {
  confirmText.innerText = message;
  confirmAction = onConfirm;
  confirmModal.classList.add("active");
}

confirmYesBtn.addEventListener("click", () => {
  if (confirmAction) confirmAction();

  confirmAction = null;
  confirmModal.classList.remove("active");
});

confirmNoBtn.addEventListener("click", () => {
  confirmAction = null;
  confirmModal.classList.remove("active");
});

