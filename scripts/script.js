function toggleSidebar() {
    let sidebar = document.querySelector("nav");
    sidebar.classList.toggle("display_sidebar");
    sidebar = document.querySelector("nav .sidebar");
    sidebar.classList.toggle("slide_sidebar");
}