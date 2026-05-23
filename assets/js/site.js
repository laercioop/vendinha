const menuDrawer = document.getElementById("menu-drawer");
const menuBackdrop = document.getElementById("menu-backdrop");
const openMenuButton = document.getElementById("open-menu");
const closeMenuButton = document.getElementById("close-menu");

function openMenu() {
  if (!menuDrawer || !menuBackdrop) return;
  menuDrawer.classList.add("open");
  menuDrawer.setAttribute("aria-hidden", "false");
  menuBackdrop.hidden = false;
}

function closeMenu() {
  if (!menuDrawer || !menuBackdrop) return;
  menuDrawer.classList.remove("open");
  menuDrawer.setAttribute("aria-hidden", "true");
  menuBackdrop.hidden = true;
}

openMenuButton?.addEventListener("click", openMenu);
closeMenuButton?.addEventListener("click", closeMenu);
menuBackdrop?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
